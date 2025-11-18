package routes

import (
	"net/http"

	"exun/backend-go/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Ts for you soulshadow ",
			"endpoints": gin.H{
				"POST /auth/signup":                   "Create a new user account (hirer)",
				"POST /auth/worker/signup":            "Create a new worker account",
				"POST /auth/worker/login":             "Login as worker",
				"POST /chat/send":                     "Send a message",
				"GET /chat/messages/:hash?with=<hash>": "Get messages between two users",
				"GET /chat/conversations/:hash":       "Get all conversations for a user/worker",
				"POST /mission":                       "Create a new mission",
				"GET /mission/latest":                 "Get the latest mission",
				"GET /mission/:hash":                  "Get mission by hash",
				"GET /mission/:hash?attr=<attribute>": "Get specific attribute from mission",
				"POST /gambling":                      "Create a new gambling contract",
				"GET /gambling/latest":                "Get the latest gambling contract",
				"GET /gambling/:hash":                 "Get gambling contract by hash",
				"GET /gambling/:hash?attr=<attribute>": "Get specific attribute from gambling contract",
			},
		})
	})

	
	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "hitman-api"})
	})

	auth := r.Group("/auth")
	{
		auth.POST("/signup", controllers.Signup)
		auth.POST("/worker/signup", controllers.WorkerSignup)
		auth.POST("/worker/login", controllers.WorkerLogin)
	}

	chat := r.Group("/chat")
	{
		chat.POST("/send", controllers.SendMessage)
		chat.GET("/messages/:hash", controllers.GetMessages)
		chat.GET("/conversations/:hash", controllers.GetConversations)
	}
	r.POST("/mission", controllers.CreateMission)
	r.GET("/mission/latest", controllers.GetLatestMission)
	r.GET("/mission/:hash", controllers.GetMissionByHash)

	r.POST("/gambling", controllers.CreateGamblingContract)
	r.GET("/gambling/latest", controllers.GetLatestGamblingContract)
	r.GET("/gambling/:hash", controllers.GetGamblingContractByHash)
}
