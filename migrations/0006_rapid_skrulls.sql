PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quotations` (
	`id` text PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`deadline` integer NOT NULL,
	`credit` integer,
	`include_igv` integer DEFAULT false,
	`customer_id` text,
	`user_id` text NOT NULL,
	`updated_by` text,
	`validity_days` integer DEFAULT 15 NOT NULL,
	`observations` text,
	`standard_terms` text,
	`payment_codition` text DEFAULT 'ADVANCE_50' NOT NULL,
	`is_payment_pending` integer DEFAULT false,
	`items` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quotations`("id", "number", "deadline", "credit", "include_igv", "customer_id", "user_id", "updated_by", "validity_days", "observations", "standard_terms", "payment_codition", "is_payment_pending", "items", "created_at", "updated_at") SELECT "id", "number", "deadline", "credit", "include_igv", "customer_id", "user_id", "updated_by", "validity_days", "observations", "standard_terms", "payment_codition", "is_payment_pending", "items", "created_at", "updated_at" FROM `quotations`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
ALTER TABLE `__new_quotations` RENAME TO `quotations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `quotations_number_unique` ON `quotations` (`number`);