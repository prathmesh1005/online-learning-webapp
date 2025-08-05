CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"cid" varchar(255) NOT NULL,
	"name" varchar(255),
	"description" varchar(255),
	"no_of_chapters" integer NOT NULL,
	"include_videos" boolean DEFAULT false,
	"level" varchar(255) NOT NULL,
	"category" varchar(255),
	"course_json" json,
	"user_email" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscription_id" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;