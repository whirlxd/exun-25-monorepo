package database

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DB                          *mongo.Database
	Client                      *mongo.Client
	UsersCollection             *mongo.Collection
	WorkersCollection           *mongo.Collection
	MissionsCollection          *mongo.Collection
	GamblingContractsCollection *mongo.Collection
	MessagesCollection          *mongo.Collection
)

func Connect(uri string, dbName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return fmt.Errorf("mongo connection fail: %w", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return fmt.Errorf("mongo ping fail: %w", err)
	}

	Client = client
	DB = client.Database(dbName)
	UsersCollection = DB.Collection("users")
	WorkersCollection = DB.Collection("workers")
	MissionsCollection = DB.Collection("missions")
	GamblingContractsCollection = DB.Collection("gambling_contracts")
	MessagesCollection = DB.Collection("messages")

	fmt.Println("Connected to db")
	return nil
}

func Disconnect() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if Client != nil {
		return Client.Disconnect(ctx)
	}
	return nil
}
