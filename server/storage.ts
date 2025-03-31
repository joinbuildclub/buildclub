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
  type InsertHubEventRegistration,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, SQL, sql, asc } from "drizzle-orm";
import {
  addContactToSendGrid,
  sendWelcomeEmail,
  sendAdminNotification,
} from "./sendgrid";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;

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
  createHubEventRegistration(
    registration: InsertHubEventRegistration,
  ): Promise<HubEventRegistration>;
  getHubEventRegistration(
    id: number,
  ): Promise<HubEventRegistration | undefined>;
  getHubEventRegistrationsByHubEventId(
    hubEventId: number,
  ): Promise<HubEventRegistration[]>;
  getHubEventRegistrationByEmail(
    hubEventId: number,
    email: string,
  ): Promise<HubEventRegistration | undefined>;

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
        if (key.toLowerCase().includes("date")) {
          (result as any)[key] = value.toISOString().split("T")[0];
        } else {
          (result as any)[key] = value.toISOString();
        }
      }

      // Handle arrays (like interestAreas)
      if (Array.isArray(value)) {
        (result as any)[key] = value;
      }

      // Handle objects that need conversion to JSON
      if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(this.safeData(insertUser))
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(this.safeData(userData))
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
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

  async getEvents(filters?: {
    isPublished?: boolean;
    hubId?: number;
  }): Promise<Event[]> {
    // Handle different filter combinations with separate queries for type safety
    let eventsQuery;

    if (filters?.isPublished !== undefined && filters?.hubId !== undefined) {
      // Both filters
      eventsQuery = db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          startDate: events.startDate,
          endDate: events.endDate,
          startTime: events.startTime,
          endTime: events.endTime,
          eventType: events.eventType,
          focusAreas: events.focusAreas,
          capacity: events.capacity,
          isPublished: events.isPublished,
          createdAt: events.createdAt,
          createdById: events.createdById,
          // Hub event data
          hubId: hubEvents.hubId,
          hubEventId: hubEvents.id,
        })
        .from(events)
        .innerJoin(hubEvents, eq(events.id, hubEvents.eventId))
        .where(
          and(
            eq(events.isPublished, filters.isPublished),
            eq(hubEvents.hubId, filters.hubId),
          ),
        )
        .orderBy(asc(events.startDate));
    } else if (filters?.isPublished !== undefined) {
      // Only published filter
      eventsQuery = db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          startDate: events.startDate,
          endDate: events.endDate,
          startTime: events.startTime,
          endTime: events.endTime,
          eventType: events.eventType,
          focusAreas: events.focusAreas,
          capacity: events.capacity,
          isPublished: events.isPublished,
          createdAt: events.createdAt,
          createdById: events.createdById,
          // Hub event data
          hubId: hubEvents.hubId,
          hubEventId: hubEvents.id,
        })
        .from(events)
        .innerJoin(hubEvents, eq(events.id, hubEvents.eventId))
        .where(eq(events.isPublished, filters.isPublished))
        .orderBy(asc(events.startDate));
    } else if (filters?.hubId !== undefined) {
      // Only hubId filter
      eventsQuery = db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          startDate: events.startDate,
          endDate: events.endDate,
          startTime: events.startTime,
          endTime: events.endTime,
          eventType: events.eventType,
          focusAreas: events.focusAreas,
          capacity: events.capacity,
          isPublished: events.isPublished,
          createdAt: events.createdAt,
          createdById: events.createdById,
          // Hub event data
          hubId: hubEvents.hubId,
          hubEventId: hubEvents.id,
        })
        .from(events)
        .innerJoin(hubEvents, eq(events.id, hubEvents.eventId))
        .where(eq(hubEvents.hubId, filters.hubId))
        .orderBy(asc(events.startDate));
    } else {
      // No filters
      eventsQuery = db
        .select({
          id: events.id,
          title: events.title,
          description: events.description,
          startDate: events.startDate,
          endDate: events.endDate,
          startTime: events.startTime,
          endTime: events.endTime,
          eventType: events.eventType,
          focusAreas: events.focusAreas,
          capacity: events.capacity,
          isPublished: events.isPublished,
          createdAt: events.createdAt,
          createdById: events.createdById,
          // Hub event data
          hubId: hubEvents.hubId,
          hubEventId: hubEvents.id,
        })
        .from(events)
        .innerJoin(hubEvents, eq(events.id, hubEvents.eventId))
        .orderBy(asc(events.startDate));
    }

    // Execute the query
    const joinedResults = await eventsQuery;

    // Process and map results to Event type
    // In Drizzle join results, table fields are directly accessible
    return joinedResults.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      startDate: row.startDate,
      endDate: row.endDate,
      startTime: row.startTime,
      endTime: row.endTime,
      eventType: row.eventType,
      focusAreas: row.focusAreas,
      capacity: row.capacity,
      isPublished: row.isPublished,
      createdAt: row.createdAt,
      createdById: row.createdById,
    }));
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
    const [hubEvent] = await db
      .select()
      .from(hubEvents)
      .where(eq(hubEvents.id, id));
    return hubEvent || undefined;
  }

  async getHubEventsByEventId(eventId: number): Promise<HubEvent[]> {
    return db.select().from(hubEvents).where(eq(hubEvents.eventId, eventId));
  }

  async getHubEventsByHubId(hubId: number): Promise<HubEvent[]> {
    return db.select().from(hubEvents).where(eq(hubEvents.hubId, hubId));
  }

  // Hub Event Registration methods
  async createHubEventRegistration(
    insertRegistration: InsertHubEventRegistration,
  ): Promise<HubEventRegistration> {
    const [registration] = await db
      .insert(hubEventRegistrations)
      .values(this.safeData(insertRegistration))
      .returning();

    // Process the registration with SendGrid
    await this.processWithSendGrid(registration);

    return registration;
  }

  async getHubEventRegistration(
    id: number,
  ): Promise<HubEventRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hubEventRegistrations)
      .where(eq(hubEventRegistrations.id, id));
    return registration || undefined;
  }

  async getHubEventRegistrationsByHubEventId(
    hubEventId: number,
  ): Promise<HubEventRegistration[]> {
    return db
      .select()
      .from(hubEventRegistrations)
      .where(eq(hubEventRegistrations.hubEventId, hubEventId));
  }

  async getHubEventRegistrationByEmail(
    hubEventId: number,
    email: string,
  ): Promise<HubEventRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hubEventRegistrations)
      .where(
        and(
          eq(hubEventRegistrations.hubEventId, hubEventId),
          eq(hubEventRegistrations.email, email),
        ),
      );
    return registration || undefined;
  }

  // Legacy waitlist methods for backwards compatibility
  async createWaitlistEntry(
    insertEntry: InsertWaitlistEntry,
  ): Promise<WaitlistEntry> {
    // Find or create a default event for the waitlist
    let defaultEvent = await this.getEventByTitle("BuildClub Waitlist");
    if (!defaultEvent) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Convert to YYYY-MM-DD string format

      defaultEvent = await this.createEvent({
        title: "BuildClub Waitlist",
        description: "Default event for BuildClub waitlist entries",
        startDate: formattedDate,
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
    try {
      // Check if waitlist_entry table exists
      const tableExists = await db.execute<{ exists: boolean }>(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'waitlist_entry'
        );
      `);

      if (tableExists.rows[0]?.exists) {
        // Use the waitlist_entry table if it exists
        const entries = await db.select().from(waitlistEntries);
        return entries as unknown as WaitlistEntry[];
      } else {
        // Otherwise, fetch from hub_event_registration with filtering for "waitlist" entries
        // This is a fallback implementation
        const defaultHubEvent = await this.getDefaultWaitlistHubEvent();
        if (!defaultHubEvent) {
          return [];
        }

        const registrations = await db
          .select()
          .from(hubEventRegistrations)
          .where(eq(hubEventRegistrations.hubEventId, defaultHubEvent.id));
        return registrations as unknown as WaitlistEntry[];
      }
    } catch (error) {
      console.error("Error checking or fetching waitlist entries:", error);
      // Return empty array as fallback
      return [];
    }
  }

  async getWaitlistEntryByEmail(
    email: string,
  ): Promise<WaitlistEntry | undefined> {
    try {
      // Check if waitlist_entry table exists
      const tableExists = await db.execute<{ exists: boolean }>(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'waitlist_entry'
        );
      `);

      if (tableExists.rows[0]?.exists) {
        // Use the waitlist_entry table if it exists
        const [entry] = await db
          .select()
          .from(waitlistEntries)
          .where(eq(waitlistEntries.email, email));
        return (entry || undefined) as unknown as WaitlistEntry | undefined;
      } else {
        // Otherwise, fetch from hub_event_registration
        const defaultHubEvent = await this.getDefaultWaitlistHubEvent();
        if (!defaultHubEvent) {
          return undefined;
        }

        const [registration] = await db
          .select()
          .from(hubEventRegistrations)
          .where(
            and(
              eq(hubEventRegistrations.hubEventId, defaultHubEvent.id),
              eq(hubEventRegistrations.email, email),
            ),
          );
        return (registration || undefined) as unknown as
          | WaitlistEntry
          | undefined;
      }
    } catch (error) {
      console.error(
        "Error checking or fetching waitlist entry by email:",
        error,
      );
      return undefined;
    }
  }

  // Helper method to get default hub event for waitlist
  private async getDefaultWaitlistHubEvent(): Promise<HubEvent | undefined> {
    const defaultEvent = await this.getEventByTitle("BuildClub Waitlist");
    if (!defaultEvent) {
      return undefined;
    }

    const hubEvents = await this.getHubEventsByEventId(defaultEvent.id);
    return hubEvents[0] || undefined;
  }

  // Helper methods
  private async getEventByTitle(title: string): Promise<Event | undefined> {
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.title, title));
    return event || undefined;
  }

  private async processWithSendGrid(
    entry: HubEventRegistration | WaitlistEntry,
  ): Promise<void> {
    // Check if SendGrid is properly configured
    const isSendGridConfigured =
      !!process.env.SENDGRID_API_KEY && !!process.env.ADMIN_EMAIL;

    if (!isSendGridConfigured) {
      console.log(
        "SendGrid not fully configured. Skipping email operations but form submission was successful.",
      );
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
          console.log(
            `Admin notification sent for ${entry.email} successfully`,
          );
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
