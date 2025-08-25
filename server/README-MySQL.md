# MySQL Database Setup for VECTIS Energy Calculator

This document explains how to set up and use MySQL database with your VECTIS Energy Calculator.

## Database Schema

The application uses a single table called `calculations` with the following structure:

```sql
CREATE TABLE calculations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Abuja',
    cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
    appliances JSON NOT NULL DEFAULT (JSON_ARRAY()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Database Setup

Run the provided SQL setup script:

```bash
mysql -u root -p < server/mysql-setup.sql
```

Or manually execute the commands:

```sql
-- Create database
CREATE DATABASE vectis_energy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE vectis_energy;

-- Run the table creation script (from mysql-setup.sql)
```

### 2. Environment Variables

Set the `DATABASE_URL` environment variable to connect to your MySQL database:

```bash
# Format: mysql://username:password@host:port/database
export DATABASE_URL="mysql://username:password@localhost:3306/vectis_energy"
```

Or use individual environment variables:

```bash
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_USER="your_username"
export DB_PASSWORD="your_password"
export DB_NAME="vectis_energy"
```

### 3. Application Usage

The application will automatically:
- Connect to MySQL if `DATABASE_URL` is set
- Fall back to in-memory storage if no database connection is available
- Create tables if they don't exist

## File Overview

### Core Files

- **`server/mysql-storage.ts`** - MySQL storage implementation using raw mysql2 driver
- **`server/mysql-drizzle.ts`** - Alternative Drizzle ORM implementation (optional)
- **`server/database.ts`** - Database connection manager with fallback logic
- **`server/mysql-setup.sql`** - Database creation and setup script
- **`shared/schema.ts`** - Updated schema for MySQL compatibility

### Key Features

- **JSON Storage**: Appliances are stored as JSON in MySQL for easy querying
- **Auto-fallback**: Automatically falls back to in-memory storage if DB connection fails
- **UUID Support**: Uses MySQL's UUID() function for unique IDs
- **Type Safety**: Full TypeScript support with proper type definitions

### Data Structure

The `appliances` field stores an array of appliance objects as JSON:

```json
[
  {
    "id": "sample-1",
    "name": "Television 50\"",
    "rating": 150,
    "backupTime": 6.0,
    "units": 2,
    "daysPerWeek": 7,
    "daysPerMonth": 30
  }
]
```

## Production Considerations

1. **Security**: Create a dedicated database user with limited permissions
2. **Backup**: Set up regular database backups
3. **Connection Pooling**: Consider using connection pooling for high traffic
4. **Monitoring**: Monitor database performance and connection health

## Troubleshooting

- **Connection Issues**: Check DATABASE_URL format and credentials
- **Permission Errors**: Ensure database user has proper permissions
- **Table Creation**: Verify UUID() function is available in your MySQL version (8.0+)