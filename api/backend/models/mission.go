package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Mission struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	MissionID string             `json:"mission_id" bson:"mission_id"` // A3F1-91BC 
	Hash      string             `json:"hash" bson:"hash"`             
	UserHash  string             `json:"user_hash" bson:"user_hash"`   
	Date      string             `json:"date" bson:"date"`
	Time      string             `json:"time" bson:"time"`
	Location  string             `json:"location" bson:"location"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}


type MissionRequest struct {
	UserHash string `json:"user_hash" binding:"required"`
	Date     string `json:"date" binding:"required"`
	Time     string `json:"time" binding:"required"`
	Location string `json:"location" binding:"required"`
}
