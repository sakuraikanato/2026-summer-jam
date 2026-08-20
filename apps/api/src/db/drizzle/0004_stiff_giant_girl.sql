CREATE TABLE `point_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`from` int NOT NULL,
	`to` int NOT NULL,
	`create_at` timestamp NOT NULL DEFAULT (now()),
	`update_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `point_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_from` int NOT NULL,
	`userTo` int NOT NULL,
	CONSTRAINT `follows_id` PRIMARY KEY(`id`),
	CONSTRAINT `follow_unique` UNIQUE(`user_from`,`userTo`)
);
--> statement-breakpoint
ALTER TABLE `point_logs` ADD CONSTRAINT `point_logs_from_users_id_fk` FOREIGN KEY (`from`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `point_logs` ADD CONSTRAINT `point_logs_to_users_id_fk` FOREIGN KEY (`to`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follow_from_fk` FOREIGN KEY (`user_from`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follow_to_FK` FOREIGN KEY (`userTo`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;