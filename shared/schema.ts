import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  role: text("role", { enum: ["buyer", "seller"] }).notNull().default("buyer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(), // References users.id (handled in logic/relations)
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Glass, Plastic, etc.
  quantity: decimal("quantity").notNull(),
  unit: text("unit").notNull(), // kg, units, tons
  price: decimal("price").notNull(),
  location: jsonb("location").notNull(), // { lat: number, lng: number, address: string }
  images: text("images").array().notNull(),
  status: text("status", { enum: ["available", "sold"] }).default("available"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, sellerId: true, createdAt: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

// Request/Response Types
export type AuthResponse = User;

export type CreateListingRequest = InsertListing;
export type UpdateListingRequest = Partial<InsertListing>;

export type CreateInquiryRequest = InsertInquiry;

export interface IdentifyWasteResponse {
  material: string;
  category: string;
  confidence: number;
  description: string;
}
