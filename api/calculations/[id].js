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

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM calculations WHERE id = $1', [id]);
      client.release();

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Calculation not found' });
        return;
      }

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

      res.status(200).json(calculation);
    } 
    else if (req.method === 'PUT') {
      const updates = req.body;
      const fields = [];
      const values = [];
      let valueIndex = 1;

      if (updates.name !== undefined) {
        fields.push(`name = $${valueIndex++}`);
        values.push(updates.name);
      }
      if (updates.location !== undefined) {
        fields.push(`location = $${valueIndex++}`);
        values.push(updates.location);
      }
      if (updates.costPerKwh !== undefined) {
        fields.push(`cost_per_kwh = $${valueIndex++}`);
        values.push(parseFloat(updates.costPerKwh));
      }
      if (updates.appliances !== undefined) {
        fields.push(`appliances = $${valueIndex++}`);
        values.push(JSON.stringify(updates.appliances));
      }
      if (updates.customerName !== undefined) {
        fields.push(`customer_name = $${valueIndex++}`);
        values.push(updates.customerName);
      }
      if (updates.customerEmail !== undefined) {
        fields.push(`customer_email = $${valueIndex++}`);
        values.push(updates.customerEmail);
      }
      if (updates.customerPhone !== undefined) {
        fields.push(`customer_phone = $${valueIndex++}`);
        values.push(updates.customerPhone);
      }

      if (fields.length === 0) {
        res.status(400).json({ error: 'No valid fields to update' });
        return;
      }

      values.push(id);
      const query = `UPDATE calculations SET ${fields.join(', ')} WHERE id = $${valueIndex} RETURNING *`;

      const client = await pool.connect();
      const result = await client.query(query, values);
      client.release();

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Calculation not found' });
        return;
      }

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

      res.status(200).json(calculation);
    } 
    else if (req.method === 'DELETE') {
      const client = await pool.connect();
      const result = await client.query('DELETE FROM calculations WHERE id = $1 RETURNING id', [id]);
      client.release();

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Calculation not found' });
        return;
      }

      res.status(200).json({ success: true, id: result.rows[0].id });
    } 
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}