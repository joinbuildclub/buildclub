/**
 * This script adds the email verification fields to the user table
 * Run with: tsx scripts/add-verification-fields.ts
 */

import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { pool } from "../server/db";

async function main() {
  try {
    console.log("Adding email verification fields to user table...");
    
    // First, check if columns already exist
    const columnCheckResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user'
      AND column_name IN ('is_confirmed', 'account_confirmation_token');
    `);
    
    const existingColumns = columnCheckResult.rows.map(row => row.column_name);
    
    // Add the is_confirmed column if it doesn't exist
    if (!existingColumns.includes('is_confirmed')) {
      await pool.query(`
        ALTER TABLE "user"
        ADD COLUMN "is_confirmed" BOOLEAN DEFAULT FALSE;
      `);
      console.log("Added is_confirmed column");
    } else {
      console.log("is_confirmed column already exists");
    }
    
    // Add the account_confirmation_token column if it doesn't exist
    if (!existingColumns.includes('account_confirmation_token')) {
      await pool.query(`
        ALTER TABLE "user"
        ADD COLUMN "account_confirmation_token" UUID;
      `);
      console.log("Added account_confirmation_token column");
    } else {
      console.log("account_confirmation_token column already exists");
    }
    
    console.log("Email verification fields added successfully");
    
  } catch (error) {
    console.error("Error adding email verification fields:", error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main();