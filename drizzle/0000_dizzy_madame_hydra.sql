CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_name" varchar(255) NOT NULL,
	"connection_string" text NOT NULL
);
