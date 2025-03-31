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

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email").unique(),
  googleId: text("google_id").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  role: text("role").default("member").$type<Role>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for users
export const usersRelations = relations(users, ({ many }) => ({
  eventRegistrations: many(eventRegistrations),
}));

// Hubs (physical locations) table
export const hubs = pgTable("hubs", {
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

// Relations for hubs
export const hubsRelations = relations(hubs, ({ many }) => ({
  hubEvents: many(hubEvents),
}));

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
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

// Relations for events
export const eventsRelations = relations(events, ({ many, one }) => ({
  hubEvents: many(hubEvents),
  eventRegistrations: many(eventRegistrations),
  createdBy: one(users, {
    fields: [events.createdById],
    references: [users.id],
  }),
}));

// Hub Events junction table for many-to-many relationship
export const hubEvents = pgTable("hub_events", {
  id: serial("id").primaryKey(),
  hubId: integer("hub_id").notNull().references(() => hubs.id),
  eventId: integer("event_id").notNull().references(() => events.id),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  // Ensure an event can only be linked to a hub once
  uniqHubEvent: uniqueIndex("uniq_hub_event_idx").on(t.hubId, t.eventId),
}));

// Relations for hub events
export const hubEventsRelations = relations(hubEvents, ({ one }) => ({
  hub: one(hubs, {
    fields: [hubEvents.hubId],
    references: [hubs.id],
  }),
  event: one(events, {
    fields: [hubEvents.eventId],
    references: [events.id],
  }),
}));

// Event registrations table (renamed from waitlistEntries)
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  interestAreas: text("interest_areas").array().notNull(),
  aiInterests: text("ai_interests"),
  status: text("status").default("registered").$type<"registered" | "confirmed" | "attended" | "cancelled">(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  // Ensure a user can only register once for an event
  uniqEventUser: uniqueIndex("uniq_event_user_idx").on(t.eventId, t.email),
}));

// Relations for event registrations
export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.userId],
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
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).pick({
  eventId: true,
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

export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;

// Legacy types for backward compatibility during migration
export type InsertWaitlistEntry = InsertEventRegistration;
export type WaitlistEntry = EventRegistration;
