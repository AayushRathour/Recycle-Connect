import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";
import { api } from "@shared/routes";
import { z } from "zod";
import { seedDatabase } from "./seed";

// Initialize Gemini
const genAI = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup Authentication
  setupAuth(app);
  
  // Seed Database (async, don't await to not block startup, or await if critical)
  seedDatabase().catch(console.error);

  // Listings
  app.get(api.listings.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const listings = await storage.getListings({ category, search });
    res.json(listings);
  });

  app.get(api.listings.get.path, async (req, res) => {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  });

  app.post(api.listings.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const listingData = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing({
        ...listingData,
        sellerId: req.user!.id,
      });
      res.status(201).json(listing);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.put(api.listings.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const id = Number(req.params.id);
      const existing = await storage.getListing(id);
      if (!existing) return res.status(404).json({ message: "Not found" });
      if (existing.sellerId !== req.user!.id) return res.status(403).json({ message: "Forbidden" });

      const updates = api.listings.update.input.parse(req.body);
      const updated = await storage.updateListing(id, updates);
      res.json(updated);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.listings.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const id = Number(req.params.id);
    const existing = await storage.getListing(id);
    if (!existing) return res.status(404).json({ message: "Not found" });
    if (existing.sellerId !== req.user!.id) return res.status(403).json({ message: "Forbidden" });
    
    await storage.deleteListing(id);
    res.status(204).send();
  });

  // AI Waste Identification
  app.post(api.ai.identify.path, async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) return res.status(400).json({ message: "Image required" });

      // Remove header if present (data:image/jpeg;base64,...)
      const base64Data = image.split(",")[1] || image;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = "Identify the waste material in this image. Return a JSON object with keys: material (string), category (one of: Glass, Plastic, Metal, Paper, Wood, E-waste, Other), confidence (number 0-1), description (short string).";

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg", // Assuming jpeg, but Gemini is flexible
          },
        },
      ]);

      const responseText = result.response.text();
      // Clean up markdown code blocks if present
      const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(jsonStr);

      res.json(data);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to identify waste" });
    }
  });

  // Inquiries
  app.post(api.inquiries.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.inquiries.create.input.parse(req.body);
      const inquiry = await storage.createInquiry({
        ...input,
        buyerId: req.user!.id,
      });
      res.status(201).json(inquiry);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  return httpServer;
}
