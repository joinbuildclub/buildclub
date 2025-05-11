import "dotenv/config";
import { db } from "./server/db.js";
import { sql } from "drizzle-orm";

async function checkColumns() {
  try {
    console.log("Checking hub_event_registration table structure...");

    // Query the information schema to see table columns
    const result = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hub_event_registration'
      ORDER BY ordinal_position;
    `);

    // Display the results
    console.log("Columns in hub_event_registration table:");
    result.rows.forEach((row) => {
      console.log(`${row.column_name} (${row.data_type})`);
    });

    // Check specifically for our two columns
    const hasInterestAreas = result.rows.some(
      (row) => row.column_name === "interest_areas"
    );
    const hasAiInterests = result.rows.some(
      (row) => row.column_name === "ai_interests"
    );

    console.log(`\ninterest_areas column exists: ${hasInterestAreas}`);
    console.log(`ai_interests column exists: ${hasAiInterests}`);

    if (!hasInterestAreas || !hasAiInterests) {
      console.log("\nMissing columns detected. Would need to run:");
      console.log(`
      ALTER TABLE "hub_event_registration" 
      ${
        !hasInterestAreas
          ? 'ADD COLUMN IF NOT EXISTS "interest_areas" TEXT[],'
          : ""
      }
      ${!hasAiInterests ? 'ADD COLUMN IF NOT EXISTS "ai_interests" TEXT;' : ""}
      `);
    }
  } catch (error) {
    console.error("Error checking columns:", error);
  } finally {
    process.exit(0);
  }
}

checkColumns();
