package controllers

import (
	"context"
	"net/http"
	"strings"
	"time"

	"exun/backend-go/database"
	"exun/backend-go/models"
	"exun/backend-go/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func CreateGamblingContract(c *gin.Context) {
	var req models.GamblingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	var user models.User
	err := database.UsersCollection.FindOne(ctx, bson.M{"hash": req.UserHash}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User hash not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	contract := models.GamblingContract{
		ContractID:   utils.GenerateID(),
		Hash:         utils.GenerateHash(),
		UserHash:     req.UserHash,
		Venue:        req.Venue,
		GameType:     req.GameType,
		BuyIn:        req.BuyIn,
		Date:         req.Date,
		StartTime:    req.StartTime,
		Duration:     req.Duration,
		PaymentType:  req.PaymentType,
		AgreeToTerms: req.AgreeToTerms,
		CreatedAt:    time.Now(),
	}

	result, err := database.GamblingContractsCollection.InsertOne(ctx, contract)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create gambling contract"})
		return
	}

	contract.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Gambling contract created successfully",
		"contract": contract,
	})
}


func GetGamblingContractByHash(c *gin.Context) {
	hash := c.Param("hash")
	attribute := c.Query("attr")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var contract models.GamblingContract
	err := database.GamblingContractsCollection.FindOne(ctx, bson.M{"hash": hash}).Decode(&contract)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Gambling contract not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if attribute != "" {
		switch strings.ToLower(attribute) {
		case "id", "contract_id":
			c.JSON(http.StatusOK, gin.H{"contract_id": contract.ContractID})
		case "hash":
			c.JSON(http.StatusOK, gin.H{"hash": contract.Hash})
		case "venue":
			c.JSON(http.StatusOK, gin.H{"venue": contract.Venue})
		case "game_type", "game":
			c.JSON(http.StatusOK, gin.H{"game_type": contract.GameType})
		case "buy_in", "stake":
			c.JSON(http.StatusOK, gin.H{"buy_in": contract.BuyIn})
		case "date":
			c.JSON(http.StatusOK, gin.H{"date": contract.Date})
		case "start_time", "time":
			c.JSON(http.StatusOK, gin.H{"start_time": contract.StartTime})
		case "duration":
			c.JSON(http.StatusOK, gin.H{"duration": contract.Duration})
		case "payment_type", "payment":
			c.JSON(http.StatusOK, gin.H{"payment_type": contract.PaymentType})
		case "agree_to_terms", "terms":
			c.JSON(http.StatusOK, gin.H{"agree_to_terms": contract.AgreeToTerms})
		case "user_hash", "user":
			c.JSON(http.StatusOK, gin.H{"user_hash": contract.UserHash})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attribute. Valid attributes: contract_id, hash, venue, game_type, buy_in, date, start_time, duration, payment_type, agree_to_terms, user_hash"})
		}
		return
	}

	c.JSON(http.StatusOK, contract)
}


func GetLatestGamblingContract(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var contract models.GamblingContract
	opts := options.FindOne().SetSort(bson.M{"created_at": -1})
	err := database.GamblingContractsCollection.FindOne(ctx, bson.M{}, opts).Decode(&contract)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "No gambling contract found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, contract)
}

