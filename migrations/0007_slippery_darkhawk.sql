CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`xml` text NOT NULL,
	`hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
