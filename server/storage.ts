import { type Calculation, type InsertCalculation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCalculation(id: string): Promise<Calculation | undefined>;
  getCalculations(): Promise<Calculation[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  updateCalculation(id: string, calculation: Partial<InsertCalculation>): Promise<Calculation | undefined>;
  deleteCalculation(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private calculations: Map<string, Calculation>;

  constructor() {
    this.calculations = new Map();
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }

  async getCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculations.values());
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = {
      ...insertCalculation,
      id,
      createdAt: new Date().toISOString(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async updateCalculation(id: string, updates: Partial<InsertCalculation>): Promise<Calculation | undefined> {
    const existing = this.calculations.get(id);
    if (!existing) return undefined;
    
    const updated: Calculation = { ...existing, ...updates };
    this.calculations.set(id, updated);
    return updated;
  }

  async deleteCalculation(id: string): Promise<boolean> {
    return this.calculations.delete(id);
  }
}

export const storage = new MemStorage();
