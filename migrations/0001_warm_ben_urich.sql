ALTER TABLE `categories` RENAME TO `product_categories`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`create_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
INSERT INTO `__new_product_categories`("id", "name", "create_at") SELECT "id", "name", "create_at" FROM `product_categories`;--> statement-breakpoint
DROP TABLE `product_categories`;--> statement-breakpoint
ALTER TABLE `__new_product_categories` RENAME TO `product_categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ruc` text NOT NULL,
	`phone` text,
	`address` text,
	`email` text,
	`is_regular` integer DEFAULT false,
	`create_at` integer DEFAULT (unixepoch()),
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "name", "ruc", "phone", "address", "email", "is_regular", "create_at", "updated_at") SELECT "id", "name", "ruc", "phone", "address", "email", "is_regular", "create_at", "updated_at" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
CREATE UNIQUE INDEX `customers_name_unique` ON `customers` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_ruc_unique` ON `customers` (`ruc`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`code` text NOT NULL,
	`unit_size` text NOT NULL,
	`category_id` integer NOT NULL,
	`link` text,
	`rank` real DEFAULT 0 NOT NULL,
	`price` real NOT NULL,
	`cost` real NOT NULL,
	`create_at` integer DEFAULT (unixepoch()),
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "description", "code", "unit_size", "category_id", "link", "rank", "price", "cost", "create_at", "updated_at") SELECT "id", "description", "code", "unit_size", "category_id", "link", "rank", "price", "cost", "create_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_code_unique` ON `products` (`code`);--> statement-breakpoint
CREATE TABLE `__new_quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`deadline` integer NOT NULL,
	`credit` integer,
	`include_igv` integer DEFAULT false,
	`customer_id` text,
	`is_payment_pending` integer DEFAULT false,
	`items` text NOT NULL,
	`create_at` integer DEFAULT (unixepoch()),
	`updated_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quotations`("id", "number", "deadline", "credit", "include_igv", "customer_id", "is_payment_pending", "items", "create_at", "updated_at") SELECT "id", "number", "deadline", "credit", "include_igv", "customer_id", "is_payment_pending", "items", "create_at", "updated_at" FROM `quotations`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
ALTER TABLE `__new_quotations` RENAME TO `quotations`;--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_number_unique` ON `quotations` (`number`);