-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2023 at 07:13 AM
-- Server version: 5.7.12
-- PHP Version: 8.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eezze`
--

-- --------------------------------------------------------

--
-- Table structure for table `bl_action_response_type`
--

CREATE TABLE `bl_action_response_type` (
  `id` int(11) NOT NULL,
  `key` varchar(75) NOT NULL,
  `title` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bl_action_type`
--

CREATE TABLE `bl_action_type` (
  `id` int(11) NOT NULL,
  `key` varchar(75) NOT NULL,
  `title` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `board`
--

CREATE TABLE `board` (
  `id` int(11) NOT NULL,
  `teamId` int(11) DEFAULT NULL,
  `board` json DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `connection`
--

CREATE TABLE `connection` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `type` varchar(128) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `state` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `connection`
--

INSERT INTO `connection` (`id`, `projectId`, `name`, `description`, `type`, `metadata`, `state`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 'Aws Docker', 'docker', 'server', '{\"auth\": {\"props\": {}}, \"secure\": true, \"serviceTypes\": [\"rest\", \"websocket\", \"cron-task\", \"installable-services\"]}', NULL, '2023-10-30 04:05:46', NULL, '2023-10-30 04:05:46', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `credentials_vault`
--

CREATE TABLE `credentials_vault` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `accessibleTo` json DEFAULT NULL,
  `updatableTo` json DEFAULT NULL,
  `keyValues` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `credentials_vault`
--

INSERT INTO `credentials_vault` (`id`, `projectId`, `name`, `description`, `accessibleTo`, `updatableTo`, `keyValues`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 'Database', 'db', '[2, 1]', '[2, 1]', '[{\"key\": \"USER\", \"value\": \"root\", \"isSecret\": false}, {\"key\": \"PWD\", \"value\": \"Password!@#!A\", \"isSecret\": true}]', '2023-10-30 04:05:09', NULL, '2023-10-30 04:05:09', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `datasource`
--

CREATE TABLE `datasource` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(70) DEFAULT NULL,
  `metadata` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `initModel` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `datasource`
--

INSERT INTO `datasource` (`id`, `projectId`, `name`, `description`, `type`, `metadata`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`, `initModel`) VALUES
(1, 1, 'Custom Logger', NULL, 'eezze-logger', '{\"connection\":1,\"secure\":true,\"port\":1900,\"host\":\"custom-logger-aws-docker.eezze.io\"}', '2023-10-30 04:06:09', NULL, '2023-10-30 06:03:49', NULL, 1, '[]'),
(2, 1, 'Database', NULL, 'Mysql', '{\"connection\":1,\"dbName\":\"database\",\"port\":3306,\"secure\":true,\"credentials\":1,\"user\":\"USER\",\"password\":\"PWD\",\"host\":\"database-aws-docker.eezze.io\"}', '2023-10-30 04:09:05', NULL, '2023-10-30 06:02:44', NULL, 1, '[{\"id\": 1, \"name\": \"user\", \"type\": \"dbTable\", \"input\": {}, \"output\": {}, \"modules\": [{\"id\": 2, \"name\": \"id\", \"type\": \"dbColumn\", \"input\": {}, \"length\": \"\", \"output\": {}, \"rounds\": \"\", \"key_key\": false, \"dataType\": \"INT\", \"position\": null, \"unsigned\": false, \"verifier\": \"\", \"zerofill\": false, \"allow_null\": false, \"key_unique\": false, \"key_primary\": true, \"key_spatial\": false, \"key_fulltext\": false, \"model_ignore\": false, \"model_secret\": false, \"model_required\": false}, {\"id\": 3, \"name\": \"name\", \"type\": \"dbColumn\", \"input\": {}, \"length\": \"\", \"output\": {}, \"rounds\": \"\", \"key_key\": false, \"dataType\": \"VARCHAR\", \"position\": null, \"unsigned\": false, \"verifier\": \"\", \"zerofill\": false, \"allow_null\": false, \"key_unique\": false, \"key_primary\": false, \"key_spatial\": false, \"key_fulltext\": false, \"model_ignore\": false, \"model_secret\": false, \"model_required\": false}], \"position\": {\"x\": 210, \"y\": 458.4}}]'),
(3, 1, 'Rest Server', NULL, 'rest-service', '{\"logger\":1,\"connection\":1,\"secure\":true,\"port\":2300,\"protocol\":\"http\",\"secureProtocol\":\"https\",\"host\":\"rest-server-aws-docker.eezze.io\",\"localhost\":\"localhost\"}', '2023-10-30 04:09:54', NULL, '2023-10-30 06:03:07', NULL, 1, '[]'),
(4, 1, 'Files', NULL, 'FileStorage', '{\"connection\":1,\"secure\":true,\"rootPath\":{\"example\":\"\",\"id\":\"GhIGlfUMjD\",\"filterId\":\"7XAbWUOsWI\",\"property\":\"rootPath\",\"name\":\"Propery \\\"rootPath\\\" mapping\",\"desc\":\"This is mapped value & logic for property rootPath\",\"baseType\":\"primitive\",\"type\":\"text\",\"raw\":\"/var/www/eezze\",\"actions\":[]}}', '2023-10-30 04:10:18', NULL, '2023-10-30 04:10:18', NULL, 1, '[]');

-- --------------------------------------------------------

--
-- Table structure for table `entity`
--

CREATE TABLE `entity` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `datasourceId` int(11) DEFAULT NULL,
  `entityItems` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `entity`
--

INSERT INTO `entity` (`id`, `projectId`, `datasourceId`, `entityItems`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 2, '{\"user\": [{\"key\": {\"key\": false, \"unique\": false, \"primary\": true, \"spatial\": false, \"fulltext\": false}, \"model\": {\"ignore\": false, \"required\": false}, \"length\": \"\", \"dataType\": \"INT\", \"unsigned\": \"\", \"allow_null\": false, \"columnName\": \"id\", \"entityName\": \"user\"}, {\"key\": {\"key\": false, \"unique\": false, \"primary\": false, \"spatial\": false, \"fulltext\": false}, \"model\": {\"ignore\": false, \"required\": false}, \"length\": \"\", \"dataType\": \"VARCHAR\", \"unsigned\": \"\", \"allow_null\": false, \"columnName\": \"name\", \"entityName\": \"user\"}]}', '2023-10-30 04:13:49', NULL, '2023-10-30 04:13:49', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `from` int(11) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `linter`
--

CREATE TABLE `linter` (
  `id` int(11) NOT NULL,
  `key` varchar(75) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `description` text,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL,
  `teamId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `accepted` tinyint(1) DEFAULT '0',
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `status` varchar(64) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `projectName` varchar(128) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `industry` varchar(64) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `handle` varchar(128) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `projectName`, `userId`, `details`, `industry`, `logo`, `handle`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 'Test Project', 1, 'Some project to test', 'IT', NULL, 'testproject', '2023-10-18 09:27:59', NULL, '2023-10-18 09:27:59', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `response_code`
--

CREATE TABLE `response_code` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `code` varchar(64) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `wikiDefinition` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `role` varchar(128) DEFAULT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `projectId`, `role`, `description`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 'ROLE_USER', NULL, '2023-10-30 04:04:22', NULL, '2023-10-30 04:04:22', NULL, 1),
(2, 1, 'ROLE_ADMIN', NULL, '2023-10-30 04:04:28', NULL, '2023-10-30 04:04:28', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `serviceGroupId` int(11) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `version` varchar(5) DEFAULT '1.0',
  `description` text,
  `definition` json DEFAULT NULL,
  `actionInput` json DEFAULT NULL,
  `logic` json DEFAULT NULL,
  `output` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `projectId`, `serviceGroupId`, `type`, `name`, `version`, `description`, `definition`, `actionInput`, `logic`, `output`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 1, 'rest', 'Files', '1.0', 'files', '{\"path\": \"files\", \"roles\": [], \"method\": \"post\", \"datasource\": \"\", \"datasourceName\": \"\"}', '[{\"id\": \"6aKrJSaIr2\", \"raw\": \"adm.request.urlParams.data\", \"desc\": \"\", \"name\": \"\", \"type\": \"text\", \"actions\": [], \"example\": \"\", \"baseType\": \"context-mapping\", \"filterId\": \"0Twc60C5OC\", \"property\": \"data\"}]', '[{\"id\": \"78\", \"name\": \"Action #1\", \"type\": \"text\", \"isNew\": true, \"output\": [], \"schema\": {\"folder\": {\"id\": \"xlvgMkifuJ\", \"raw\": \"test\", \"desc\": \"This is mapped value & logic for property folder\", \"name\": \"Propery \\\"folder\\\" mapping\", \"type\": \"text\", \"actions\": [], \"example\": \"\", \"baseType\": \"primitive\", \"filterId\": \"nGwwEKLFbX\", \"property\": \"folder\"}, \"_action\": {\"action\": \"save\", \"category\": \"files\"}, \"content\": {\"id\": \"6HdqLvnS11\", \"raw\": \"adm.input.data\", \"desc\": \"This is mapped value & logic for property content\", \"name\": \"Propery \\\"content\\\" mapping\", \"type\": \"text\", \"actions\": [], \"example\": \"\", \"baseType\": \"context-mapping\", \"filterId\": \"XhZf8mi1Gl\", \"property\": \"content\"}, \"fileName\": {\"id\": \"JF5PMTKAxw\", \"raw\": \"test.txt\", \"desc\": \"This is mapped value & logic for property fileName\", \"name\": \"Propery \\\"fileName\\\" mapping\", \"type\": \"text\", \"actions\": [], \"example\": \"\", \"baseType\": \"primitive\", \"filterId\": \"gKK66Fp4tB\", \"property\": \"fileName\"}, \"fileType\": \"plain-text\", \"datasource\": \"Files\", \"previousFileName\": {}}, \"errorCode\": 400, \"description\": \"Action #1 Description\", \"successCode\": 200, \"errorMessage\": \"Error message\", \"successMessage\": \"Success message\"}]', '[]', '2023-10-30 04:16:01', NULL, '2023-10-30 04:16:01', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `service_config`
--

CREATE TABLE `service_config` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `service_configurable_type`
--

CREATE TABLE `service_configurable_type` (
  `id` int(11) NOT NULL,
  `key` text,
  `name` varchar(256) DEFAULT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `service_group`
--

CREATE TABLE `service_group` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `service_group`
--

INSERT INTO `service_group` (`id`, `projectId`, `name`, `type`, `description`, `metadata`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 'Rest Servicegroup', 'custom', 'rest', '{\"restDs\": 3, \"restDsName\": \"rest-server\"}', '2023-10-30 04:14:23', NULL, '2023-10-30 04:14:23', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `id` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `shortFunction` text,
  `sgFunction` text,
  `scope` varchar(128) DEFAULT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  `publishApproved` tinyint(1) DEFAULT '0',
  `categoryOne` varchar(128) DEFAULT NULL,
  `categoryTwo` varchar(128) DEFAULT NULL,
  `categoryThree` varchar(128) DEFAULT NULL,
  `categoryFour` varchar(128) DEFAULT NULL,
  `categoryFive` varchar(128) DEFAULT NULL,
  `categorySix` varchar(128) DEFAULT NULL,
  `version` decimal(10,0) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `publishedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `publishedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_categories`
--

CREATE TABLE `store_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `store_categories`
--

INSERT INTO `store_categories` (`id`, `name`, `description`) VALUES
(2, 'authentication-and-authorization-services', 'authentication-and-authorization-services-description'),
(12, 'cloud-services', 'cloud-services-description'),
(10, 'cron-task-services', 'cron-task-services-description'),
(7, 'databases', 'databases-description'),
(6, 'e-commerce', 'e-commerce-description'),
(5, 'email-services', 'email-services-description'),
(11, 'kubernetes-services', 'kubernetes-services-description'),
(4, 'messaging-and-notification-services', 'messaging-and-notification-services-description'),
(8, 'payment-services', 'payment-services-description'),
(9, 'real-time', 'real-time-description'),
(1, 'social-media', 'social-media-description'),
(3, 'video-streaming', 'video-streaming-description');

-- --------------------------------------------------------

--
-- Table structure for table `store_menu_categories`
--

CREATE TABLE `store_menu_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `store_menu_categories`
--

INSERT INTO `store_menu_categories` (`id`, `name`, `description`) VALUES
(2, 'authentication-and-authorization-services', 'authentication-and-authorization-services-description'),
(12, 'cloud-services', 'cloud-services-description'),
(10, 'cron-task-services', 'cron-task-services-description'),
(7, 'databases', 'databases-description'),
(6, 'e-commerce', 'e-commerce-description'),
(5, 'email-services', 'email-services-description'),
(11, 'kubernetes-services', 'kubernetes-services-description'),
(4, 'messaging-and-notification-services', 'messaging-and-notification-services-description'),
(8, 'payment-services', 'payment-services-description'),
(9, 'real-time', 'real-time-description'),
(1, 'social-media', 'social-media-description'),
(3, 'video-streaming', 'video-streaming-description');

-- --------------------------------------------------------

--
-- Table structure for table `store_review`
--

CREATE TABLE `store_review` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `comment` text,
  `rating` decimal(10,0) DEFAULT NULL,
  `reviewedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reviewer` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service`
--

CREATE TABLE `store_service` (
  `id` int(11) NOT NULL,
  `sgId` int(11) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `definition` json DEFAULT NULL,
  `actionInput` json DEFAULT NULL,
  `logic` json DEFAULT NULL,
  `output` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_config`
--

CREATE TABLE `store_service_config` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_connection`
--

CREATE TABLE `store_service_connection` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `type` varchar(128) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `state` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_credentials_vault`
--

CREATE TABLE `store_service_credentials_vault` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` text,
  `accessibleTo` json DEFAULT NULL,
  `updatableTo` json DEFAULT NULL,
  `keyValues` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_datasource`
--

CREATE TABLE `store_service_datasource` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(70) DEFAULT NULL,
  `metadata` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `initModel` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_group`
--

CREATE TABLE `store_service_group` (
  `id` int(11) NOT NULL,
  `srcId` int(11) DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `description` text,
  `metadata` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_group_value_store`
--

CREATE TABLE `store_service_group_value_store` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `key` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `value` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `store_service_role`
--

CREATE TABLE `store_service_role` (
  `id` int(11) NOT NULL,
  `storeId` int(11) DEFAULT NULL,
  `role` varchar(125) DEFAULT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `boardId` int(11) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `username` varchar(64) DEFAULT NULL,
  `firstName` varchar(128) DEFAULT NULL,
  `lastName` varchar(128) DEFAULT NULL,
  `handle` varchar(128) DEFAULT NULL,
  `attribute` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `verifier` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `roles` json DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `passwordHash` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `firstName`, `lastName`, `handle`, `attribute`, `salt`, `verifier`, `avatar`, `emailVerified`, `roles`, `password`, `passwordHash`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 'r.streefkerk@gmail.com', NULL, 'Rolf', 'Streefkerk', NULL, NULL, '$2b$10$GwM/HoufI4wOb4jQlD2seO', '$2b$10$GwM/HoufI4wOb4jQlD2seOzrW1dZNjuc77pW/y3bnNBuwlasZArFe', NULL, 1, '[\"ROLE_USER\"]', NULL, NULL, '2023-10-18 09:24:04', NULL, '2023-10-18 09:26:32', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `value_store`
--

CREATE TABLE `value_store` (
  `id` int(11) NOT NULL,
  `projectId` int(11) DEFAULT NULL,
  `key` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `value` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `value_store`
--

INSERT INTO `value_store` (`id`, `projectId`, `key`, `type`, `value`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `active`) VALUES
(1, 1, 'TEST_VALUE', 'text', 'test', '2023-10-30 04:05:18', NULL, '2023-10-30 04:05:18', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bl_action_response_type`
--
ALTER TABLE `bl_action_response_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `key` (`key`);

--
-- Indexes for table `bl_action_type`
--
ALTER TABLE `bl_action_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `key` (`key`);

--
-- Indexes for table `board`
--
ALTER TABLE `board`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity` (`teamId`);

--
-- Indexes for table `connection`
--
ALTER TABLE `connection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `connection` (`projectId`,`id`);

--
-- Indexes for table `credentials_vault`
--
ALTER TABLE `credentials_vault`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `datasource`
--
ALTER TABLE `datasource`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`,`type`);

--
-- Indexes for table `entity`
--
ALTER TABLE `entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entity` (`projectId`,`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store` (`from`);

--
-- Indexes for table `linter`
--
ALTER TABLE `linter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `key` (`key`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member` (`teamId`,`userId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `title` (`projectId`,`title`),
  ADD KEY `userId` (`projectId`,`userId`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectName` (`projectName`);

--
-- Indexes for table `response_code`
--
ALTER TABLE `response_code`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`projectId`,`name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`projectId`,`role`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`projectId`,`name`);

--
-- Indexes for table `service_config`
--
ALTER TABLE `service_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `serviceConfig` (`projectId`,`name`);

--
-- Indexes for table `service_configurable_type`
--
ALTER TABLE `service_configurable_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `service_group`
--
ALTER TABLE `service_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `serviceGroup` (`projectId`,`name`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store` (`name`);

--
-- Indexes for table `store_categories`
--
ALTER TABLE `store_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`name`,`description`);

--
-- Indexes for table `store_menu_categories`
--
ALTER TABLE `store_menu_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`name`,`description`);

--
-- Indexes for table `store_review`
--
ALTER TABLE `store_review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store` (`rating`,`storeId`);

--
-- Indexes for table `store_service`
--
ALTER TABLE `store_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`sgId`,`name`);

--
-- Indexes for table `store_service_config`
--
ALTER TABLE `store_service_config`
  ADD PRIMARY KEY (`id`),
  ADD KEY `serviceConfig` (`storeId`,`name`);

--
-- Indexes for table `store_service_connection`
--
ALTER TABLE `store_service_connection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `connection` (`storeId`,`id`);

--
-- Indexes for table `store_service_credentials_vault`
--
ALTER TABLE `store_service_credentials_vault`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`storeId`,`name`);

--
-- Indexes for table `store_service_datasource`
--
ALTER TABLE `store_service_datasource`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`storeId`,`name`,`type`);

--
-- Indexes for table `store_service_group`
--
ALTER TABLE `store_service_group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `serviceGroup` (`storeId`,`name`,`srcId`);

--
-- Indexes for table `store_service_group_value_store`
--
ALTER TABLE `store_service_group_value_store`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valueStore` (`storeId`,`key`);

--
-- Indexes for table `store_service_role`
--
ALTER TABLE `store_service_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`storeId`,`role`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teamName` (`name`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`id`);

--
-- Indexes for table `value_store`
--
ALTER TABLE `value_store`
  ADD PRIMARY KEY (`id`),
  ADD KEY `valueStore` (`projectId`,`key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bl_action_response_type`
--
ALTER TABLE `bl_action_response_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bl_action_type`
--
ALTER TABLE `bl_action_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `board`
--
ALTER TABLE `board`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `connection`
--
ALTER TABLE `connection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `credentials_vault`
--
ALTER TABLE `credentials_vault`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `datasource`
--
ALTER TABLE `datasource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `entity`
--
ALTER TABLE `entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `linter`
--
ALTER TABLE `linter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `response_code`
--
ALTER TABLE `response_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `service_config`
--
ALTER TABLE `service_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_configurable_type`
--
ALTER TABLE `service_configurable_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_group`
--
ALTER TABLE `service_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_categories`
--
ALTER TABLE `store_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `store_menu_categories`
--
ALTER TABLE `store_menu_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `store_review`
--
ALTER TABLE `store_review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service`
--
ALTER TABLE `store_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_config`
--
ALTER TABLE `store_service_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_connection`
--
ALTER TABLE `store_service_connection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_credentials_vault`
--
ALTER TABLE `store_service_credentials_vault`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_datasource`
--
ALTER TABLE `store_service_datasource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_group`
--
ALTER TABLE `store_service_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_group_value_store`
--
ALTER TABLE `store_service_group_value_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `store_service_role`
--
ALTER TABLE `store_service_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `value_store`
--
ALTER TABLE `value_store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
