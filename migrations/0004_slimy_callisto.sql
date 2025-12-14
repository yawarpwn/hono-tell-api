PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`avatar` text DEFAULT 'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password", "role", "first_name", "last_name", "is_active", "avatar") SELECT "id", "email", "password", "role", "first_name", "last_name", "is_active", "avatar" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `quotations` ADD `user_id` text REFERENCES users(id);