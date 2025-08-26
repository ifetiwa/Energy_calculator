import mysql from 'mysql2/promise';
import { type Calculation, type InsertCalculation, type Appliance } from "@shared/schema";
import { IStorage } from "./storage";

export class MySQLStorage implements IStorage {
  private connection: mysql.Connection | null = null;

  constructor(private config: mysql.ConnectionOptions) {}

  async connect(): Promise<void> {
    if (!this.connection) {
      this.connection = await mysql.createConnection(this.config);
      await this.initializeTables();
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  private async initializeTables(): Promise<void> {
    if (!this.connection) throw new Error('Not connected to database');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS calculations (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name TEXT NOT NULL,
        location TEXT NOT NULL DEFAULT 'Abuja',
        cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
        appliances JSON NOT NULL DEFAULT (JSON_ARRAY()),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await this.connection.execute(createTableSQL);
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    if (!this.connection) throw new Error('Not connected to database');

    const [rows] = await this.connection.execute(
      'SELECT * FROM calculations WHERE id = ?',
      [id]
    );

    const calculations = rows as any[];
    if (calculations.length === 0) return undefined;

    const calc = calculations[0];
    return {
      id: calc.id,
      name: calc.name,
      location: calc.location,
      costPerKwh: calc.cost_per_kwh.toString(),
      appliances: JSON.parse(calc.appliances || '[]'),
      createdAt: calc.created_at?.toISOString() || null,
    };
  }

  async getCalculations(): Promise<Calculation[]> {
    if (!this.connection) throw new Error('Not connected to database');

    const [rows] = await this.connection.execute('SELECT * FROM calculations ORDER BY created_at DESC');
    const calculations = rows as any[];

    return calculations.map(calc => ({
      id: calc.id,
      name: calc.name,
      location: calc.location,
      costPerKwh: calc.cost_per_kwh.toString(),
      appliances: JSON.parse(calc.appliances || '[]'),
      createdAt: calc.created_at?.toISOString() || null,
    }));
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    if (!this.connection) throw new Error('Not connected to database');

    const id = crypto.randomUUID();
    const appliancesJson = JSON.stringify(insertCalculation.appliances || []);

    await this.connection.execute(
      `INSERT INTO calculations (id, name, location, cost_per_kwh, appliances) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id,
        insertCalculation.name,
        insertCalculation.location || 'Abuja',
        insertCalculation.costPerKwh || 225.00,
        appliancesJson,
      ]
    );

    const created = await this.getCalculation(id);
    if (!created) throw new Error('Failed to create calculation');
    return created;
  }

  async updateCalculation(id: string, updates: Partial<InsertCalculation>): Promise<Calculation | undefined> {
    if (!this.connection) throw new Error('Not connected to database');

    const existing = await this.getCalculation(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.location !== undefined) {
      fields.push('location = ?');
      values.push(updates.location);
    }
    if (updates.costPerKwh !== undefined) {
      fields.push('cost_per_kwh = ?');
      values.push(updates.costPerKwh);
    }
    if (updates.appliances !== undefined) {
      fields.push('appliances = ?');
      values.push(JSON.stringify(updates.appliances));
    }

    if (fields.length === 0) return existing;

    values.push(id);
    await this.connection.execute(
      `UPDATE calculations SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.getCalculation(id);
  }

  async deleteCalculation(id: string): Promise<boolean> {
    if (!this.connection) throw new Error('Not connected to database');

    const [result] = await this.connection.execute(
      'DELETE FROM calculations WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }
}

// Database configuration helper
export function createMySQLConfig(): mysql.ConnectionOptions {
  const url = process.env.DATABASE_URL;
  
  if (url) {
    // Parse DATABASE_URL format: mysql://user:password@host:port/database
    const dbUrl = new URL(url);
    return {
      host: dbUrl.hostname,
      port: parseInt(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), // Remove leading slash
      connectTimeout: 30000,
    };
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vectis_energy',
    connectTimeout: 30000,
  };
}