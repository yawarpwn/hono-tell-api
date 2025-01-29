CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`complete` integer DEFAULT false,
	`text` text NOT NULL,
	`createAt` text DEFAULT (CURRENT_DATE)
);
