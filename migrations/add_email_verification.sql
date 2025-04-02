-- Add email verification columns to the user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "is_confirmed" BOOLEAN DEFAULT FALSE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "account_confirmation_token" UUID;

-- Set existing users with googleId as confirmed
UPDATE "user" SET "is_confirmed" = TRUE WHERE "google_id" IS NOT NULL;

-- Set any admin users as confirmed
UPDATE "user" SET "is_confirmed" = TRUE WHERE "role" = 'admin';