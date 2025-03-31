import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function renameTables() {
  console.log('Starting table renaming...');
  
  try {
    // Begin transaction
    await db.execute(sql`BEGIN`);
    
    // Rename tables
    console.log('Renaming users to user...');
    await db.execute(sql`ALTER TABLE IF EXISTS users RENAME TO "user"`);
    
    console.log('Renaming events to event...');
    await db.execute(sql`ALTER TABLE IF EXISTS events RENAME TO "event"`);
    
    console.log('Renaming hubs to hub...');
    await db.execute(sql`ALTER TABLE IF EXISTS hubs RENAME TO "hub"`);
    
    console.log('Renaming hub_events to hub_event...');
    await db.execute(sql`ALTER TABLE IF EXISTS hub_events RENAME TO hub_event`);
    
    console.log('Renaming hub_event_registrations to hub_event_registration...');
    await db.execute(sql`ALTER TABLE IF EXISTS hub_event_registrations RENAME TO hub_event_registration`);
    
    console.log('Renaming waitlist_entries to waitlist_entry...');
    await db.execute(sql`ALTER TABLE IF EXISTS waitlist_entries RENAME TO waitlist_entry`);
    
    // Commit transaction
    await db.execute(sql`COMMIT`);
    
    console.log('Tables renamed successfully!');
  } catch (error) {
    // Rollback transaction on error
    await db.execute(sql`ROLLBACK`);
    console.error('Error renaming tables:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

renameTables();