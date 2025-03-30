import { db } from "../server/db";
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

// This script runs database migrations using Drizzle

async function main() {
  console.log('Starting database migration...');
  
  try {
    // Use the same database connection as the main app
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // Create Drizzle instance
    const migrationDb = drizzle(pool);
    
    // Run migrations
    await migrate(migrationDb, { migrationsFolder: './drizzle' });
    
    console.log('Migration completed successfully!');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();