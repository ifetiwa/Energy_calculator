# VECTIS Energy Calculator - cPanel Deployment Guide

## Prerequisites

Before deploying to cPanel, ensure your hosting provider supports:
- Node.js (version 18 or higher)
- MySQL database
- File manager or SSH access
- Custom environment variables

## Step 1: Database Setup

### 1.1 Create MySQL Database in cPanel
1. Log into your cPanel dashboard
2. Go to "MySQL Databases"
3. Create a new database: `your_cpanel_username_vectis`
4. Create a database user with full permissions
5. Note down the database credentials:
   - Database name
   - Username
   - Password
   - Host (usually localhost)

### 1.2 Import Database Schema
1. Go to phpMyAdmin in cPanel
2. Select your newly created database
3. Go to "Import" tab
4. Upload the `server/mysql-setup.sql` file
5. Execute the import

## Step 2: Prepare Application Files

### 2.1 Build the Application
Run these commands locally to prepare your files:

```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Build the backend
npm run build
```

### 2.2 Files to Upload
Upload these files/folders to your cPanel public_html directory (or subdirectory):

```
dist/                 # Built backend files
client/dist/          # Built frontend files
node_modules/         # Dependencies (if not installing on server)
package.json
package-lock.json
server/mysql-setup.sql
.env                  # Environment variables (create this)
```

## Step 3: Environment Configuration

### 3.1 Create .env File
Create a `.env` file in your root directory:

```env
NODE_ENV=production
DATABASE_URL=mysql://username:password@localhost:3306/database_name
PORT=3000
```

Replace with your actual database credentials from Step 1.1.

### 3.2 cPanel Node.js App Setup
1. Go to "Node.js Apps" in cPanel
2. Create a new Node.js application:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: / (or your subdirectory)
   - Application URL: your-domain.com
   - Application startup file: dist/index.js

## Step 4: Install Dependencies

### 4.1 Using cPanel File Manager
1. Open "Terminal" in cPanel (if available)
2. Navigate to your application directory
3. Run: `npm install --production`

### 4.2 Alternative: Upload node_modules
If terminal access is limited:
1. Run `npm install --production` locally
2. Compress the `node_modules` folder
3. Upload and extract in cPanel File Manager

## Step 5: Configure Application

### 5.1 Update package.json Scripts
Ensure your production start script points to the built files:

```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 5.2 Static File Serving
Your Express server already serves static files from the built frontend.

## Step 6: Domain and SSL Configuration

### 6.1 Domain Setup
- If using main domain: Point to public_html
- If using subdomain: Create subdomain pointing to app directory
- Update DNS if necessary

### 6.2 SSL Certificate
1. Go to "SSL/TLS" in cPanel
2. Install Let's Encrypt certificate (usually free)
3. Enable "Force HTTPS Redirect"

## Step 7: Testing and Monitoring

### 7.1 Test Application
1. Visit your domain/subdomain
2. Test calculator functionality
3. Verify database connections
4. Check all features work correctly

### 7.2 Monitor Logs
- Check cPanel Error Logs
- Monitor Node.js application logs
- Set up error monitoring if needed

## Common Issues and Solutions

### Database Connection Issues
- Verify DATABASE_URL format: `mysql://user:pass@host:port/dbname`
- Check database user permissions
- Ensure database exists and is accessible

### File Permission Issues
- Set appropriate file permissions (755 for directories, 644 for files)
- Ensure Node.js can read all necessary files

### Memory/Resource Limits
- Check cPanel resource usage
- Optimize application if needed
- Consider upgrading hosting plan

### Port Configuration
- Use the port provided by cPanel (usually from process.env.PORT)
- Don't hardcode port numbers

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security patches
- Backup database regularly

### Performance Optimization
- Enable gzip compression
- Use CDN for static assets
- Monitor application performance

## Support

If you encounter issues:
1. Check cPanel error logs
2. Verify all environment variables
3. Test database connection separately
4. Contact your hosting provider for Node.js specific issues

---

**Note**: This guide assumes your cPanel hosting supports Node.js applications. If not available, you may need to:
1. Upgrade to a hosting plan that supports Node.js
2. Consider alternative hosting (VPS, cloud hosting)
3. Use static hosting with external API services