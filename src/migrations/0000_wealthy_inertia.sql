CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256),
	"auth_provider" varchar(256),
	"auth_provider_id" varchar(256),
	"name" varchar(256),
	"profile_pic_url" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_unique_idx" ON "users" ("email");