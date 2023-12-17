CREATE DATABASE IF NOT EXISTS `eezze`;

CREATE USER IF NOT EXISTS 'eezze'@'localhost' IDENTIFIED BY 'Eu]>b632FcAef(~<3';
CREATE USER IF NOT EXISTS 'eezze'@'%' IDENTIFIED BY 'Eu]>b632FcAef(~<3';

GRANT ALL ON *.* TO 'eezze'@'localhost';
GRANT ALL ON *.* TO 'eezze'@'%';

SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';
SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION';

FLUSH PRIVILEGES;

USE `eezze`;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(128),
    `username` VARCHAR(64),
    `firstName` VARCHAR(128),
    `lastName` VARCHAR(128),
    `handle` VARCHAR(128) DEFAULT NULL,
    `attribute` VARCHAR(255),
    `salt` VARCHAR(255),
    `verifier` VARCHAR(255),
    `avatar` VARCHAR(255),
    `emailVerified` BOOLEAN,
    `roles` JSON,
    `password` VARCHAR(64),
    `passwordHash` VARCHAR(255),
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `userId` (`id`)
);

CREATE TABLE IF NOT EXISTS `project` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectName` VARCHAR(128),
    `userId` INT,
    `details` VARCHAR(255),
    `industry` VARCHAR(64),
    `logo` VARCHAR(255) DEFAULT NULL,
    `handle` VARCHAR(128) DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `projectName` (`projectName`)
);

CREATE TABLE IF NOT EXISTS `team` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `boardId` INT NULL DEFAULT NULL,
    `name` VARCHAR(128),
    `description` VARCHAR(255),
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `teamName` (`projectId`, `name`)
);

CREATE TABLE IF NOT EXISTS `member` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `teamId` INT,
    `userId` INT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `accepted` BOOLEAN DEFAULT FALSE,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `member` (`teamId`, `userId`)
);

CREATE TABLE IF NOT EXISTS `notification` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `userId` INT,
    `type` VARCHAR(64),
    `status` VARCHAR(64),
    `title` VARCHAR(128),
    `message` VARCHAR(255),
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `title` (`projectId`, `title`),
    KEY `userId` (`projectId`, `userId`)
);

CREATE TABLE IF NOT EXISTS `datasource` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(128),
    `projectId` INT,
    `name` VARCHAR(128),
    `description` VARCHAR(255),
    `type` VARCHAR(70),
    `metadata` TEXT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    `initModel` JSON,
    KEY `name` (`projectId`, `key`, `name`, `type`)
);

CREATE TABLE IF NOT EXISTS `response_code` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `code` VARCHAR(64),
    `name` VARCHAR(128),
    `description` VARCHAR(255),
    `wikiDefinition` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `name` (`projectId`, `name`)
);

CREATE TABLE IF NOT EXISTS `role` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `role` VARCHAR(128),
    `description` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `role` (`projectId`, `role`)
);

CREATE TABLE IF NOT EXISTS `connection` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `name` VARCHAR(128),
    `description` TEXT,
    `type` VARCHAR(128),
    `metadata` JSON,
    `state` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `connection` (`projectId`, `id`)
);

CREATE TABLE IF NOT EXISTS `service_config` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `type` VARCHAR(128),
    `name` VARCHAR(128),
    `description` TEXT,
    `metadata` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `serviceConfig` (`projectId`, `name`)
);

CREATE TABLE IF NOT EXISTS `store_menu_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service` (`name`, `description`)
);

REPLACE INTO `store_menu_categories` (`id`, `name`, `description`) VALUES
            (1, 'social-media', 'social-media-description'),
            (2, 'authentication-and-authorization-services', 'authentication-and-authorization-services-description'),
            (3, 'video-streaming', 'video-streaming-description'),
            (4, 'messaging-and-notification-services', 'messaging-and-notification-services-description'),
            (5, 'email-services', 'email-services-description'),
            (6, 'e-commerce', 'e-commerce-description'),
            (7, 'databases', 'databases-description'),
            (8, 'payment-services', 'payment-services-description'),
            (9, 'real-time', 'real-time-description'),
            (10, 'cron-task-services', 'cron-task-services-description'),
            (11, 'kubernetes-services', 'kubernetes-services-description'),
            (12, 'cloud-services', 'cloud-services-description');

CREATE TABLE IF NOT EXISTS `store_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `service` (`name`, `description`)
);

REPLACE INTO `store_categories` (`id`, `name`, `description`) VALUES
            (1, 'social-media', 'social-media-description'),
            (2, 'authentication-and-authorization-services', 'authentication-and-authorization-services-description'),
            (3, 'video-streaming', 'video-streaming-description'),
            (4, 'messaging-and-notification-services', 'messaging-and-notification-services-description'),
            (5, 'email-services', 'email-services-description'),
            (6, 'e-commerce', 'e-commerce-description'),
            (7, 'databases', 'databases-description'),
            (8, 'payment-services', 'payment-services-description'),
            (9, 'real-time', 'real-time-description'),
            (10, 'cron-task-services', 'cron-task-services-description'),
            (11, 'kubernetes-services', 'kubernetes-services-description'),
            (12, 'cloud-services', 'cloud-services-description');

CREATE TABLE IF NOT EXISTS `feedback` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `from` INT DEFAULT NULL,
    `subject` VARCHAR(255),
    `message` VARCHAR(255),
    KEY `store` (`from`)
);

-- STORE START --

CREATE TABLE IF NOT EXISTS `store` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `srcProjectId` INT,
    `name` VARCHAR(128),
    `type` VARCHAR(128),
    `shortFunction` TEXT DEFAULT NULL,
    `sgFunction` TEXT DEFAULT NULL,
    `scope` VARCHAR(128),
    `description` TEXT,
    `tags` TEXT,
    `metadata` JSON,
    `stories` TEXT DEFAULT NULL,
    `publishApproved` BOOLEAN DEFAULT FALSE,
    `categoryOne` VARCHAR(128),
    `categoryTwo` VARCHAR(128),
    `categoryThree` VARCHAR(128),
    `categoryFour` VARCHAR(128),
    `categoryFive` VARCHAR(128),
    `categorySix` VARCHAR(128),
    `version` DECIMAL NOT NULL DEFAULT '1.0',
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `publishedAt`TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `publishedBy`INT,
    `active` BOOLEAN DEFAULT TRUE,
    FULLTEXT idx_description (`description`),
    FULLTEXT idx_tags (`tags`),
    FULLTEXT idx_stories (`stories`),
    KEY `store` (`srcProjectId`, `name`)
);

-- ALTER TABLE store ADD FULLTEXT INDEX idx_description (`description`);
-- ALTER TABLE store ADD FULLTEXT INDEX idx_tags (`tags`);
-- ALTER TABLE store ADD FULLTEXT INDEX idx_stories (`stories`);

CREATE TABLE IF NOT EXISTS `store_review` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` int DEFAULT NULL,
    `comment` TEXT,
    `rating` DECIMAL,
    `reviewedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewer` INT,
    KEY `store` (`rating`, `storeId`)
);

CREATE TABLE IF NOT EXISTS `store_service_group` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `srcId` INT,
    `storeId` INT,
    `name` VARCHAR(128),
    `type` VARCHAR(128),
    `description` TEXT,
    `metadata` JSON,
    `stories` TEXT DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    FULLTEXT idx_stories (`stories`),
    KEY `serviceGroup` (`storeId`, `name`, `srcId`)
);

-- ALTER TABLE `store_service_group` ADD FULLTEXT INDEX idx_stories (`stories`);

CREATE TABLE IF NOT EXISTS `store_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sgId` int DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `description` TEXT,
  `story` JSON,
  `fullStory` TEXT,
  `definition` JSON DEFAULT NULL,
  `actionInput` JSON DEFAULT NULL,
  `logic` JSON DEFAULT NULL,
  `output` JSON DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int DEFAULT NULL,
  `active` BOOLEAN DEFAULT TRUE,
  FULLTEXT idx_full_story (`fullStory`),
  PRIMARY KEY (`id`),
  KEY `service` (`sgId`,`name`)
);

-- ALTER TABLE `store_service` ADD FULLTEXT INDEX idx_full_story (`fullStory`);

CREATE TABLE IF NOT EXISTS `store_service_datasource` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `name` VARCHAR(128),
    `description` VARCHAR(255),
    `type` VARCHAR(70),
    `metadata` TEXT NOT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    `initModel` JSON,
    KEY `name` (`storeId`, `name`, `type`)
);

CREATE TABLE IF NOT EXISTS `store_service_config` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `type` VARCHAR(128),
    `name` VARCHAR(128),
    `description` TEXT,
    `metadata` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `serviceConfig` (`storeId`, `name`)
);

CREATE TABLE IF NOT EXISTS `store_service_role` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `role` VARCHAR(125),
    `description` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `role` (`storeId`, `role`)
);

CREATE TABLE IF NOT EXISTS `store_service_credentials_vault` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `name` VARCHAR(128),
    `description` TEXT,
    `accessibleTo` JSON,
    `updatableTo` JSON,
    `keyValues` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `name` (`storeId`, `name`)
);

CREATE TABLE IF NOT EXISTS `store_service_connection` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `name` VARCHAR(128),
    `description` TEXT,
    `type` VARCHAR(128),
    `metadata` JSON,
    `state` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `connection` (`storeId`, `id`)
);

CREATE TABLE IF NOT EXISTS `store_service_value_store` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `storeId` INT,
    `key` VARCHAR(128),
    `type` VARCHAR(128),
    `value` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `valueStore` (`storeId`, `key`)
);

-- STORE END --

CREATE TABLE IF NOT EXISTS `service_group` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `name` VARCHAR(128),
    `type` VARCHAR(128),
    `description` TEXT,
    `metadata` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `serviceGroup` (`projectId`, `name`)
);

CREATE TABLE IF NOT EXISTS `entity` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `datasourceId` INT,
    `entityItems` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN     DEFAULT TRUE,
    KEY `entity` (`projectId`, `id`)
);

CREATE TABLE IF NOT EXISTS `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `projectId` int DEFAULT NULL,
  `serviceGroupId` int DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `version` varchar(5) DEFAULT '1.0',
  `description` text,
  `definition` json DEFAULT NULL,
  `actionInput` json DEFAULT NULL,
  `logic` json DEFAULT NULL,
  `output` json DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int DEFAULT NULL,
  `active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  KEY `service` (`projectId`,`name`)
);

CREATE TABLE IF NOT EXISTS `credentials_vault` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `name` VARCHAR(128),
    `description` TEXT,
    `accessibleTo` JSON,
    `updatableTo` JSON,
    `keyValues` JSON,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `name` (`projectId`, `name`)
);

CREATE TABLE IF NOT EXISTS `bl_action_response_type` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(75) NOT NULL,
  `title` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` BOOLEAN DEFAULT TRUE,
  KEY `key` (`key`)
);

CREATE TABLE IF NOT EXISTS `bl_action_type` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(75) NOT NULL,
  `title` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) DEFAULT NULL,
  `active` BOOLEAN DEFAULT TRUE,
  KEY `key` (`key`)
);

CREATE TABLE IF NOT EXISTS `linter` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `key` varchar(75) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `description` text,
  `active` BOOLEAN DEFAULT TRUE,
  KEY `key` (`key`)
);

CREATE TABLE IF NOT EXISTS `service_configurable_type` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `key` TEXT,
    `name` VARCHAR(256),
    `description` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    UNIQUE `name` (`name`)
);

CREATE TABLE IF NOT EXISTS `value_store` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `projectId` INT,
    `key` VARCHAR(128),
    `type` VARCHAR(128),
    `value` TEXT,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updatedBy` INT,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `valueStore` (`projectId`, `key`)
);

CREATE TABLE IF NOT EXISTS `board` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `teamId` INT,
    `board` JSON,
    `active` BOOLEAN DEFAULT TRUE,
    KEY `entity` (`teamId`)
);