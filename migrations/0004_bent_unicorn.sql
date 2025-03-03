PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agencies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ruc` text NOT NULL,
	`phone` text,
	`address` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_agencies`("id", "name", "ruc", "phone", "address", "created_at", "updated_at") SELECT "id", "name", "ruc", "phone", "address", "created_at", "updated_at" FROM `agencies`;--> statement-breakpoint
DROP TABLE `agencies`;--> statement-breakpoint
ALTER TABLE `__new_agencies` RENAME TO `agencies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `agencies_name_unique` ON `agencies` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `agencies_ruc_unique` ON `agencies` (`ruc`);--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ruc` text NOT NULL,
	`phone` text,
	`address` text,
	`email` text,
	`is_regular` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "name", "ruc", "phone", "address", "email", "is_regular", "created_at", "updated_at") SELECT "id", "name", "ruc", "phone", "address", "email", "is_regular", "created_at", "updated_at" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
CREATE UNIQUE INDEX `customers_name_unique` ON `customers` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_ruc_unique` ON `customers` (`ruc`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `__new_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`recipient` text NOT NULL,
	`destination` text NOT NULL,
	`dni_ruc` text NOT NULL,
	`phone` text,
	`address` text,
	`observations` text,
	`agency_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`agency_id`) REFERENCES `agencies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_labels`("id", "recipient", "destination", "dni_ruc", "phone", "address", "observations", "agency_id", "created_at", "updated_at") SELECT "id", "recipient", "destination", "dni_ruc", "phone", "address", "observations", "agency_id", "created_at", "updated_at" FROM `labels`;--> statement-breakpoint
DROP TABLE `labels`;--> statement-breakpoint
ALTER TABLE `__new_labels` RENAME TO `labels`;--> statement-breakpoint
CREATE TABLE `__new_quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`deadline` integer NOT NULL,
	`credit` integer,
	`include_igv` integer DEFAULT false,
	`customer_id` text,
	`is_payment_pending` integer DEFAULT false,
	`items` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quotations`("id", "number", "deadline", "credit", "include_igv", "customer_id", "is_payment_pending", "items", "created_at", "updated_at") SELECT "id", "number", "deadline", "credit", "include_igv", "customer_id", "is_payment_pending", "items", "created_at", "updated_at" FROM `quotations`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
ALTER TABLE `__new_quotations` RENAME TO `quotations`;--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_number_unique` ON `quotations` (`number`);--> statement-breakpoint
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
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "description", "code", "unit_size", "category_id", "link", "rank", "price", "cost", "created_at", "updated_at") SELECT "id", "description", "code", "unit_size", "category_id", "link", "rank", "price", "cost", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_code_unique` ON `products` (`code`);--> statement-breakpoint
CREATE TABLE `__new_watermarks` (
	`id` text PRIMARY KEY NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`url` text NOT NULL,
	`public_id` text NOT NULL,
	`format` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_watermarks`("id", "width", "height", "url", "public_id", "format", "created_at", "updated_at") SELECT "id", "width", "height", "url", "public_id", "format", "created_at", "updated_at" FROM `watermarks`;--> statement-breakpoint
DROP TABLE `watermarks`;--> statement-breakpoint
ALTER TABLE `__new_watermarks` RENAME TO `watermarks`;