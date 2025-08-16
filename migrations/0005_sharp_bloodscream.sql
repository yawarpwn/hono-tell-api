ALTER TABLE `watermarks` ADD `title` text;--> statement-breakpoint
ALTER TABLE `watermarks` ADD `category_id` integer REFERENCES gallery_categories(id);