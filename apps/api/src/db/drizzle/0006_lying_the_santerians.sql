ALTER TABLE `follows` RENAME COLUMN `userTo` TO `user_to`;--> statement-breakpoint
ALTER TABLE `follows` DROP INDEX `follow_unique`;--> statement-breakpoint
ALTER TABLE `follows` DROP FOREIGN KEY `follow_to_FK`;
--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follow_unique` UNIQUE(`user_from`,`user_to`);--> statement-breakpoint
ALTER TABLE `follows` ADD CONSTRAINT `follow_to_FK` FOREIGN KEY (`user_to`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;