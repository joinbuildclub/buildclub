-- Add missing columns to hub_event_registration table
ALTER TABLE "hub_event_registration" 
ADD COLUMN IF NOT EXISTS "interest_areas" TEXT[],
ADD COLUMN IF NOT EXISTS "ai_interests" TEXT; 