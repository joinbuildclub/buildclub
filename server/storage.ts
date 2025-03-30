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
import nodemailer from "nodemailer";

// Email service configuration
const setupEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  console.warn("Email configuration not found. Email notifications will not be sent.");
  return null;
};

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  private emailTransporter;
  
  constructor() {
    this.emailTransporter = setupEmailTransporter();
  }
  
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
    
    // Send email notifications if email is configured
    await this.sendEmailNotifications(entry);
    
    return entry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return db.select().from(waitlistEntries);
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    const [entry] = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return entry || undefined;
  }
  
  private async sendEmailNotifications(entry: WaitlistEntry): Promise<void> {
    if (!this.emailTransporter) return;
    
    try {
      // Send confirmation email to the user
      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: entry.email,
        subject: "Welcome to BuildClub Waitlist!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thanks for joining the BuildClub waitlist!</h2>
            <p>Hi ${entry.firstName},</p>
            <p>We're excited to have you join our community of builders. We'll keep you updated on upcoming events and opportunities.</p>
            <p>Here's a summary of what you shared with us:</p>
            <ul>
              <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
              <li><strong>Email:</strong> ${entry.email}</li>
              <li><strong>Roles:</strong> ${entry.role.join(', ')}</li>
              ${entry.interests ? `<li><strong>Interests:</strong> ${entry.interests}</li>` : ''}
            </ul>
            <p>Looking forward to building together!</p>
            <p>The BuildClub Team</p>
          </div>
        `
      });
      
      // Send notification to admin if ADMIN_EMAIL is configured
      if (process.env.ADMIN_EMAIL) {
        await this.emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: "New BuildClub Waitlist Submission",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Waitlist Submission</h2>
              <p>A new user has joined the BuildClub waitlist:</p>
              <ul>
                <li><strong>Name:</strong> ${entry.firstName} ${entry.lastName}</li>
                <li><strong>Email:</strong> ${entry.email}</li>
                <li><strong>Roles:</strong> ${entry.role.join(', ')}</li>
                ${entry.interests ? `<li><strong>Interests:</strong> ${entry.interests}</li>` : ''}
              </ul>
            </div>
          `
        });
      }
      
      console.log(`Email notifications sent for ${entry.email}`);
    } catch (error) {
      console.error("Failed to send email notifications:", error);
    }
  }
}

export const storage = new DatabaseStorage();
