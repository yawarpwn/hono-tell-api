CREATE TABLE `subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
