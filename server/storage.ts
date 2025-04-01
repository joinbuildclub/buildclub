import {
  users,
  type User,
  type InsertUser,
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
  sendEventRegistrationConfirmation,
  sendEventReminder,
  sendRegistrationCancellation,
} from "./sendgrid";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUsers(filters?: { role?: string }): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;

  // Hub methods
  createHub(hub: InsertHub): Promise<Hub>;
  getHub(id: string): Promise<Hub | undefined>;
  getHubByName(name: string): Promise<Hub | undefined>;
  getHubs(): Promise<Hub[]>;

  // Event methods
  createEvent(event: InsertEvent): Promise<Event>;
  getEvent(id: string): Promise<Event | undefined>;
  getEvents(filters?: {
    isPublished?: boolean;
    hubId?: string;
  }): Promise<Event[]>;

  // Hub Event methods
  createHubEvent(hubEvent: InsertHubEvent): Promise<HubEvent>;
  getHubEvent(id: string): Promise<HubEvent | undefined>;
  getHubEventsByEventId(eventId: string): Promise<HubEvent[]>;
  getHubEventsByHubId(hubId: string): Promise<HubEvent[]>;

  // Hub Event Registration methods
  createHubEventRegistration(
    registration: InsertHubEventRegistration,
  ): Promise<HubEventRegistration>;
  getHubEventRegistration(
    id: string,
  ): Promise<HubEventRegistration | undefined>;
  getHubEventRegistrationsByHubEventId(
    hubEventId: string,
  ): Promise<HubEventRegistration[]>;
  getHubEventRegistrationByEmail(
    hubEventId: string,
    email: string,
  ): Promise<HubEventRegistration | undefined>;
  getRegistrationsByUserId(userId: string): Promise<HubEventRegistration[]>;
  getUserEventRegistrations(userId: string): Promise<any[]>;
  updateRegistrationStatus(
    id: string,
    status: "registered" | "confirmed" | "attended" | "cancelled",
  ): Promise<HubEventRegistration>;
  deleteRegistration(id: string): Promise<boolean>;
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
  async getUser(id: string): Promise<User | undefined> {
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

    // If user has an email, process with SendGrid
    if (user.email) {
      await this.processUserWithSendGrid(user);
    }

    return user;
  }

  // Helper method to process users with SendGrid
  private async processUserWithSendGrid(user: User): Promise<void> {
    // Check if SendGrid is properly configured
    const isSendGridConfigured =
      !!process.env.SENDGRID_API_KEY && !!process.env.ADMIN_EMAIL;

    if (!isSendGridConfigured) {
      console.log(
        "SendGrid not fully configured. Skipping email operations for user registration.",
      );
      return;
    }

    try {
      const userEntry = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        interestAreas: user.interests || [],
      };

      // Try to add contact to SendGrid mailing list
      try {
        const contactAdded = await addContactToSendGrid(userEntry as any);
        if (contactAdded) {
          console.log(`User ${user.email} added to SendGrid successfully`);
        }
      } catch (err) {
        console.error("Error adding user to SendGrid:", err);
      }

      // Try to send welcome email to the user
      try {
        const welcomeEmailSent = await sendWelcomeEmail(userEntry as any);
        if (welcomeEmailSent) {
          console.log(`Welcome email sent to user ${user.email} successfully`);
        }
      } catch (err) {
        console.error("Error sending welcome email to user:", err);
      }

      // Try to send notification to admin
      try {
        const adminNotificationSent = await sendAdminNotification(
          userEntry as any,
        );
        if (adminNotificationSent) {
          console.log(
            `Admin notification sent for user ${user.email} successfully`,
          );
        }
      } catch (err) {
        console.error("Error sending admin notification for user:", err);
      }
    } catch (error) {
      console.error("Error in SendGrid processing for user:", error);
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
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

  async getHub(id: string): Promise<Hub | undefined> {
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

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getEvents(filters?: { isPublished?: boolean; hubId?: string }) {
    // Start building the query
    let eventsQuery = db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        startDateTime: events.startDateTime,
        endDateTime: events.endDateTime,
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
      .innerJoin(hubEvents, eq(events.id, hubEvents.eventId));

    // Apply filters
    if (filters?.isPublished !== undefined) {
      eventsQuery = eventsQuery.where(
        eq(events.isPublished, filters.isPublished),
      );
    }

    if (filters?.hubId) {
      eventsQuery = eventsQuery.where(eq(hubEvents.hubId, filters.hubId));
    }

    // Add ordering
    eventsQuery = eventsQuery.orderBy(asc(events.startDateTime));

    // Execute the query
    const joinedResults = await eventsQuery;

    console.log("JOINED_RESULTS", joinedResults);

    // Process and map results to Event type
    const res = joinedResults.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      startDateTime: row.startDateTime || new Date(row.startDate || Date.now()),
      endDateTime:
        row.endDateTime || (row.endDate ? new Date(row.endDate) : null),
      startDate: row.startDate,
      endDate: row.endDate,
      startTime: row.startTime,
      endTime: row.endTime,
      eventType: row.eventType,
      focusAreas: row.focusAreas,
      capacity: row.capacity,
      isPublished: row.isPublished,
      hubId: row.hubId,
      hubEventId: row.hubEventId,
      createdAt: row.createdAt,
      createdById: row.createdById,
    }));

    return res;
  }

  // Hub Event methods
  async createHubEvent(insertHubEvent: InsertHubEvent): Promise<HubEvent> {
    const [hubEvent] = await db
      .insert(hubEvents)
      .values(this.safeData(insertHubEvent))
      .returning();
    return hubEvent;
  }

  async getHubEvent(id: string): Promise<HubEvent | undefined> {
    const [hubEvent] = await db
      .select()
      .from(hubEvents)
      .where(eq(hubEvents.id, id));
    return hubEvent || undefined;
  }

  async getHubEventsByEventId(eventId: string): Promise<HubEvent[]> {
    return db.select().from(hubEvents).where(eq(hubEvents.eventId, eventId));
  }

  async getHubEventsByHubId(hubId: string): Promise<HubEvent[]> {
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
    id: string,
  ): Promise<HubEventRegistration | undefined> {
    const [registration] = await db
      .select()
      .from(hubEventRegistrations)
      .where(eq(hubEventRegistrations.id, id));
    return registration || undefined;
  }

  async getHubEventRegistrationsByHubEventId(
    hubEventId: string,
  ): Promise<HubEventRegistration[]> {
    return db
      .select()
      .from(hubEventRegistrations)
      .where(eq(hubEventRegistrations.hubEventId, hubEventId));
  }

  async getHubEventRegistrationByEmail(
    hubEventId: string,
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

  // Get all registrations for a specific user by user ID
  async getRegistrationsByUserId(
    userId: string,
  ): Promise<HubEventRegistration[]> {
    return db
      .select()
      .from(hubEventRegistrations)
      .where(eq(hubEventRegistrations.userId, userId))
      .orderBy(desc(hubEventRegistrations.createdAt));
  }

  // Get enriched registrations with event and hub details
  async getUserEventRegistrations(userId: string): Promise<any[]> {
    const registrations = await this.getRegistrationsByUserId(userId);

    // If no registrations, return empty array
    if (registrations.length === 0) {
      return [];
    }

    // For each registration, fetch the associated hub event, event, and hub
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (registration) => {
        const hubEvent = await this.getHubEvent(registration.hubEventId);

        if (!hubEvent) {
          return null;
        }

        const event = await this.getEvent(hubEvent.eventId);
        const hub = await this.getHub(hubEvent.hubId);

        if (!event || !hub) {
          return null;
        }

        return {
          registration,
          event,
          hub,
          hubEvent,
        };
      }),
    );

    // Filter out any null values (from failed lookups)
    return enrichedRegistrations.filter(Boolean);
  }

  // Update registration status
  async updateRegistrationStatus(
    id: string,
    status: "registered" | "confirmed" | "attended" | "cancelled",
  ): Promise<HubEventRegistration> {
    const [registration] = await db
      .update(hubEventRegistrations)
      .set({ status })
      .where(eq(hubEventRegistrations.id, id))
      .returning();

    return registration;
  }

  // Delete a registration
  async deleteRegistration(id: string): Promise<boolean> {
    try {
      await db
        .delete(hubEventRegistrations)
        .where(eq(hubEventRegistrations.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting registration:", error);
      return false;
    }
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
    entry: HubEventRegistration,
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

      // Get Hub Event, Event, and Hub info
      const hubEvent = await this.getHubEvent(entry.hubEventId);
      if (!hubEvent) {
        console.error(
          "Hub event not found in processWithSendGrid:",
          entry.hubEventId,
        );
        return;
      }

      const event = await this.getEvent(hubEvent.eventId);
      const hub = await this.getHub(hubEvent.hubId);

      if (!event || !hub) {
        console.error("Event or hub not found in processWithSendGrid");
        return;
      }

      // Send event registration confirmation email
      try {
        const confirmationSent = await sendEventRegistrationConfirmation(
          entry,
          event,
          hub,
        );
        if (confirmationSent) {
          console.log(
            `Event registration confirmation email sent to ${entry.email} successfully`,
          );
        }
      } catch (err) {
        console.error("Error sending event registration confirmation:", err);
      }

      // Try to send notification to admin
      try {
        const adminNotificationSent = await sendAdminNotification(entry);
        if (adminNotificationSent) {
          console.log(
            `Admin notification sent for ${entry.email} event registration successfully`,
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

  // Implement getUsers method to query users with optional role filter
  async getUsers(filters?: { role?: string }): Promise<User[]> {
    // Use SQL literals for flexibility with type checking
    if (filters?.role) {
      // With role filter
      return db
        .execute(
          sql`
        SELECT * FROM "user" 
        WHERE role = ${filters.role}
        ORDER BY "created_at" DESC
      `,
        )
        .then((result) => result.rows as User[]);
    } else {
      // Without filters
      return db
        .execute(
          sql`
        SELECT * FROM "user"
        ORDER BY "created_at" DESC
      `,
        )
        .then((result) => result.rows as User[]);
    }
  }
}

export const storage = new DatabaseStorage();
