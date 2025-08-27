import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM calculations ORDER BY created_at DESC');
      client.release();
      
      const calculations = result.rows.map(calc => ({
        id: calc.id,
        name: calc.name,
        location: calc.location,
        costPerKwh: calc.cost_per_kwh.toString(),
        appliances: calc.appliances || [],
        customerName: calc.customer_name,
        customerEmail: calc.customer_email,
        customerPhone: calc.customer_phone,
        createdAt: calc.created_at?.toISOString() || null,
      }));

      res.status(200).json(calculations);
    } 
    else if (req.method === 'POST') {
      const { name, location, costPerKwh, appliances, customerName, customerEmail, customerPhone } = req.body;
      
      const client = await pool.connect();
      const result = await client.query(
        `INSERT INTO calculations (name, location, cost_per_kwh, appliances, customer_name, customer_email, customer_phone) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name,
          location || 'Abuja',
          parseFloat(costPerKwh) || 225.00,
          JSON.stringify(appliances || []),
          customerName || null,
          customerEmail || null,
          customerPhone || null,
        ]
      );
      client.release();

      const calc = result.rows[0];
      const calculation = {
        id: calc.id,
        name: calc.name,
        location: calc.location,
        costPerKwh: calc.cost_per_kwh.toString(),
        appliances: calc.appliances || [],
        customerName: calc.customer_name,
        customerEmail: calc.customer_email,
        customerPhone: calc.customer_phone,
        createdAt: calc.created_at?.toISOString() || null,
      };

      res.status(201).json(calculation);
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}