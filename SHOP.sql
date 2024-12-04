-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: shop
-- ------------------------------------------------------
-- Server version	8.3.0

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

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog` (
  `UID` char(10) NOT NULL,
  `GID` char(20) NOT NULL,
  `OP` int NOT NULL,
  `OPTIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `CID` char(13) NOT NULL,
  `CGID` char(20) NOT NULL,
  `CGNUM` int DEFAULT '0',
  `CUSERID` char(10) NOT NULL,
  `CTIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `CGPRICE` decimal(7,2) DEFAULT '0.00',
  PRIMARY KEY (`CID`),
  KEY `CGID` (`CGID`),
  KEY `CUSERID` (`CUSERID`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`CGID`) REFERENCES `goods` (`GID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`CUSERID`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clog`
--

DROP TABLE IF EXISTS `clog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clog` (
  `CID` char(13) NOT NULL,
  `CGID` char(20) NOT NULL,
  `CGNUM` int DEFAULT '0',
  `CUSERID` char(10) NOT NULL,
  `CARTTIME` timestamp NULL DEFAULT NULL,
  `PAYTIME` timestamp NULL DEFAULT NULL,
  `RECETIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `CGPRICE` decimal(7,2) DEFAULT '0.00',
  PRIMARY KEY (`CID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clog`
--

LOCK TABLES `clog` WRITE;
/*!40000 ALTER TABLE `clog` DISABLE KEYS */;
/*!40000 ALTER TABLE `clog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `counts`
--

DROP TABLE IF EXISTS `counts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `counts` (
  `TNO` int NOT NULL,
  `TNAME` varchar(20) NOT NULL,
  `TSIZE` bigint DEFAULT '0',
  PRIMARY KEY (`TNO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `counts`
--

LOCK TABLES `counts` WRITE;
/*!40000 ALTER TABLE `counts` DISABLE KEYS */;
INSERT INTO `counts` VALUES (1,'Business',2),(2,'Customer',5);
/*!40000 ALTER TABLE `counts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `GID` char(20) NOT NULL,
  `GNAME` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `GPRICE` decimal(7,2) DEFAULT '0.00',
  `GNUM` int DEFAULT '0',
  `GPROVIDER` char(10) NOT NULL,
  `GIMAGE` varchar(100) DEFAULT NULL,
  `GSTATUS` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`GID`),
  KEY `GPROVIDER` (`GPROVIDER`),
  CONSTRAINT `goods_ibfk_1` FOREIGN KEY (`GPROVIDER`) REFERENCES `users` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES ('000000000001','人工智能导论（第4版），王万良',31.00,200,'B000000002','./Image/000000000001.png',1),('000000000002','软件工程概论（第3版），郑人杰等，机械工业出版社',59.00,150,'B000000001','./Image/000000000002.png',1),('000000000003','人工智能：现代方法（第4版）（精装版）[ 美 ] 斯图尔特·罗素（ Stuart Russell） 彼得·诺维格（ Peter Norvig） 著 ，张博雅 陈坤 田超 顾卓尔 吴凡 赵申剑 译，人民邮电出版社',358.00,165,'B000000002',NULL,1),('000000000004','计算机网络（第6版）自顶向下方法 ([美] James F.Kurose [美] Keith W.Ross) ,机械工业出版社',79.00,300,'B000000001','./Image/000000000004.png',1),('000000000005','计算机网络（原书第7版） 自顶向下方法 (James F. Kurose Keith W. Ross) ，机械工业出版社',89.00,330,'B000000001','./Image/000000000005.png',1),('000000000006','算法（第四版）英文版 图灵程序设计丛书 Algorithms (样章) (美 Robert Sedgewick 美 Kevin Wayne译 谢路云) ，人民邮电出版社',99.00,165,'B000000001',NULL,1),('000000000007','计算机科学概论（英文版第5版），Nell Dale等著，机械工业出版社',69.00,130,'B000000001',NULL,1),('000000000008','草稿纸（200pcs）',5.00,1000,'B000000001',NULL,0),('000000000009','概率导论 (Dimitri Bertsekas)',65.00,10,'B000000002','./Image/000000000009.png',1),('000000000010','上海地铁线路图（高清，420*594）',2.00,20,'B000000002','./Image/000000000010.jpg',0);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `CID` char(13) NOT NULL,
  `CGID` char(20) NOT NULL,
  `CGNUM` int DEFAULT '0',
  `CUSERID` char(10) NOT NULL,
  `CARTTIME` timestamp NULL DEFAULT NULL,
  `PAYTIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `DELITIME` timestamp NULL DEFAULT NULL,
  `RECETIME` timestamp NULL DEFAULT NULL,
  `STATUS` char(10) NOT NULL,
  `CGPRICE` decimal(7,2) DEFAULT '0.00',
  PRIMARY KEY (`CID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `USERNAME` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PASSWORD` varchar(32) NOT NULL,
  `USERTYPE` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('B000000001','DORI','Dl112211',1),('B000000002','FURINA','FFda1013',1),('C000000001','KLEE','Klee0727',2),('C000000002','NAHIDA','Na666666',2),('C000000003','CHIORI','CHouse17',2),('C000000004','HUTAO','Hutao@715',2),('C000000005','PAIMON','Paimon601',2);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ADDEVENT` AFTER INSERT ON `users` FOR EACH ROW UPDATE counts
SET COUNTS.TSIZE=COUNTS.TSIZE+1
WHERE COUNTS.TNO=NEW.USERTYPE */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04 16:14:05
