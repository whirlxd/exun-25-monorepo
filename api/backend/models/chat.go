package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Message struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	FromHash  string             `json:"from_hash" bson:"from_hash"`   
	ToHash    string             `json:"to_hash" bson:"to_hash"`       
	FromType  string             `json:"from_type" bson:"from_type"`   // user or worker
	ToType    string             `json:"to_type" bson:"to_type"`       
	Content   string             `json:"content" bson:"content"`
	Read      bool               `json:"read" bson:"read"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}


type SendMessageRequest struct {
	FromHash string `json:"from_hash" binding:"required"`
	ToHash   string `json:"to_hash" binding:"required"`
	Content  string `json:"content" binding:"required"`
}

type Conversation struct {
	ParticipantHash string    `json:"participant_hash"`
	ParticipantType string    `json:"participant_type"` 
	LastMessage     string    `json:"last_message"`
	LastMessageTime time.Time `json:"last_message_time"`
	UnreadCount     int       `json:"unread_count"`
}

