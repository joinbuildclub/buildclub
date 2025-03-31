/**
 * This script synchronizes the database schema with the application schema
 * It's meant to be run with: tsx scripts/db-sync.ts
 */

import { db } from "../server/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema";
import { Pool } from "pg";

async function main() {
  console.log("Starting database synchronization...");
  
  try {
    const drizzleDb = db;

    // Push schema changes to database
    console.log("Pushing schema changes to database...");
    
    // Check if the user table exists
    const userTableExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user'
      );
    `);
    
    if (!userTableExists.rows[0]?.exists) {
      console.log("Creating user table...");
      await drizzleDb.execute(sql`
        CREATE TABLE IF NOT EXISTS "user" (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE,
          email VARCHAR(255) UNIQUE,
          "firstName" VARCHAR(255),
          "lastName" VARCHAR(255),
          "profilePicture" VARCHAR(255),
          role VARCHAR(20),
          password VARCHAR(255),
          "googleId" VARCHAR(255) UNIQUE
        )
      `);
    }
    
    // Check if the hub table exists
    const hubTableExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hub'
      );
    `);
    
    if (!hubTableExists.rows[0]?.exists) {
      console.log("Creating hub table...");
      await drizzleDb.execute(sql`
        CREATE TABLE IF NOT EXISTS "hub" (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          city VARCHAR(255) NOT NULL,
          state VARCHAR(255),
          country VARCHAR(255) NOT NULL,
          address VARCHAR(255),
          latitude VARCHAR(255),
          longitude VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Check if the event table exists
    const eventTableExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'event'
      );
    `);
    
    if (!eventTableExists.rows[0]?.exists) {
      console.log("Creating event table...");
      await drizzleDb.execute(sql`
        CREATE TABLE IF NOT EXISTS "event" (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          start_date DATE NOT NULL,
          end_date DATE,
          start_time VARCHAR(50),
          end_time VARCHAR(50),
          event_type VARCHAR(50) NOT NULL,
          focus_areas TEXT[],
          capacity INTEGER,
          is_published BOOLEAN DEFAULT false,
          created_by_id INTEGER REFERENCES "user"(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Check if the hub_event table exists
    const hubEventTableExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hub_event'
      );
    `);
    
    if (!hubEventTableExists.rows[0]?.exists) {
      console.log("Creating hub_event table...");
      await drizzleDb.execute(sql`
        CREATE TABLE IF NOT EXISTS "hub_event" (
          id SERIAL PRIMARY KEY,
          hub_id INTEGER NOT NULL REFERENCES "hub"(id),
          event_id INTEGER NOT NULL REFERENCES "event"(id),
          is_primary BOOLEAN DEFAULT false,
          capacity INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(hub_id, event_id)
        )
      `);
    }
    
    // Check if the hub_event_registration table exists
    const regTableExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hub_event_registration'
      );
    `);
    
    if (!regTableExists.rows[0]?.exists) {
      console.log("Creating hub_event_registration table...");
      await drizzleDb.execute(sql`
        CREATE TABLE IF NOT EXISTS "hub_event_registration" (
          id SERIAL PRIMARY KEY,
          hub_event_id INTEGER REFERENCES "hub_event"(id),
          user_id INTEGER REFERENCES "user"(id),
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          interest_areas TEXT[] NOT NULL,
          ai_interests TEXT[],
          status VARCHAR(50) DEFAULT 'registered',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(hub_event_id, email)
        )
      `);
    }
    
    // Create a Waitlist event if none exists
    const waitlistEventExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM "event" 
        WHERE title = 'BuildClub Waitlist'
      );
    `);
    
    if (!waitlistEventExists.rows[0]?.exists) {
      console.log("Creating BuildClub Waitlist event...");
      await drizzleDb.execute(sql`
        INSERT INTO "event" (title, description, start_date, event_type, focus_areas, is_published)
        VALUES (
          'BuildClub Waitlist', 
          'Default event for waitlist registrations', 
          CURRENT_DATE, 
          'meetup', 
          ARRAY['product', 'design', 'engineering'], 
          true
        )
        RETURNING id
      `);
    }
    
    // Get default event ID
    const defaultEvent = await drizzleDb.execute(sql`
      SELECT id FROM "event" WHERE title = 'BuildClub Waitlist'
    `);
    
    const defaultEventId = defaultEvent.rows[0]?.id;
    
    // Create default hub if it doesn't exist
    const defaultHubExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM "hub" 
        WHERE name = 'BuildClub Global'
      );
    `);
    
    let defaultHubId;
    
    if (!defaultHubExists.rows[0]?.exists) {
      console.log("Creating BuildClub Global hub...");
      const hubResult = await drizzleDb.execute(sql`
        INSERT INTO "hub" (name, city, country, description)
        VALUES (
          'BuildClub Global', 
          'Global', 
          'Online', 
          'The global BuildClub community'
        )
        RETURNING id
      `);
      defaultHubId = hubResult.rows[0]?.id;
    } else {
      const hub = await drizzleDb.execute(sql`
        SELECT id FROM "hub" WHERE name = 'BuildClub Global'
      `);
      defaultHubId = hub.rows[0]?.id;
    }
    
    // Create hub_event mapping if it doesn't exist
    if (defaultEventId && defaultHubId) {
      const hubEventExists = await drizzleDb.execute(sql`
        SELECT EXISTS (
          SELECT FROM "hub_event" 
          WHERE hub_id = ${defaultHubId} AND event_id = ${defaultEventId}
        );
      `);
      
      if (!hubEventExists.rows[0]?.exists) {
        console.log("Creating default hub_event mapping...");
        await drizzleDb.execute(sql`
          INSERT INTO "hub_event" (hub_id, event_id, is_primary)
          VALUES (${defaultHubId}, ${defaultEventId}, true)
        `);
      }
    }
    
    console.log("Database synchronization complete!");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    process.exit(1);
  }
}

main();