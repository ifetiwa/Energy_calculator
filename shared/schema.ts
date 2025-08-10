import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull().default("Abuja"),
  costPerKwh: real("cost_per_kwh").notNull().default(225.00),
  appliances: text("appliances").array().notNull().default([]),
  createdAt: text("created_at").default(sql`now()`),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

// Appliance data structure
export const applianceSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(), // watts
  backupTime: z.number().default(6.0), // hours
  units: z.number().default(1),
  daysPerWeek: z.number().default(7),
  daysPerMonth: z.number().default(30),
});

export type Appliance = z.infer<typeof applianceSchema>;

// Calculation result schema
export const calculationResultSchema = z.object({
  dailyConsumption: z.number(),
  weeklyConsumption: z.number(),
  monthlyConsumption: z.number(),
  monthlyCost: z.number(),
});

export type CalculationResult = z.infer<typeof calculationResultSchema>;
