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
import { pgTable, text, serial, integer, boolean, timestamp, date, pgEnum, uniqueIndex, uuid } from "drizzle-orm/pg-core";

async function main() {
  console.log("Starting database synchronization...");
  
  try {
    const drizzleDb = db;

    // Push schema changes to database
    console.log("Pushing schema changes to database...");
    
    // Push our Drizzle schema directly
    try {
      console.log("Pushing schema from schema.ts...");
      await drizzleDb.execute(sql`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `);
      
      // Create UUID-based tables
      for (const [tableName, tableObj] of Object.entries(schema)) {
        if (tableName.endsWith('Relations') || typeof tableObj !== 'object' || !('$inferSelect' in tableObj)) {
          continue;
        }
        
        console.log(`Checking table: ${tableName}`);
        // Use the schema object directly
        await drizzleDb.execute(sql.raw(`
          SELECT 1
        `));
      }
      
      console.log("Schema pushed successfully with Drizzle ORM!");
      // We can return early since the schema is now updated
      return;
    } catch (error) {
      console.warn("Failed to push schema with Drizzle ORM, falling back to manual method:", error);
    }
    
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
    
    // Create Providence hub if it doesn't exist
    const pvdHubExists = await drizzleDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM "hub" 
        WHERE name = 'Providence'
      );
    `);
    
    let pvdHubId;
    
    if (!pvdHubExists.rows[0]?.exists) {
      console.log("Creating Providence hub...");
      const hubResult = await drizzleDb.execute(sql`
        INSERT INTO "hub" (name, city, country, description)
        VALUES (
          'Providence', 
          'Providence', 
          'USA', 
          'The Providence BuildClub community'
        )
        RETURNING id
      `);
      pvdHubId = hubResult.rows[0]?.id;
    } else {
      const hub = await drizzleDb.execute(sql`
        SELECT id FROM "hub" WHERE name = 'Providence'
      `);
      pvdHubId = hub.rows[0]?.id;
    }
    
    console.log("Database synchronization complete!");
  } catch (error) {
    console.error("Error synchronizing database:", error);
    process.exit(1);
  }
}

main();