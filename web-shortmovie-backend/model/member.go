package model

import "gorm.io/gorm"

type Member struct {
	gorm.Model
	Id               uint   `json:"id" gorm:"primaryKey"`
	FullName         string `json:"full_name" gorm:"type:varchar(100);not null"`
	Nim              string `json:"nim" gorm:"type:varchar(20);not null"`
	Age              int    `json:"age" gorm:"type:int;not null"`
	Job              string `json:"job" gorm:"type:varchar(100);not null"`
	Location         string `json:"location" gorm:"type:varchar(100);not null"`
	InstagramAccount string `json:"instagram_account" gorm:"type:varchar(100);not null"`
	LinkToInstagram  string `json:"link_to_instagram" gorm:"type:varchar(255);not null"`
	Quote            string `json:"quote" gorm:"type:varchar(255);not null"`
	ImagePath        string `json:"image_path" gorm:"type:varchar(255);not null"`
}