PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_subscribers`("id", "email", "created_at") SELECT "id", "email", "created_at" FROM `subscribers`;--> statement-breakpoint
DROP TABLE `subscribers`;--> statement-breakpoint
ALTER TABLE `__new_subscribers` RENAME TO `subscribers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);