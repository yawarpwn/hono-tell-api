CREATE TABLE `fire_extinguisher_certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`emission_date` text NOT NULL,
	`type` text NOT NULL,
	`capacity` text NOT NULL,
	`serie` text NOT NULL,
	`ruc` text,
	`company_name` text,
	`address` text,
	`model` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
