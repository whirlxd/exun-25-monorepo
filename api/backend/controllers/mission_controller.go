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


func CreateMission(c *gin.Context) {
	var req models.MissionRequest

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


	missionID := utils.GenerateID()
	missionHash := utils.GenerateHash()


	mission := models.Mission{
		MissionID: missionID,
		Hash:      missionHash,
		UserHash:  req.UserHash,
		Date:      req.Date,
		Time:      req.Time,
		Location:  req.Location,
		CreatedAt: time.Now(),
	}

	result, err := database.MissionsCollection.InsertOne(ctx, mission)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create mission"})
		return
	}

	mission.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Mission created successfully",
		"mission": mission,
	})
}


func GetMissionByHash(c *gin.Context) {
	hash := c.Param("hash")
	attribute := c.Query("attr") // Optional attribute filter

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	var mission models.Mission
	err := database.MissionsCollection.FindOne(ctx, bson.M{"hash": hash}).Decode(&mission)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Mission not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}


	if attribute != "" {
		attribute = strings.ToLower(attribute)
		switch attribute {
		case "id", "mission_id":
			c.JSON(http.StatusOK, gin.H{"mission_id": mission.MissionID})
		case "hash":
			c.JSON(http.StatusOK, gin.H{"hash": mission.Hash})
		case "date":
			c.JSON(http.StatusOK, gin.H{"date": mission.Date})
		case "time":
			c.JSON(http.StatusOK, gin.H{"time": mission.Time})
		case "location":
			c.JSON(http.StatusOK, gin.H{"location": mission.Location})
		case "user_hash", "user":
			c.JSON(http.StatusOK, gin.H{"user_hash": mission.UserHash})
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attribute. Valid attributes: id, hash, date, time, location, user_hash"})
			return
		}
		return
	}


	c.JSON(http.StatusOK, mission)
}


func GetLatestMission(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	var mission models.Mission
	sortOpts := bson.M{"created_at": -1}
	opts := options.FindOne().SetSort(sortOpts)
	err := database.MissionsCollection.FindOne(ctx, bson.M{}, opts).Decode(&mission)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "No mission found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, mission)
}
