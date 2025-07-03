package database

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/AryoBaskoro/web-shortmovie/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	host := os.Getenv("DB_HOST")
	port,_ := strconv.Atoi(os.Getenv("DB_PORT"))
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	
	db, err := gorm.Open(postgres.Open(psqlInfo), &gorm.Config{})
	if err != nil {
		log.Printf("Error connecting to the database: %v", err)
		return nil
	}

	log.Println("Successfully connected to database!")
	return db
}

func SeedMembers(db *gorm.DB) {
	var count int64
	db.Model(&model.Member{}).Count(&count)
	
	if count > 0 {
		log.Println("Members already exist, skipping seed")
		return
	}

	members := []model.Member{
		{
			FullName:         "Dheovan Winata Alvian",
			Nim:              "2702283045",
			Age:              20,
			Job:              "Actor",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@dheovan.w.a",
			LinkToInstagram:  "https://www.instagram.com/dheovan.w.a?igsh=MTFocm10aHFqMXVsNA==",
			Quote:            "Every frame tells a story, every story changes lives.",
			ImagePath:        "/assets/member_image/dheovan.jpg",
		},
		{
			FullName:         "Raphael Brian Pratama",
			Nim:              "2702275024",
			Age:              20,
			Job:              "Actor",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@raphaelpratama_",
			LinkToInstagram:  "https://www.instagram.com/raphaelpratama_?igsh=eHFkaWw1bWZpdjBp",
			Quote:            "Light is the language of cinema, shadows are its poetry.",
			ImagePath:        "/assets/member_image/raphael.jpg",
		},
		{
			FullName:         "Muhammad Aryo Baskoro",
			Nim:              "2702382221",
			Age:              20,
			Job:              "Actor, Web Developer & Designer",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@aryobskoro_",
			LinkToInstagram:  "https://www.instagram.com/aryobskoro_?igsh=dmp6eGhzbjJiZW9r",
			Quote:            "Great films are born from great collaboration and vision.",
			ImagePath:        "/assets/member_image/aryo.jpg",
		},
		{
			FullName:         "Evaldo Raynardi",
			Nim:              "2702232750",
			Age:              20,
			Job:              "Actor",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@evaldo_raynardi",
			LinkToInstagram:  "https://www.instagram.com/evaldo_raynardi?igsh=cXp3aG1tbmtrcWYy",
			Quote:            "Acting is not pretending, it's finding the truth in fiction.",
			ImagePath:        "/assets/member_image/evaldo.jpg",
		},
		{
			FullName:         "Matthew Nathanael Halim",
			Nim:              "2702217402",
			Age:              20,
			Job:              "Script Author, Editor",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@matt.nael",
			LinkToInstagram:  "https://www.instagram.com/matt.nael?igsh=MWhpcHQzcWlsYzRhdg==",
			Quote:            "Editing is where the story truly comes to life.",
			ImagePath:        "/assets/member_image/matthew.jpg",
		},
		{
			FullName:         "Winsen Olando",
			Nim:              "2702280844",
			Age:              20,
			Job:              "Script Author, Cinematographer, Editor",
			Location:         "Jakarta, Indonesia",
			InstagramAccount: "@winsen_olando",
			LinkToInstagram:  "https://www.instagram.com/winsen_olando?igsh=aDBzdnd6cWF3dmJk",
			Quote:            "Sound is the heartbeat of cinema.",
			ImagePath:        "/assets/member_image/winsen.png",
		},
	}

	result := db.Create(&members)
	if result.Error != nil {
		log.Printf("Error seeding members: %v", result.Error)
		return
	}

	log.Printf("Successfully seeded %d members", len(members))
}