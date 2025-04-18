ALTER TABLE `product_categories` RENAME COLUMN "create_at" TO "created_at";--> statement-breakpoint
CREATE TABLE `signal_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `signals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`code` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`url` text NOT NULL,
	`public_id` text NOT NULL,
	`category_id` integer NOT NULL,
	`description` text,
	`format` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `signal_category`(`id`) ON UPDATE no action ON DELETE no action
);
