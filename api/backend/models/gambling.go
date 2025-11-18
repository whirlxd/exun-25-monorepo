package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type GamblingContract struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ContractID   string             `json:"contract_id" bson:"contract_id"`
	Hash         string             `json:"hash" bson:"hash"`
	UserHash     string             `json:"user_hash" bson:"user_hash"`
	Venue        string             `json:"venue" bson:"venue"`
	GameType     string             `json:"game_type" bson:"game_type"`
	BuyIn        string             `json:"buy_in" bson:"buy_in"`
	Date         string             `json:"date" bson:"date"`
	StartTime    string             `json:"start_time" bson:"start_time"`
	Duration     string             `json:"duration" bson:"duration"`
	PaymentType  string             `json:"payment_type" bson:"payment_type"`
	AgreeToTerms bool               `json:"agree_to_terms" bson:"agree_to_terms"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
}


type GamblingRequest struct {
	UserHash     string `json:"user_hash" binding:"required"`
	Venue        string `json:"venue" binding:"required"`
	GameType     string `json:"game_type" binding:"required"`
	BuyIn        string `json:"buy_in" binding:"required"`
	Date         string `json:"date" binding:"required"`
	StartTime    string `json:"start_time" binding:"required"`
	Duration     string `json:"duration" binding:"required"`
	PaymentType  string `json:"payment_type" binding:"required"`
	AgreeToTerms bool   `json:"agree_to_terms" binding:"required"`
}

