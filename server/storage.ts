import { 
  users, 
  type User, 
  type InsertUser, 
  waitlistEntries,
  type WaitlistEntry,
  type InsertWaitlistEntry,
  hubs,
  type Hub,
  type InsertHub,
  events,
  type Event,
  type InsertEvent,
  hubEvents,
  type HubEvent,
  type InsertHubEvent,
  hubEventRegistrations,
  type HubEventRegistration,
  type InsertHubEventRegistration
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, SQL, sql, asc } from "drizzle-orm";
import { 
  addContactToSendGrid, 
  sendWelcomeEmail, 
  sendAdminNotification 
} from "./sendgrid";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Hub methods
  createHub(hub: InsertHub): Promise<Hub>;
  getHub(id: number): Promise<Hub | undefined>;
  getHubByName(name: string): Promise<Hub | undefined>;
  getHubs(): Promise<Hub[]>;
  
  // Event methods
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(filters?: { isPublished?: boolean }): Promise<Event[]>;
  
  // Hub Event methods
  createHubEvent(hubEvent: InsertHubEvent): Promise<HubEvent>;
  getHubEvent(id: number): Promise<HubEvent | undefined>;
  getHubEventsByEventId(eventId: number): Promise<HubEvent[]>;
  getHubEventsByHubId(hubId: number): Promise<HubEvent[]>;
  
  // Hub Event Registration methods
  createHubEventRegistration(registration: InsertHubEventRegistration): Promise<HubEventRegistration>;
  getHubEventRegistration(id: number): Promise<HubEventRegistration | undefined>;
  getHubEventRegistrationsByHubEventId(hubEventId: number): Promise<HubEventRegistration[]>;
  getHubEventRegistrationByEmail(hubEventId: number, email: string): Promise<HubEventRegistration | undefined>;
  
  // Legacy waitlist methods for backwards compatibility
  createWaitlistEntry(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Helper method to safely convert data for Drizzle
  private safeData<T>(data: T): any {
    if (!data) return data;
    
    // Create a deep copy to avoid mutating the original
    const result = { ...data };
    
    // Handle common type conversions
    for (const [key, value] of Object.entries(result)) {
      // Convert Date objects to ISO strings for database
      if (value instanceof Date) {
        // For date fields, keep only the YYYY-MM-DD part
        if (key.toLowerCase().includes('date')) {
          (result as any)[key] = value.toISOString().split('T')[0];
        } else {
          (result as any)[key] = value.toISOString();
        }
      }
      
      // Handle arrays (like interestAreas)
      if (Array.isArray(value)) {
        (result as any)[key] = value;
      }
      
      // Handle objects that need conversion to JSON
      if (value !== null && typeof value === 'object' && !(value instanceof Date) && !Array.isArray(value)) {
        try {
          (result as any)[key] = JSON.stringify(value);
        } catch (err) {
          console.warn(`Failed to stringify object at key ${key}:`, err);
        }
      }
    }
    
    return result;
  }
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(this.safeData(insertUser))
      .returning();
    return user;
  }
  
  // Hub methods
  async createHub(insertHub: InsertHub): Promise<Hub> {
    const [hub] = await db
      .insert(hubs)
      .values(this.safeData(insertHub))
      .returning();
    return hub;
  }
  
  async getHub(id: number): Promise<Hub | undefined> {
    const [hub] = await db.select().from(hubs).where(eq(hubs.id, id));
    return hub || undefined;
  }
  
  async getHubByName(name: string): Promise<Hub | undefined> {
    const [hub] = await db.select().from(hubs).where(eq(hubs.name, name));
    return hub || undefined;
  }
  
  async getHubs(): Promise<Hub[]> {
    return db.select().from(hubs).orderBy(asc(hubs.name));
  }
  
  // Event methods
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(this.safeData(insertEvent))
      .returning();
    return event;
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }
  
  async getEvents(filters?: { isPublished?: boolean }): Promise<Event[]> {
    let query = db.select().from(events);
    
    if (filters?.isPublished !== undefined) {
      query = query.where(eq(events.isPublished, filters.isPublished)) as any;
    }
    
    return await query.orderBy(desc(events.startDate));
  }
  
  // Hub Event methods
  async createHubEvent(insertHubEvent: InsertHubEvent): Promise<HubEvent> {
    const [hubEvent] = await db
      .insert(hubEvents)
      .values(this.safeData(insertHubEvent))
      .returning();
    return hubEvent;
  }
  
  async getHubEvent(id: number): Promise<HubEvent | undefined> {
    const [hubEvent] = await db.select().from(hubEvents).where(eq(hubEvents.id, id));
    return hubEvent || undefined;
  }
  
  async getHubEventsByEventId(eventId: number): Promise<HubEvent[]> {
    return db.select().from(hubEvents).where(eq(hubEvents.eventId, eventId));
  }
  
  async getHubEventsByHubId(hubId: number): Promise<HubEvent[]> {
    return db.select().from(hubEvents).where(eq(hubEvents.hubId, hubId));
  }
  
  // Hub Event Registration methods
  async createHubEventRegistration(insertRegistration: InsertHubEventRegistration): Promise<HubEventRegistration> {
    const [registration] = await db
      .insert(hubEventRegistrations)
      .values(this.safeData(insertRegistration))
      .returning();
    
    // Process the registration with SendGrid
    await this.processWithSendGrid(registration);
    
    return registration;
  }
  
  async getHubEventRegistration(id: number): Promise<HubEventRegistration | undefined> {
    const [registration] = await db.select().from(hubEventRegistrations).where(eq(hubEventRegistrations.id, id));
    return registration || undefined;
  }
  
  async getHubEventRegistrationsByHubEventId(hubEventId: number): Promise<HubEventRegistration[]> {
    return db.select().from(hubEventRegistrations).where(eq(hubEventRegistrations.hubEventId, hubEventId));
  }
  
  async getHubEventRegistrationByEmail(hubEventId: number, email: string): Promise<HubEventRegistration | undefined> {
    const [registration] = await db.select().from(hubEventRegistrations)
      .where(and(
        eq(hubEventRegistrations.hubEventId, hubEventId),
        eq(hubEventRegistrations.email, email)
      ));
    return registration || undefined;
  }

  // Legacy waitlist methods for backwards compatibility
  async createWaitlistEntry(insertEntry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    // Find or create a default event for the waitlist
    let defaultEvent = await this.getEventByTitle("BuildClub Waitlist");
    if (!defaultEvent) {
      defaultEvent = await this.createEvent({
        title: "BuildClub Waitlist",
        description: "Default event for BuildClub waitlist entries",
        startDate: new Date(), // safeData will handle the conversion to string
        eventType: "meetup",
        isPublished: false,
      });
    }
    
    // Find or create a default hub for the waitlist
    let defaultHub = await this.getHubByName("BuildClub Global");
    if (!defaultHub) {
      defaultHub = await this.createHub({
        name: "BuildClub Global",
        city: "Global",
        country: "Global",
      });
    }
    
    // Find or create a default hub-event for the waitlist
    let defaultHubEvent;
    const hubEvents = await this.getHubEventsByEventId(defaultEvent.id);
    if (hubEvents.length > 0) {
      defaultHubEvent = hubEvents[0];
    } else {
      defaultHubEvent = await this.createHubEvent({
        hubId: defaultHub.id,
        eventId: defaultEvent.id,
        isPrimary: true,
      });
    }
    
    // Create the hub event registration
    const registration = await this.createHubEventRegistration({
      hubEventId: defaultHubEvent.id,
      firstName: insertEntry.firstName,
      lastName: insertEntry.lastName,
      email: insertEntry.email,
      interestAreas: insertEntry.interestAreas,
      aiInterests: insertEntry.aiInterests,
    });
    
    // Return the registration as a WaitlistEntry for backwards compatibility
    return registration;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    // For backward compatibility, use the existing waitlist table
    // Later this can be migrated to query from hub_event_registrations
    // Using type assertion to handle compatibility issues
    const entries = await db.select().from(waitlistEntries);
    return entries as unknown as WaitlistEntry[];
  }

  async getWaitlistEntryByEmail(email: string): Promise<WaitlistEntry | undefined> {
    // For backward compatibility, use the existing waitlist table
    // Later this can be migrated to query from hub_event_registrations
    const [entry] = await db.select().from(waitlistEntries).where(eq(waitlistEntries.email, email));
    return (entry || undefined) as unknown as WaitlistEntry | undefined;
  }
  
  // Helper methods
  private async getEventByTitle(title: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.title, title));
    return event || undefined;
  }
  
  private async processWithSendGrid(entry: HubEventRegistration | WaitlistEntry): Promise<void> {
    // Check if SendGrid is properly configured
    const isSendGridConfigured = !!process.env.SENDGRID_API_KEY && !!process.env.ADMIN_EMAIL;
    
    if (!isSendGridConfigured) {
      console.log("SendGrid not fully configured. Skipping email operations but form submission was successful.");
      return;
    }
    
    try {
      // Try to add contact to SendGrid mailing list
      try {
        const contactAdded = await addContactToSendGrid(entry);
        if (contactAdded) {
          console.log(`Contact ${entry.email} added to SendGrid successfully`);
        }
      } catch (err) {
        console.error("Error adding contact to SendGrid:", err);
        // Continue with other operations even if this one fails
      }
      
      // Try to send welcome email to the subscriber
      try {
        const welcomeEmailSent = await sendWelcomeEmail(entry);
        if (welcomeEmailSent) {
          console.log(`Welcome email sent to ${entry.email} successfully`);
        }
      } catch (err) {
        console.error("Error sending welcome email:", err);
      }
      
      // Try to send notification to admin
      try {
        const adminNotificationSent = await sendAdminNotification(entry);
        if (adminNotificationSent) {
          console.log(`Admin notification sent for ${entry.email} successfully`);
        }
      } catch (err) {
        console.error("Error sending admin notification:", err);
      }
    } catch (error) {
      console.error("Error in SendGrid processing:", error);
      // Don't let SendGrid errors prevent the form submission
    }
  }
}

export const storage = new DatabaseStorage();
