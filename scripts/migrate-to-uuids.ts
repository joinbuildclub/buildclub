/**
 * Migration script to convert database from sequential IDs to UUIDs
 * This script will:
 * 1. Create new tables with UUID primary keys
 * 2. Copy data from old tables to new tables with UUID primary keys
 * 3. Create new foreign key relationships
 * 4. Drop old tables
 * 5. Rename new tables to original names
 */

import 'dotenv/config';
import { db } from '../server/db';
import { v4 as uuidv4 } from 'uuid';
import { sql } from 'drizzle-orm';

async function migrateToUuids() {
  console.log('Beginning migration from sequential IDs to UUIDs...');
  
  try {
    // Step 1: Generate UUIDs and map them to existing IDs
    console.log('Generating UUID mappings for existing records...');
    
    // Execute all queries in a transaction
    await db.transaction(async (tx) => {
      // Enable uuid-ossp extension if not already enabled
      await tx.execute(sql`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `);
      
      // Create temporary tables to store ID -> UUID mappings
      await tx.execute(sql`
        CREATE TEMPORARY TABLE user_id_mapping (
          old_id INTEGER PRIMARY KEY,
          new_id UUID DEFAULT uuid_generate_v4()
        );
        
        CREATE TEMPORARY TABLE hub_id_mapping (
          old_id INTEGER PRIMARY KEY,
          new_id UUID DEFAULT uuid_generate_v4()
        );
        
        CREATE TEMPORARY TABLE event_id_mapping (
          old_id INTEGER PRIMARY KEY,
          new_id UUID DEFAULT uuid_generate_v4()
        );
        
        CREATE TEMPORARY TABLE hub_event_id_mapping (
          old_id INTEGER PRIMARY KEY,
          new_id UUID DEFAULT uuid_generate_v4()
        );
        
        CREATE TEMPORARY TABLE hub_event_registration_id_mapping (
          old_id INTEGER PRIMARY KEY,
          new_id UUID DEFAULT uuid_generate_v4()
        );
      `);

      // Populate the temporary tables with ID mappings
      await tx.execute(sql`
        INSERT INTO user_id_mapping (old_id)
        SELECT id FROM "user";
        
        INSERT INTO hub_id_mapping (old_id)
        SELECT id FROM hub;
        
        INSERT INTO event_id_mapping (old_id)
        SELECT id FROM event;
        
        INSERT INTO hub_event_id_mapping (old_id)
        SELECT id FROM hub_event;
        
        INSERT INTO hub_event_registration_id_mapping (old_id)
        SELECT id FROM hub_event_registration;
      `);
      
      // Step 2: Create new tables with UUID columns
      console.log('Creating new tables with UUID primary keys...');
      
      await tx.execute(sql`
        CREATE TABLE "user_new" (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          username TEXT NOT NULL UNIQUE,
          password TEXT,
          email TEXT UNIQUE,
          google_id TEXT UNIQUE,
          first_name TEXT,
          last_name TEXT,
          profile_picture TEXT,
          role TEXT DEFAULT 'member',
          is_onboarded BOOLEAN DEFAULT FALSE,
          twitter_handle TEXT,
          linkedin_url TEXT,
          github_username TEXT,
          bio TEXT,
          interests TEXT[],
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE hub_new (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          city TEXT NOT NULL,
          state TEXT,
          country TEXT NOT NULL,
          address TEXT,
          latitude TEXT,
          longitude TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE event_new (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT,
          start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
          end_datetime TIMESTAMP WITH TIME ZONE,
          start_date DATE,
          end_date DATE,
          start_time TEXT,
          end_time TEXT,
          event_type event_type NOT NULL,
          focus_areas TEXT[],
          capacity INTEGER,
          is_published BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          created_by_id UUID REFERENCES "user_new"(id)
        );
        
        CREATE TABLE hub_event_new (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          hub_id UUID NOT NULL REFERENCES hub_new(id),
          event_id UUID NOT NULL REFERENCES event_new(id),
          is_primary BOOLEAN DEFAULT FALSE,
          capacity INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT uniq_hub_event_idx_new UNIQUE (hub_id, event_id)
        );
        
        CREATE TABLE hub_event_registration_new (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          hub_event_id UUID NOT NULL REFERENCES hub_event_new(id),
          user_id UUID REFERENCES "user_new"(id),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          interest_areas TEXT[] NOT NULL,
          ai_interests TEXT,
          status TEXT DEFAULT 'registered',
          created_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT uniq_hubevent_user_idx_new UNIQUE (hub_event_id, email)
        );
      `);
      
      // Step 3: Copy data from old tables to new tables with mapped UUIDs
      console.log('Copying data to new tables with UUID primary keys...');
      
      // 1. Copy users
      await tx.execute(sql`
        INSERT INTO "user_new" (
          id, username, password, email, google_id, first_name, last_name, 
          profile_picture, role, is_onboarded, twitter_handle, linkedin_url,
          github_username, bio, interests, created_at
        )
        SELECT 
          m.new_id, u.username, u.password, u.email, u.google_id, u.first_name, u.last_name,
          u.profile_picture, u.role, u.is_onboarded, u.twitter_handle, u.linkedin_url,
          u.github_username, u.bio, u.interests, u.created_at
        FROM "user" u
        JOIN user_id_mapping m ON u.id = m.old_id;
      `);
      
      // 2. Copy hubs
      await tx.execute(sql`
        INSERT INTO hub_new (
          id, name, description, city, state, country, address, latitude, longitude, created_at
        )
        SELECT 
          m.new_id, h.name, h.description, h.city, h.state, h.country, h.address, h.latitude, h.longitude, h.created_at
        FROM hub h
        JOIN hub_id_mapping m ON h.id = m.old_id;
      `);
      
      // 3. Copy events - need to handle the created_by_id reference
      await tx.execute(sql`
        INSERT INTO event_new (
          id, title, description, start_datetime, end_datetime, start_date, end_date,
          start_time, end_time, event_type, focus_areas, capacity, is_published, created_at, created_by_id
        )
        SELECT 
          em.new_id, e.title, e.description, e.start_datetime, e.end_datetime, e.start_date, e.end_date,
          e.start_time, e.end_time, e.event_type, e.focus_areas, e.capacity, e.is_published, e.created_at,
          um.new_id
        FROM event e
        JOIN event_id_mapping em ON e.id = em.old_id
        LEFT JOIN user_id_mapping um ON e.created_by_id = um.old_id;
      `);
      
      // 4. Copy hub_events - need to handle both foreign keys
      await tx.execute(sql`
        INSERT INTO hub_event_new (
          id, hub_id, event_id, is_primary, capacity, created_at
        )
        SELECT 
          hem.new_id, hm.new_id, em.new_id, he.is_primary, he.capacity, he.created_at
        FROM hub_event he
        JOIN hub_event_id_mapping hem ON he.id = hem.old_id
        JOIN hub_id_mapping hm ON he.hub_id = hm.old_id
        JOIN event_id_mapping em ON he.event_id = em.old_id;
      `);
      
      // 5. Copy hub_event_registrations - need to handle both foreign keys
      await tx.execute(sql`
        INSERT INTO hub_event_registration_new (
          id, hub_event_id, user_id, first_name, last_name, email, interest_areas, ai_interests, status, created_at
        )
        SELECT 
          herm.new_id, hem.new_id, um.new_id, her.first_name, her.last_name, her.email, 
          her.interest_areas, her.ai_interests, her.status, her.created_at
        FROM hub_event_registration her
        JOIN hub_event_registration_id_mapping herm ON her.id = herm.old_id
        JOIN hub_event_id_mapping hem ON her.hub_event_id = hem.old_id
        LEFT JOIN user_id_mapping um ON her.user_id = um.old_id;
      `);
      
      // Step 4: Drop old tables and rename new tables
      console.log('Dropping old tables and renaming new tables...');
      
      await tx.execute(sql`
        DROP TABLE IF EXISTS hub_event_registration;
        DROP TABLE IF EXISTS hub_event;
        DROP TABLE IF EXISTS event;
        DROP TABLE IF EXISTS hub;
        DROP TABLE IF EXISTS "user";
        
        ALTER TABLE hub_event_registration_new RENAME TO hub_event_registration;
        ALTER TABLE hub_event_new RENAME TO hub_event;
        ALTER TABLE event_new RENAME TO event;
        ALTER TABLE hub_new RENAME TO hub;
        ALTER TABLE "user_new" RENAME TO "user";
      `);
      
      // Step 5: Create indexes for better performance
      console.log('Creating indexes for better performance...');
      
      await tx.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_event_is_published ON event(is_published);
        CREATE INDEX IF NOT EXISTS idx_hub_event_hub_id ON hub_event(hub_id);
        CREATE INDEX IF NOT EXISTS idx_hub_event_event_id ON hub_event(event_id);
        CREATE INDEX IF NOT EXISTS idx_hub_event_registration_hub_event_id ON hub_event_registration(hub_event_id);
        CREATE INDEX IF NOT EXISTS idx_hub_event_registration_user_id ON hub_event_registration(user_id);
        CREATE INDEX IF NOT EXISTS idx_hub_event_registration_email ON hub_event_registration(email);
      `);
    });
    
    console.log('Migration from sequential IDs to UUIDs completed successfully!');
    
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

// Execute the migration
migrateToUuids()
  .then(() => {
    console.log('Migration script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });