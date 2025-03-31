-- Add is_guest column to user table
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "is_guest" BOOLEAN DEFAULT FALSE;

-- Add notes column to hub_event_registration table
ALTER TABLE "hub_event_registration"
ADD COLUMN IF NOT EXISTS "notes" TEXT;