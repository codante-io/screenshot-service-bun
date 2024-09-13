CREATE TABLE `expenses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`senator_id` bigint,
	`original_id` varchar(256),
	`date` varchar(256),
	`expense_category` varchar(256),
	`amount` varchar(256),
	`description` varchar(256),
	`supplier` varchar(256),
	`supplier_document` varchar(256),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
