-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: 127.0.0.1    Database: user_auth_db
-- ------------------------------------------------------
-- Server version	8.4.10-google

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `featured_carousel`
--

LOCK TABLES `featured_carousel` WRITE;
/*!40000 ALTER TABLE `featured_carousel` DISABLE KEYS */;
/*!40000 ALTER TABLE `featured_carousel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` (`id`, `image_url`, `category`, `album_type`, `title`, `description`, `created_at`) VALUES (1,'/static/uploads/Gallery/LOL.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(2,'/static/uploads/Gallery/8.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(3,'/static/uploads/Gallery/9.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(4,'/static/uploads/Gallery/Untitled_design_(19).png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(5,'/static/uploads/Gallery/3_3.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(6,'/static/uploads/Gallery/4.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(7,'/static/uploads/Gallery/5.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(8,'/static/uploads/Gallery/2_3.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(9,'/static/uploads/Gallery/6.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(10,'/static/uploads/Gallery/SCHOOL_VISIT.png','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(11,'/static/uploads/Gallery/FIDE RATED/IMG_2142.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(12,'/static/uploads/Gallery/FIDE RATED/IMG_2317.jpeg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(13,'/static/uploads/Gallery/FIDE RATED/IMG_3706.jpeg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(14,'/static/uploads/Gallery/FIDE RATED/IMG_2225.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(15,'/static/uploads/Gallery/FIDE RATED/IMG_2158.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(16,'/static/uploads/Gallery/FIDE RATED/IMG_2310.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(17,'/static/uploads/Gallery/FIDE RATED/IMG_2311.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(18,'/static/uploads/Gallery/FIDE RATED/IMG_2313.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(19,'/static/uploads/Gallery/FIDE RATED/DSC_5700.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(20,'/static/uploads/Gallery/FIDE RATED/IMG_2043.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(21,'/static/uploads/Gallery/FIDE RATED/IMG_2279.jpeg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(22,'/static/uploads/Gallery/FIDE RATED/DSC_5661.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(23,'/static/uploads/Gallery/FIDE RATED/IMG_2300.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(24,'/static/uploads/Gallery/FIDE RATED/IMG20260207194824.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(25,'/static/uploads/Gallery/FIDE RATED/DSC_5651.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(26,'/static/uploads/Gallery/FIDE RATED/IMG_2285.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(27,'/static/uploads/Gallery/FIDE RATED/IMG_2126.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(28,'/static/uploads/Gallery/FIDE RATED/DSC_5654.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(29,'/static/uploads/Gallery/FIDE RATED/DSC_5697.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(30,'/static/uploads/Gallery/FIDE RATED/IMG_3729.jpeg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(31,'/static/uploads/Gallery/FIDE RATED/DSC_5621.JPG','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(32,'/static/uploads/Gallery/FIDE RATED/IMG_2231.CR3.jpg','','FIDE_RATED',NULL,NULL,'2026-07-19 14:38:27'),(33,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.00_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(34,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.52_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(35,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.42_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(36,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.09_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(37,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.19_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(38,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.10_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(39,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.00_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(40,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.01_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(41,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.57_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(42,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.43_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(43,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.53_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(44,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.08_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(45,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.00_PM_(2).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(46,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.48_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(47,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.58_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(48,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.13_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(49,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.57_PM_(2).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(50,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.50_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(51,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.58_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(52,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.59_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(53,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.49_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(54,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.12_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(55,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.17_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(56,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.55_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(57,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.45_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(58,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.56_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(59,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.44_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(60,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.54_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(61,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.20_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(62,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.06_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(63,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.16_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(64,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.45_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(65,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.56_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(66,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.46_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(67,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.59_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(68,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.04_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(69,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.15_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(70,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.01.20_PM_(1).jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(71,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.47_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27'),(72,'/static/uploads/Gallery/OTHER_PHOTOS/WhatsApp_Image_2026-06-23_at_10.00.57_PM.jpeg','','CLUB_MEMORIES',NULL,NULL,'2026-07-19 14:38:27');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pending_otps`
--

LOCK TABLES `pending_otps` WRITE;
/*!40000 ALTER TABLE `pending_otps` DISABLE KEYS */;
INSERT INTO `pending_otps` (`email`, `otp`, `created_at`) VALUES ('cooker@iitk.ac.in','974492','2026-06-23 13:23:03'),('gir@iitk.ac.in','290005','2026-06-23 14:55:03'),('pik@iitk.ac.in','965993','2026-06-23 12:30:53'),('your_iitk_email@iitk.ac.in','208207','2026-06-24 12:20:51');
/*!40000 ALTER TABLE `pending_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `site_config`
--

LOCK TABLES `site_config` WRITE;
/*!40000 ALTER TABLE `site_config` DISABLE KEYS */;
INSERT INTO `site_config` (`config_key`, `config_value`) VALUES ('featured_desc','description  of tournament'),('featured_title','tournament title');
/*!40000 ALTER TABLE `site_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `chess_username`, `password_hash`, `created_at`, `is_admin`, `name`, `roll_no`, `contact`, `avatar`, `secondary_email`) VALUES (1,'123@iitk.ac.in','charmander','$2b$12$0FRq49LNW5q317k2Jsp2luPftI3WBTAN8bDTPdAGNcHOrbSVDBuJm','2026-06-22 15:28:10',0,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(2,'hello@iitk.ac.in','bulbasaur','$2b$12$7Cue/EMEtv0O1QZVeSYJ8uWyzGsnrYOy5J3QgDbx/sMBDbTNl86a6','2026-06-22 15:32:59',0,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(3,'hi@iitk.ac.in','ivysaur','$2b$12$bhgVdiQKzIemw6.40EzimOSBwdyNnHL1NONeqSInxjMExBF2uqgnu','2026-06-22 19:38:45',0,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(4,'dam@iitk.ac.in','bulbasaur','$2b$12$RvHlw.cK871/m6LKDYluF.UZKKhNpkQTLDEcu3Iuvoczt5To5RKgS','2026-06-22 20:03:12',0,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(5,'pikachu@iitk.ac.in','pikachu','$2b$12$oRp6RTf2Qah17DV.7hAjcuT10mRbExa2Cb1o.cHB/gIzcsMe45VOW','2026-06-23 11:45:22',1,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(9,'pratikd25@iitk.ac.in','PratikDhanukaplayer','$2b$12$vWH2v4BkLYV51T06Y0Efn.bWC4unBoIF/PajUMxIP6MKwdawrAYxm','2026-06-24 13:16:10',0,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(11,'rishig24@iitk.ac.in','iamrishigupta007','$2b$12$T87nEM/bTXclnB0VtWcOyuUvYeguqrjqFaM26iLj3gcJbUxjT6jyq','2026-06-25 10:58:48',0,'Rishi Gupta','240869','7838658260','/assets/new_user_avatar-DkMhtvhb.png',''),(15,'gssiddhant25@iitk.ac.in','SiddAntMan','$2b$12$Zb.62wXr6/jCI.B9piAAwObhLNbjt0lQfoLqyXbg2KVJySVvzBSKm','2026-07-05 16:52:19',1,'Grandmaster Apprentice','XXXXXX','0000000000',NULL,''),(16,'laksh24@iitk.ac.in','Laksh_Dhir225','$2b$12$CaSCJGSMbLvZVJ6C.Udc1eTk082f/f/1vIDkjZLFxhxMFsUSWDySy','2026-07-07 18:54:06',0,'Grandmaster Apprentice','XXXXXX','0000000000','/assets/new_user_avatar-DkMhtvhb.png',''),(18,'chessiitk21@gmail.com','ChessClubIITK','$2a$12$QT1wLZ6yipp3zzJdSQgcp.WnNAUCTkX6LLLDI5E7DTSjWTo2uETde','2026-07-08 11:05:29',1,'ChessClubIITK','000000','0000000000',NULL,''),(21,'divyeshb25@iitk.ac.in','DivyeshBhattacharyya06','$2b$12$x.TVLZDdpanLQALld2zn3eluC4USZSpQoU0k5yHotCF7457KxCo1i','2026-07-10 14:15:38',1,'Divyesh Bhattacharyya','250367','8928984637',NULL,'6divyesh@gmail.com'),(22,'adityasdum25@iitk.ac.in','ChessWizard_0','$2b$12$ZVwryRs2xB6VM0ZUjwkFqOI5hS2fdKxU0FcBczf0T.jmnh1AwBYAq','2026-07-19 20:58:21',0,'Aditya Dum','250071','1111111111',NULL,'adityadum2006@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-30 21:41:41
