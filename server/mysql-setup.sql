-- VECTIS Energy Calculator - MySQL Database Setup
-- Run this script to create the database and tables

-- Create database (run this as root user)
CREATE DATABASE IF NOT EXISTS vectis_energy 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE vectis_energy;

-- Create calculations table
CREATE TABLE IF NOT EXISTS calculations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Abuja',
    cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
    appliances JSON NOT NULL DEFAULT (JSON_ARRAY()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_calculations_created_at ON calculations(created_at);
CREATE INDEX idx_calculations_location ON calculations(location);

-- Insert sample calculation data
INSERT INTO calculations (name, location, cost_per_kwh, appliances) VALUES 
(
    'Sample Household Calculation',
    'Abuja',
    225.00,
    JSON_ARRAY(
        JSON_OBJECT(
            'id', 'sample-1',
            'name', 'Television 50"',
            'rating', 150,
            'backupTime', 6.0,
            'units', 2,
            'daysPerWeek', 7,
            'daysPerMonth', 30
        ),
        JSON_OBJECT(
            'id', 'sample-2',
            'name', '1.5Hp Air Conditioner',
            'rating', 1200,
            'backupTime', 6.0,
            'units', 1,
            'daysPerWeek', 7,
            'daysPerMonth', 30
        ),
        JSON_OBJECT(
            'id', 'sample-3',
            'name', 'Laptop',
            'rating', 90,
            'backupTime', 6.0,
            'units', 1,
            'daysPerWeek', 7,
            'daysPerMonth', 30
        )
    )
);

-- Create user for the application (replace 'your_password' with a secure password)
-- CREATE USER IF NOT EXISTS 'vectis_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON vectis_energy.* TO 'vectis_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show the created table structure
DESCRIBE calculations;

-- Show sample data
SELECT 
    id,
    name,
    location,
    cost_per_kwh,
    JSON_LENGTH(appliances) as appliance_count,
    created_at
FROM calculations;