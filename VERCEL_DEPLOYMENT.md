# VECTIS Energy Calculator - Vercel Deployment Guide

## Overview
This guide walks you through deploying the VECTIS Energy Calculator to Vercel with a Neon PostgreSQL database.

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Neon Database account (free tier available)

## Step 1: Database Setup with Neon

### 1.1 Create Neon Database Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project called "vectis-energy"
4. Select the region closest to your users
5. Note down your connection string (DATABASE_URL)

### 1.2 Set Up Database Schema
1. In your Neon dashboard, go to the SQL Editor
2. Run the following SQL to create your tables:

```sql
-- Create calculations table
CREATE TABLE IF NOT EXISTS calculations (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Abuja',
    cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
    appliances JSONB NOT NULL DEFAULT '[]',
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO calculations (name, location, cost_per_kwh, appliances, customer_name, customer_email, customer_phone) VALUES
(
    'Sample Home Calculation',
    'Abuja',
    225.00,
    '[
        {
            "id": "sample-1",
            "name": "Refrigerator",
            "rating": 150,
            "backupTime": 24.0,
            "units": 1,
            "daysPerWeek": 7,
            "daysPerMonth": 30
        },
        {
            "id": "sample-2",
            "name": "Air Conditioner",
            "rating": 1500,
            "backupTime": 8.0,
            "units": 2,
            "daysPerWeek": 7,
            "daysPerMonth": 30
        }
    ]',
    'John Doe',
    'john@example.com',
    '+234-801-234-5678'
);
```

## Step 2: Prepare Code for Vercel

### 2.1 Project Structure for Vercel
Vercel expects the following structure:
- Frontend files in the root or `public/` folder
- API routes in `api/` folder (serverless functions)
- Build output in `dist/` or `.next/` folder

### 2.2 Required Files
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies and build scripts
- Environment variables setup

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Sign in and click "Add New Project"
4. Import your GitHub repository

### 3.2 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave blank)
- **Build Command**: `npm run build:vercel`
- **Output Directory**: `dist`

### 3.3 Environment Variables
In Vercel dashboard, add these environment variables:
- `DATABASE_URL`: Your Neon database connection string
- `NODE_ENV`: `production`

### 3.4 Domain Configuration
- Vercel will provide a free `.vercel.app` domain
- You can add a custom domain in the project settings

## Step 4: Deployment Commands

### 4.1 Local Testing
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Test locally
vercel dev
```

### 4.2 Manual Deployment
```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## Database Connection Details

### Connection String Format
```
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
```

### Example Neon Connection String
```
DATABASE_URL=postgresql://user:password@ep-cool-cloud-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure SSL mode is enabled
2. **Build Errors**: Check Node.js version compatibility
3. **API Routes**: Verify serverless function limits
4. **Environment Variables**: Confirm all required vars are set

### Performance Optimization
- Enable Vercel Analytics
- Use Vercel Edge Functions for better performance
- Implement proper caching strategies
- Optimize bundle size

## Cost Considerations

### Vercel Free Tier Limits
- 100GB bandwidth per month
- 6,000 serverless function executions per day
- 1 concurrent build

### Neon Free Tier Limits
- 0.5 GB storage
- 1 database
- 1 compute endpoint

## Security Best Practices
- Use environment variables for sensitive data
- Enable CORS properly
- Implement rate limiting
- Use HTTPS only
- Validate all user inputs

## Monitoring and Analytics
- Vercel Analytics for performance tracking
- Database monitoring in Neon dashboard
- Error tracking with Vercel Functions logs