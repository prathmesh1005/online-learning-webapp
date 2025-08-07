ALTER TABLE "courses" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "cid" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "description" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "include_videos" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "level" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "course_json" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "user_email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "catetgory" varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "banner_image_url" varchar(255);--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "bannerImageURL";