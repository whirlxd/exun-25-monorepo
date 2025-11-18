package controllers

import (
	"context"
	"net/http"
	"time"

	"exun/backend-go/database"
	"exun/backend-go/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func SendMessage(c *gin.Context) {
	var req models.SendMessageRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	
	var fromType, toType string

	
	var user models.User
	err := database.UsersCollection.FindOne(ctx, bson.M{"hash": req.FromHash}).Decode(&user)
	if err == nil {
		fromType = "user"
	} else if err == mongo.ErrNoDocuments {
		
		var worker models.Worker
		err = database.WorkersCollection.FindOne(ctx, bson.M{"hash": req.FromHash}).Decode(&worker)
		if err == nil {
			fromType = "worker"
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "From hash not found"})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	
	err = database.UsersCollection.FindOne(ctx, bson.M{"hash": req.ToHash}).Decode(&user)
	if err == nil {
		toType = "user"
	} else if err == mongo.ErrNoDocuments {
		
		var worker models.Worker
		err = database.WorkersCollection.FindOne(ctx, bson.M{"hash": req.ToHash}).Decode(&worker)
		if err == nil {
			toType = "worker"
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "To hash not found"})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}


	message := models.Message{
		FromHash:  req.FromHash,
		ToHash:    req.ToHash,
		FromType:  fromType,
		ToType:    toType,
		Content:   req.Content,
		Read:      false,
		CreatedAt: time.Now(),
	}

	result, err := database.MessagesCollection.InsertOne(ctx, message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	message.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Message sent successfully",
		"data":    message,
	})
}


func GetMessages(c *gin.Context) {
	myHash := c.Param("hash")
	otherHash := c.Query("with") 

	if otherHash == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing 'with' query parameter"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	
	filter := bson.M{
		"$or": []bson.M{
			{"from_hash": myHash, "to_hash": otherHash},
			{"from_hash": otherHash, "to_hash": myHash},
		},
	}

	opts := options.Find().SetSort(bson.M{"created_at": 1})
	cursor, err := database.MessagesCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer cursor.Close(ctx)

	var messages []models.Message
	if err = cursor.All(ctx, &messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve messages"})
		return
	}

	
	updateFilter := bson.M{
		"to_hash": myHash,
		"from_hash": otherHash,
		"read": false,
	}
	update := bson.M{"$set": bson.M{"read": true}}
	database.MessagesCollection.UpdateMany(ctx, updateFilter, update)

	c.JSON(http.StatusOK, gin.H{
		"messages": messages,
	})
}


func GetConversations(c *gin.Context) {
	myHash := c.Param("hash")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	filter := bson.M{
		"$or": []bson.M{
			{"from_hash": myHash},
			{"to_hash": myHash},
		},
	}

	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := database.MessagesCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer cursor.Close(ctx)

	var messages []models.Message
	if err = cursor.All(ctx, &messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve conversations"})
		return
	}


	conversationsMap := make(map[string]*models.Conversation)

	for _, msg := range messages {
		var participantHash string
		var participantType string

		if msg.FromHash == myHash {
			participantHash = msg.ToHash
			participantType = msg.ToType
		} else {
			participantHash = msg.FromHash
			participantType = msg.FromType
		}

		if conv, exists := conversationsMap[participantHash]; exists {
		
			if !msg.Read && msg.ToHash == myHash {
				conv.UnreadCount++
			}
		} else {
		
			unreadCount := 0
			if !msg.Read && msg.ToHash == myHash {
				unreadCount = 1
			}
			conversationsMap[participantHash] = &models.Conversation{
				ParticipantHash: participantHash,
				ParticipantType: participantType,
				LastMessage:     msg.Content,
				LastMessageTime: msg.CreatedAt,
				UnreadCount:     unreadCount,
			}
		}
	}


	conversations := make([]models.Conversation, 0, len(conversationsMap))
	for _, conv := range conversationsMap {
		conversations = append(conversations, *conv)
	}

	c.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})
}

