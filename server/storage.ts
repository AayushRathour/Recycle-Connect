import { users, listings, inquiries, type User, type InsertUser, type Listing, type InsertListing, type Inquiry, type InsertInquiry } from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, and, or } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Listings
  getListings(filters?: { category?: string; search?: string }): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, updates: Partial<InsertListing>): Promise<Listing>;
  deleteListing(id: number): Promise<void>;

  // Inquiries
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiriesForSeller(sellerId: number): Promise<Inquiry[]>;
  getInquiriesForBuyer(buyerId: number): Promise<Inquiry[]>;
}

export class DatabaseStorage implements IStorage {
  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Listings
  async getListings(filters?: { category?: string; search?: string }): Promise<Listing[]> {
    let conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(listings.category, filters.category));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(listings.title, `%${filters.search}%`),
          ilike(listings.description, `%${filters.search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return db.select()
      .from(listings)
      .where(whereClause)
      .orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async updateListing(id: number, updates: Partial<InsertListing>): Promise<Listing> {
    const [listing] = await db.update(listings)
      .set(updates)
      .where(eq(listings.id, id))
      .returning();
    return listing;
  }

  async deleteListing(id: number): Promise<void> {
    await db.delete(listings).where(eq(listings.id, id));
  }

  // Inquiries
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async getInquiriesForSeller(sellerId: number): Promise<Inquiry[]> {
    return db.select()
      .from(inquiries)
      .where(eq(inquiries.sellerId, sellerId))
      .orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesForBuyer(buyerId: number): Promise<Inquiry[]> {
    return db.select()
      .from(inquiries)
      .where(eq(inquiries.buyerId, buyerId))
      .orderBy(desc(inquiries.createdAt));
  }
}

export const storage = new DatabaseStorage();
