ALTER TABLE "courses" DROP CONSTRAINT "courses_user_email_users_email_fk";
--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "cid" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "no_of_chapters" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "include_videos" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "level" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "course_json" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "user_email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "bannerImageURL" text;