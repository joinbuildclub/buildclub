/**
 * This script applies the email verification migration to the database
 * Run with: tsx scripts/apply-email-verification.ts
 */
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Applying email verification migration...");
  
  try {
    // Read the SQL file
    const sqlFile = path.resolve(__dirname, "../migrations/add_email_verification.sql");
    const sqlQuery = fs.readFileSync(sqlFile, "utf8");
    
    // Execute the SQL query
    await db.execute(sql.raw(sqlQuery));
    
    console.log("Email verification migration completed successfully!");
  } catch (error) {
    console.error("Error applying migration:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });