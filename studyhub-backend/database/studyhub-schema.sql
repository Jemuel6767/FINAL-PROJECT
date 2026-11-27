CREATE DATABASE IF NOT EXISTS studyhub_v2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE studyhub_v2;

CREATE TABLE IF NOT EXISTS `User` (
  UserID INT NOT NULL AUTO_INCREMENT,
  FullName VARCHAR(100) NOT NULL,
  Email VARCHAR(150) NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  Role VARCHAR(10) NOT NULL,
  PRIMARY KEY (UserID),
  UNIQUE KEY uq_User_Email (Email),
  CONSTRAINT chk_User_Role CHECK (Role IN ('Teacher', 'Student'))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Subject (
  SubjectID INT NOT NULL AUTO_INCREMENT,
  SubjectCode VARCHAR(20) NOT NULL,
  SubjectName VARCHAR(100) NOT NULL,
  PRIMARY KEY (SubjectID),
  UNIQUE KEY uq_Subject_SubjectCode (SubjectCode)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Category (
  CategoryID INT NOT NULL AUTO_INCREMENT,
  CategoryName VARCHAR(50) NOT NULL,
  PRIMARY KEY (CategoryID),
  UNIQUE KEY uq_Category_CategoryName (CategoryName)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS LearningMaterial (
  MaterialID INT NOT NULL AUTO_INCREMENT,
  Title VARCHAR(150) NOT NULL,
  Description TEXT NULL,
  FilePath VARCHAR(255) NOT NULL,
  UploadDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UserID INT NOT NULL,
  SubjectID INT NOT NULL,
  CategoryID INT NOT NULL,
  PRIMARY KEY (MaterialID),
  KEY idx_LearningMaterial_UserID (UserID),
  KEY idx_LearningMaterial_SubjectID (SubjectID),
  KEY idx_LearningMaterial_CategoryID (CategoryID),
  CONSTRAINT fk_LearningMaterial_User FOREIGN KEY (UserID) REFERENCES `User` (UserID) ON DELETE RESTRICT,
  CONSTRAINT fk_LearningMaterial_Subject FOREIGN KEY (SubjectID) REFERENCES Subject (SubjectID) ON DELETE RESTRICT,
  CONSTRAINT fk_LearningMaterial_Category FOREIGN KEY (CategoryID) REFERENCES Category (CategoryID) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Download (
  DownloadID INT NOT NULL AUTO_INCREMENT,
  UserID INT NOT NULL,
  MaterialID INT NOT NULL,
  DownloadDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (DownloadID),
  KEY idx_Download_UserID (UserID),
  KEY idx_Download_MaterialID (MaterialID),
  CONSTRAINT fk_Download_User FOREIGN KEY (UserID) REFERENCES `User` (UserID) ON DELETE RESTRICT,
  CONSTRAINT fk_Download_LearningMaterial FOREIGN KEY (MaterialID) REFERENCES LearningMaterial (MaterialID) ON DELETE RESTRICT
) ENGINE=InnoDB;
