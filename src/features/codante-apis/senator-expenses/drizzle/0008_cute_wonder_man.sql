CREATE TABLE `summaries` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(256),
	`year` varchar(256),
	`summary` json,
	CONSTRAINT `summaries_id` PRIMARY KEY(`id`)
);
