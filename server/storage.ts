import { 
  users, 
  type User, 
  type InsertUser, 
  waitlistEntries,
  type WaitlistEntry,
  type InsertWaitlistEntry
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  addContactToSendGrid, 
  sendWelcomeEmail, 
  sendAdminNotification 
} from "./sendgrid";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const [entry] = await db
      .insert(waitlistEntries)
      .values(insertEntry)
      .returning();
    
    // Process the entry with SendGrid
    await this.processWithSendGrid(entry);
    
    return entry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return db.select().from(waitlistEntries);
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    const [entry] = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return entry || undefined;
  }
  
  private async processWithSendGrid(entry: WaitlistEntry): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("SendGrid API key not found. Skipping SendGrid integration.");
      return;
    }
    
    try {
      // Add contact to SendGrid mailing list
      const contactAdded = await addContactToSendGrid(entry);
      if (contactAdded) {
        console.log(`Contact ${entry.email} added to SendGrid successfully`);
      }
      
      // Send welcome email to the subscriber
      const welcomeEmailSent = await sendWelcomeEmail(entry);
      if (welcomeEmailSent) {
        console.log(`Welcome email sent to ${entry.email} successfully`);
      }
      
      // Send notification to admin
      const adminNotificationSent = await sendAdminNotification(entry);
      if (adminNotificationSent) {
        console.log(`Admin notification sent for ${entry.email} successfully`);
      }
    } catch (error) {
      console.error("Error processing SendGrid operations:", error);
    }
  }
}

export const storage = new DatabaseStorage();
