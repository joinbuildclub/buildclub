CREATE TYPE "public"."event_type" AS ENUM('workshop', 'meetup', 'hackathon', 'conference');--> statement-breakpoint
CREATE TYPE "public"."focus_area" AS ENUM('product', 'design', 'engineering', 'general');--> statement-breakpoint
CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_datetime" timestamp with time zone NOT NULL,
	"end_datetime" timestamp with time zone,
	"start_date" date,
	"end_date" date,
	"start_time" text,
	"end_time" text,
	"event_type" "event_type" NOT NULL,
	"focus_areas" text[],
	"capacity" integer,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"created_by_id" uuid
);
--> statement-breakpoint
CREATE TABLE "hub_event_registration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hub_event_id" uuid NOT NULL,
	"user_id" uuid,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"interest_areas" text[],
	"ai_interests" text,
	"status" text DEFAULT 'registered',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hub_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hub_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false,
	"capacity" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hub" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"city" text NOT NULL,
	"state" text,
	"country" text NOT NULL,
	"address" text,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text,
	"email" text,
	"google_id" text,
	"first_name" text,
	"last_name" text,
	"profile_picture" text,
	"role" text DEFAULT 'member',
	"is_onboarded" boolean DEFAULT false,
	"is_guest" boolean DEFAULT false,
	"twitter_handle" text,
	"linkedin_url" text,
	"github_username" text,
	"bio" text,
	"interests" text[],
	"is_confirmed" boolean DEFAULT false,
	"account_confirmation_token" uuid,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hub_event_registration" ADD CONSTRAINT "hub_event_registration_hub_event_id_hub_event_id_fk" FOREIGN KEY ("hub_event_id") REFERENCES "public"."hub_event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hub_event_registration" ADD CONSTRAINT "hub_event_registration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hub_event" ADD CONSTRAINT "hub_event_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hub_event" ADD CONSTRAINT "hub_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_hubevent_user_idx_new" ON "hub_event_registration" USING btree ("hub_event_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_hub_event_idx_new" ON "hub_event" USING btree ("hub_id","event_id");