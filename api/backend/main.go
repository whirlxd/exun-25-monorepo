package main

import (
	"fmt"
	"log"
	"os"

	"exun/backend-go/database"
	"exun/backend-go/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
	// dev
		mongoURI = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("MONGODB_DB")
	if dbName == "" {
		dbName = "hitman_db"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Connecting to MongoDB at %s...\n", mongoURI)
	if err := database.Connect(mongoURI, dbName); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := database.Disconnect(); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	routes.SetupRoutes(router)

	addr := ":" + port
	log.Printf("Starting server on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
