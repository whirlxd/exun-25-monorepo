package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type Worker struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Username  string             `json:"username" bson:"username"`
	Email     string             `json:"email" bson:"email"`
	Password  string             `json:"-" bson:"password"` // Hidden from JSON
	Hash      string             `json:"hash" bson:"hash"`  // Worker's unique hash/ID
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}


type WorkerSignupRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}


type WorkerLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}


type WorkerSignupResponse struct {
	Message string `json:"message"`
	Worker  struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Hash     string `json:"hash"`
	} `json:"worker"`
}


type WorkerLoginResponse struct {
	Message string `json:"message"`
	Token   string `json:"token"` // Worker hash used as token
	Worker  struct {
		ID       string `json:"id"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Hash     string `json:"hash"`
	} `json:"worker"`
}

