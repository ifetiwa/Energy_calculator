import type { Express } from "express";
import { createServer, type Server } from "http";
import { getDatabaseStorage } from "./database";
import { insertCalculationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all calculations
  app.get("/api/calculations", async (req, res) => {
    try {
      const storage = await getDatabaseStorage();
      const calculations = await storage.getCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Get single calculation
  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const storage = await getDatabaseStorage();
      const calculation = await storage.getCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculation" });
    }
  });

  // Create new calculation
  app.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCalculationSchema.parse(req.body);
      const storage = await getDatabaseStorage();
      const calculation = await storage.createCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create calculation" });
    }
  });

  // Update calculation
  app.patch("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCalculationSchema.partial().parse(req.body);
      const storage = await getDatabaseStorage();
      const calculation = await storage.updateCalculation(id, updates);
      
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update calculation" });
    }
  });

  // Delete calculation
  app.delete("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const storage = await getDatabaseStorage();
      const deleted = await storage.deleteCalculation(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete calculation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
