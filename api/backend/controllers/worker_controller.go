package controllers

import (
	"context"
	"net/http"
	"time"

	"exun/backend-go/database"
	"exun/backend-go/models"
	"exun/backend-go/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)


func WorkerSignup(c *gin.Context) {
	var req models.WorkerSignupRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	var existingWorker models.Worker
	err := database.WorkersCollection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&existingWorker)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Worker with this email already exists"})
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}


	err = database.WorkersCollection.FindOne(ctx, bson.M{"username": req.Username}).Decode(&existingWorker)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}


	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}


	workerHash := utils.GenerateHash()


	worker := models.Worker{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		Hash:      workerHash,
		CreatedAt: time.Now(),
	}

	result, err := database.WorkersCollection.InsertOne(ctx, worker)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create worker"})
		return
	}


	response := models.WorkerSignupResponse{
		Message: "Worker account created successfully",
	}
	response.Worker.ID = result.InsertedID.(primitive.ObjectID).Hex()
	response.Worker.Username = worker.Username
	response.Worker.Email = worker.Email
	response.Worker.Hash = worker.Hash

	c.JSON(http.StatusCreated, response)
}


func WorkerLogin(c *gin.Context) {
	var req models.WorkerLoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()


	var worker models.Worker
	err := database.WorkersCollection.FindOne(ctx, bson.M{"email": req.Email}).Decode(&worker)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}


	err = bcrypt.CompareHashAndPassword([]byte(worker.Password), []byte(req.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}


	response := models.WorkerLoginResponse{
		Message: "Login successful",
		Token:   worker.Hash, // Use hash as token
	}
	response.Worker.ID = worker.ID.Hex()
	response.Worker.Username = worker.Username
	response.Worker.Email = worker.Email
	response.Worker.Hash = worker.Hash

	c.JSON(http.StatusOK, response)
}

