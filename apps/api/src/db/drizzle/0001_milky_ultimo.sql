ALTER TABLE `images` ADD `create_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD `update_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `create_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `update_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `support_messages` ADD `create_at` timestamp DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `support_messages` ADD `update_at` timestamp DEFAULT (now()) NOT NULL;