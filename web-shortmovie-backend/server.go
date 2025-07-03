package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/AryoBaskoro/web-shortmovie/database"
	"github.com/AryoBaskoro/web-shortmovie/model"
)

func main() {
	db := database.ConnectDB()
	if db == nil {
		log.Fatal("Failed to connect to database")
	}

	err := db.AutoMigrate(&model.Member{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	database.SeedMembers(db)

	router := gin.Default()

	router.Static("/assets", "./assets")

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.GET("/api/members", func(c *gin.Context) {
		var members []model.Member
		result := db.Find(&members)
		
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to fetch members",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": members,
		})
	})

	router.GET("/api/members/:id", func(c *gin.Context) {
		id := c.Param("id")
		var member model.Member
		
		result := db.First(&member, id)
		if result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Member not found",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": member,
		})
	})

	log.Println("Server starting on port 8080...")
	router.Run(":8080")
}