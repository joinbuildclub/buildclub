import { pgTable, text, serial, integer, boolean, timestamp, date, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Define role type with allowed values
export const RoleEnum = z.enum(["admin", "ambassador", "member"]);
export type Role = z.infer<typeof RoleEnum>;

// Define event type enum
export const eventTypeEnum = pgEnum("event_type", ["workshop", "meetup", "hackathon", "conference"]);
export const EventTypeEnum = z.enum(["workshop", "meetup", "hackathon", "conference"]);
export type EventType = z.infer<typeof EventTypeEnum>;

// Define focus areas enum
export const focusAreaEnum = pgEnum("focus_area", ["product", "design", "engineering", "general"]);
export const FocusAreaEnum = z.enum(["product", "design", "engineering", "general"]);
export type FocusArea = z.infer<typeof FocusAreaEnum>;

// Define registration status enum
export const registrationStatusEnum = z.enum(["registered", "confirmed", "attended", "cancelled"]);
export type RegistrationStatus = z.infer<typeof registrationStatusEnum>;

// User table
export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").unique(),
  googleId: text("google_id").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  role: text("role").default("member").$type<Role>(),
  isOnboarded: boolean("is_onboarded").default(false),
  twitterHandle: text("twitter_handle"),
  linkedinUrl: text("linkedin_url"),
  githubUsername: text("github_username"),
  bio: text("bio"),
  interests: text("interests").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hub (physical location) table
export const hubs = pgTable("hub", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Event table
export const events = pgTable("event", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  // Using full timestamp with timezone for proper datetime handling
  startDateTime: timestamp("start_datetime", { withTimezone: true }).notNull(),
  endDateTime: timestamp("end_datetime", { withTimezone: true }),
  // Keep the old fields for backward compatibility during migration
  startDate: date("start_date"),
  endDate: date("end_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  eventType: eventTypeEnum("event_type").notNull(),
  focusAreas: text("focus_areas").array().$type<FocusArea[]>(),
  capacity: integer("capacity"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  createdById: integer("created_by_id").references(() => users.id),
});

// Hub Event junction table for many-to-many relationship
export const hubEvents = pgTable("hub_event", {
  id: serial("id").primaryKey(),
  hubId: integer("hub_id").notNull().references(() => hubs.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  isPrimary: boolean("is_primary").default(false),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  // Ensure an event can only be linked to a hub once
  uniqHubEvent: uniqueIndex("uniq_hub_event_idx").on(t.hubId, t.eventId),
}));

// Hub Event Registration table 
export const hubEventRegistrations = pgTable("hub_event_registration", {
  id: serial("id").primaryKey(),
  hubEventId: integer("hub_event_id").notNull().references(() => hubEvents.id),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  interestAreas: text("interest_areas").array().notNull(),
  aiInterests: text("ai_interests"),
  status: text("status").default("registered").$type<RegistrationStatus>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  // Ensure a user can only register once for a hub event
  uniqEventUser: uniqueIndex("uniq_hubevent_user_idx").on(t.hubEventId, t.email),
}));

// Define relations after all tables are declared
export const usersRelations = relations(users, ({ many }) => ({
  hubEventRegistrations: many(hubEventRegistrations),
  events: many(events, { relationName: "createdEvents" }),
}));

export const hubsRelations = relations(hubs, ({ many }) => ({
  hubEvents: many(hubEvents),
}));

export const eventsRelations = relations(events, ({ many, one }) => ({
  hubEvents: many(hubEvents),
  createdBy: one(users, {
    fields: [events.createdById],
    references: [users.id],
    relationName: "createdEvents",
  }),
}));

export const hubEventsRelations = relations(hubEvents, ({ one, many }) => ({
  hub: one(hubs, {
    fields: [hubEvents.hubId],
    references: [hubs.id],
  }),
  event: one(events, {
    fields: [hubEvents.eventId],
    references: [events.id],
  }),
  registrations: many(hubEventRegistrations),
}));

export const hubEventRegistrationsRelations = relations(hubEventRegistrations, ({ one }) => ({
  hubEvent: one(hubEvents, {
    fields: [hubEventRegistrations.hubEventId],
    references: [hubEvents.id],
  }),
  user: one(users, {
    fields: [hubEventRegistrations.userId],
    references: [users.id],
  }),
}));

// Schemas for insert operations
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  googleId: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  role: true,
  isOnboarded: true,
  twitterHandle: true,
  linkedinUrl: true,
  githubUsername: true,
  bio: true,
  interests: true,
});

export const insertHubSchema = createInsertSchema(hubs).pick({
  name: true,
  description: true,
  city: true,
  state: true,
  country: true,
  address: true,
  latitude: true,
  longitude: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  // New datetime fields
  startDateTime: true,
  endDateTime: true,
  // Legacy fields for backward compatibility
  startDate: true,
  endDate: true,
  startTime: true,
  endTime: true,
  eventType: true,
  focusAreas: true,
  capacity: true,
  isPublished: true,
  createdById: true,
});

export const insertHubEventSchema = createInsertSchema(hubEvents).pick({
  hubId: true,
  eventId: true,
  isPrimary: true,
  capacity: true,
});

export const insertHubEventRegistrationSchema = createInsertSchema(hubEventRegistrations).pick({
  hubEventId: true,
  userId: true,
  firstName: true,
  lastName: true,
  email: true,
  interestAreas: true,
  aiInterests: true,
  status: true,
});

// Types for TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHub = z.infer<typeof insertHubSchema>;
export type Hub = typeof hubs.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertHubEvent = z.infer<typeof insertHubEventSchema>;
export type HubEvent = typeof hubEvents.$inferSelect;

export type InsertHubEventRegistration = z.infer<typeof insertHubEventRegistrationSchema>;
export type HubEventRegistration = typeof hubEventRegistrations.$inferSelect;

// Legacy types for backward compatibility during migration
export type InsertWaitlistEntry = InsertHubEventRegistration;
export type WaitlistEntry = HubEventRegistration;
export type InsertEventRegistration = InsertHubEventRegistration;
export type EventRegistration = HubEventRegistration;
export type Registration = HubEventRegistration;
export type InsertRegistration = InsertHubEventRegistration;

// Legacy schemas for backward compatibility
export const insertWaitlistSchema = insertHubEventRegistrationSchema;
export const insertEventRegistrationSchema = insertHubEventRegistrationSchema;

// The original waitlist entry table for reference before dropping it
export const waitlistEntries = pgTable("waitlist_entry", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  interestAreas: text("interest_areas").array().notNull(),
  aiInterests: text("ai_interests"),
});
