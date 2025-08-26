# cPanel Deployment Commands Reference

## Quick Commands for Your Deployment

### 1. Build Your Application Locally
```bash
# Build the application (creates dist/ and client/dist/)
npm run build

# Verify build completed successfully
ls -la dist/
ls -la client/dist/
```

### 2. Create Deployment Package (Optional)
```bash
# Run the cPanel setup script to organize files
node cpanel-setup.js

# This creates a cpanel-build/ folder with all deployment files
zip -r vectis-deployment.zip cpanel-build/
```

### 3. cPanel Database Setup Commands

#### Via cPanel MySQL Databases:
1. Create database: `[username]_vectis`
2. Create user with full permissions
3. Note down credentials

#### Via phpMyAdmin SQL:
```sql
-- Create database
CREATE DATABASE cpanel_username_vectis;
USE cpanel_username_vectis;

-- Import schema (copy-paste from server/mysql-setup.sql)
-- Or use Import tab to upload mysql-setup.sql file
```

### 4. Environment Variables (.env file)
```bash
# Create .env file in your app root
NODE_ENV=production
DATABASE_URL=mysql://db_user:db_password@localhost:3306/db_name
PORT=3000
```

### 5. cPanel File Upload Structure
```
public_html/ (or your subdirectory)
├── .env                    # Your environment variables
├── .htaccess              # Web server config (optional)
├── package.json           # Dependencies
├── package-lock.json      # Lock file
├── dist/                  # Built backend
│   └── index.js
├── client/
│   └── dist/              # Built frontend
│       ├── index.html
│       ├── assets/
│       └── ...
└── server/
    └── mysql-setup.sql    # Database schema
```

### 6. cPanel Terminal Commands
```bash
# Navigate to your app directory
cd public_html

# Install production dependencies
npm install --production

# Verify Node.js app startup
node dist/index.js
```

### 7. cPanel Node.js App Configuration
- **Application Root**: `/public_html` (or your app directory)
- **Application URL**: `yourdomain.com`
- **Application Startup File**: `dist/index.js`
- **Node.js Version**: 18.x or higher
- **Application Mode**: Production

### 8. Testing Commands
```bash
# Test database connection (if you have shell access)
mysql -u your_user -p -h localhost your_database -e "SHOW TABLES;"

# Check application logs
tail -f logs/app.log  # (if logging is configured)

# Test HTTP endpoints
curl https://yourdomain.com/api/health  # (if health endpoint exists)
```

### 9. Troubleshooting Commands
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# Verify package installation
npm list --depth=0

# Check file permissions
ls -la

# Test database connection
node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_db'
}).then(() => console.log('DB Connected!')).catch(console.error);
"
```

### 10. Maintenance Commands
```bash
# Update dependencies (periodically)
npm update

# Backup database
mysqldump -u user -p database_name > backup.sql

# Check disk usage
du -sh *

# Monitor processes (if available)
ps aux | grep node
```

## File Upload Checklist

### Essential Files (Must Upload):
- [ ] `dist/index.js` - Main application file
- [ ] `client/dist/` - Frontend assets  
- [ ] `package.json` - Dependencies
- [ ] `package-lock.json` - Lock file
- [ ] `.env` - Environment variables
- [ ] `server/mysql-setup.sql` - Database schema

### Optional Files:
- [ ] `.htaccess` - Web server configuration
- [ ] `DEPLOYMENT.md` - Documentation
- [ ] `node_modules/` - If not installing on server

## Database Setup SQL Commands

```sql
-- Full database setup
CREATE DATABASE IF NOT EXISTS cpanel_username_vectis 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cpanel_username_vectis;

CREATE TABLE IF NOT EXISTS calculations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'Abuja',
    cost_per_kwh DECIMAL(10,2) NOT NULL DEFAULT 225.00,
    appliances JSON NOT NULL DEFAULT (JSON_ARRAY()),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test the setup
SELECT 'Database setup complete!' as status;
SHOW TABLES;
```

## Success Verification

### Application Working Signs:
- [ ] Homepage loads without errors
- [ ] Calculator interface displays correctly
- [ ] Can add/edit/delete appliances
- [ ] Calculations display accurate results
- [ ] No JavaScript errors in browser console
- [ ] Database operations work (if you save calculations)

### Common Success URLs:
- `https://yourdomain.com/` - Main application
- `https://yourdomain.com/api/calculations` - API endpoint (should return JSON)

Remember: Replace `yourdomain.com`, database credentials, and paths with your actual values!