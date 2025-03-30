import pg from 'pg';
import { waitlistEntries } from '../shared/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

/**
 * This script synchronizes the database schema with the application schema
 * It's meant to be run with: tsx scripts/db-sync.ts
 */

async function main() {
  console.log('Starting database synchronization...');
  
  try {
    // Create a connection pool
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // Create Drizzle instance
    const db = drizzle(pool);
    
    // Check if the waitlist_entries table exists
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'waitlist_entries'
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('Creating waitlist_entries table...');
      
      // Create the table if it doesn't exist
      await db.execute(sql`
        CREATE TABLE waitlist_entries (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          interest_areas TEXT[] NOT NULL,
          ai_interests TEXT
        )
      `);
      
      console.log('Table created successfully!');
    } else {
      console.log('Table waitlist_entries already exists, checking columns...');
      
      // Check columns
      const columnsResult = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'waitlist_entries'
      `);
      
      const columns = columnsResult.map(row => row.column_name);
      
      // Check if interest_areas column exists
      if (!columns.includes('interest_areas')) {
        if (columns.includes('role')) {
          console.log('Renaming role column to interest_areas...');
          await db.execute(sql`ALTER TABLE waitlist_entries RENAME COLUMN role TO interest_areas`);
        } else {
          console.log('Adding interest_areas column...');
          await db.execute(sql`ALTER TABLE waitlist_entries ADD COLUMN interest_areas TEXT[] NOT NULL DEFAULT '{}'`);
        }
      }
      
      // Check if ai_interests column exists
      if (!columns.includes('ai_interests')) {
        if (columns.includes('interests')) {
          console.log('Renaming interests column to ai_interests...');
          await db.execute(sql`ALTER TABLE waitlist_entries RENAME COLUMN interests TO ai_interests`);
        } else {
          console.log('Adding ai_interests column...');
          await db.execute(sql`ALTER TABLE waitlist_entries ADD COLUMN ai_interests TEXT`);
        }
      }
      
      console.log('Columns synchronized successfully!');
    }
    
    console.log('Database synchronization completed!');
    
    // Close the pool
    await pool.end();
    
    process.exit(0);
  } catch (error) {
    console.error('Database synchronization failed:', error);
    process.exit(1);
  }
}

main();