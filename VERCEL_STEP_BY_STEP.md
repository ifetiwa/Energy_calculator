# Step-by-Step Vercel Deployment Guide

## Quick Start (5 minutes to deployment)

### Step 1: Create Neon Database (2 minutes)
1. **Go to [neon.tech](https://neon.tech)** and sign up (free account)
2. **Create new project**: Name it "vectis-energy"
3. **Copy your connection string** - it looks like this:
   ```
   postgresql://username:password@ep-xxx-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Run this SQL in Neon's SQL Editor** to create your table:
   ```sql
   CREATE TABLE IF NOT EXISTS calculations (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       name TEXT NOT NULL,
       location TEXT NOT NULL DEFAULT 'Abuja',
       cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
       appliances JSONB NOT NULL DEFAULT '[]',
       customer_name TEXT,
       customer_email TEXT,
       customer_phone TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Step 2: Connect to GitHub (1 minute)
1. **Push your project to GitHub** (create new repository)
2. Make sure all these files are included:
   - `vercel.json` ✓
   - `api/calculations.js` ✓
   - `api/calculations/[id].js` ✓
   - Your React frontend files ✓

### Step 3: Deploy to Vercel (2 minutes)
1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure settings**:
   - Framework Preset: **Vite**
   - Root Directory: **./** (leave blank)
   - Build Command: `npm run build:vercel` or `vite build`
   - Output Directory: **dist**

5. **Add Environment Variable**:
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string from Step 1

6. **Click Deploy** 🚀

## What Happens After Deployment

### Your Live URLs
- **Frontend**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api/calculations`

### Database Connection
- Automatic SSL connection to Neon
- Serverless functions handle all API requests
- Customer data saved to PostgreSQL

### Testing Your Deployment
1. Visit your live URL
2. Fill out the customer information form
3. Add some appliances and calculate energy usage
4. Click "Save Calculation" 
5. Check your Neon dashboard to see the saved data

## Common Issues & Solutions

### Issue: "Database connection failed"
**Solution**: Double-check your DATABASE_URL environment variable in Vercel dashboard

### Issue: "API routes not working"
**Solution**: Verify your `api/` folder structure and ensure files end with `.js`

### Issue: "Build failed"
**Solution**: Make sure `vite build` works locally first

### Issue: "CORS errors"
**Solution**: The API routes include CORS headers - check browser dev tools for specific errors

## Next Steps After Deployment

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS settings as instructed

### Analytics & Monitoring
1. Enable Vercel Analytics in project settings
2. Monitor database usage in Neon dashboard
3. Check function execution logs in Vercel

### Performance Optimization
- Vercel automatically optimizes your deployment
- Database queries run close to users (edge locations)
- Static assets served from global CDN

## Cost Breakdown (Free Tiers)

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ 6,000 serverless function executions/day
- ✅ Custom domains
- ✅ Automatic HTTPS

### Neon Free Tier
- ✅ 0.5GB storage
- ✅ 1 database
- ✅ Automatic backups
- ✅ Connection pooling

**Total cost for most small businesses: $0/month**

## Support

If you run into issues:
1. Check Vercel function logs in your dashboard
2. Check Neon database logs and query performance
3. Verify environment variables are set correctly
4. Test API endpoints directly: `your-domain.vercel.app/api/calculations`

Your energy calculator is now live and professional! 🎉