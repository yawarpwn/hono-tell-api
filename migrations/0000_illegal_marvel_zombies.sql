CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`create_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ruc` text NOT NULL,
	`phone` text,
	`address` text,
	`email` text,
	`is_regular` integer DEFAULT false NOT NULL,
	`create_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_name_unique` ON `customers` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_ruc_unique` ON `customers` (`ruc`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`code` text NOT NULL,
	`unit_size` text NOT NULL,
	`link` text,
	`rank` real DEFAULT 0 NOT NULL,
	`price` real NOT NULL,
	`cost` real NOT NULL,
	`create_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_code_unique` ON `products` (`code`);--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`deadline` integer NOT NULL,
	`credit` integer,
	`include_igv` integer DEFAULT false NOT NULL,
	`customer_id` text,
	`is_payment_pending` integer DEFAULT false NOT NULL,
	`items` text DEFAULT '{"data":false}' NOT NULL,
	`create_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_number_unique` ON `quotations` (`number`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);