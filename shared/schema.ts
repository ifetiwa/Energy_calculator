import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, decimal, int, timestamp, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = mysqlTable("calculations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: text("name").notNull(),
  location: text("location").notNull().default("Abuja"),
  costPerKwh: decimal("cost_per_kwh", { precision: 10, scale: 2 }).notNull().default("225.00"),
  appliances: json("appliances").notNull().default("[]"),
  // User contact fields
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
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
