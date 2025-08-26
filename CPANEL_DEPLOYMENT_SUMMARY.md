# VECTIS Energy Calculator - cPanel Deployment Summary

## Quick Deployment Steps

### 1. **Prepare Your Application**
```bash
# Build your application locally
npm run build

# This creates:
# - dist/ (backend files)
# - client/dist/ (frontend files)
```

### 2. **Setup cPanel Database**
- Create MySQL database in cPanel
- Note credentials: username, password, database name
- Import `server/mysql-setup.sql` via phpMyAdmin

### 3. **Upload Files to cPanel**
Upload these files to your public_html directory:
- `dist/` folder (entire directory)
- `client/dist/` folder (entire directory)  
- `package.json`
- `package-lock.json`
- Create `.env` file (see example below)

### 4. **Environment Configuration**
Create `.env` file in your root directory:
```env
NODE_ENV=production
DATABASE_URL=mysql://your_db_user:your_password@localhost:3306/your_database
PORT=3000
```

### 5. **cPanel Node.js Setup**
1. Go to "Node.js Apps" in cPanel
2. Create new application:
   - **Version**: 18.x or higher
   - **Mode**: Production
   - **Startup file**: `dist/index.js`
   - **Root directory**: `/` (or your app subdirectory)

### 6. **Install Dependencies**
In cPanel Terminal (or upload node_modules):
```bash
npm install --production
```

### 7. **Test Your Application**
- Visit your domain
- Check all calculator features work
- Verify database operations

## Database Schema Import

Run this in phpMyAdmin SQL tab or cPanel MySQL:
```sql
-- Use your database
USE your_database_name;

-- Import the schema (copy contents from server/mysql-setup.sql)
-- This creates the calculations table and sample data
```

## Troubleshooting Common Issues

### Database Connection Failed
- Check DATABASE_URL format: `mysql://user:pass@host:3306/dbname`
- Verify database exists and user has permissions
- Test connection in phpMyAdmin

### Application Won't Start
- Check Node.js app startup file is `dist/index.js`
- Verify all files uploaded correctly
- Check cPanel error logs
- Ensure Node.js version is 18+

### Static Files Not Loading
- Confirm `client/dist/` folder uploaded
- Check file permissions (755 for directories, 644 for files)
- Verify Express is serving static files correctly

### Port Issues
- Use `process.env.PORT` (cPanel assigns this)
- Don't hardcode port 5000 in production
- Check cPanel Node.js app configuration

## File Structure After Upload

```
public_html/ (or your app directory)
├── dist/
│   └── index.js (your built backend)
├── client/
│   └── dist/ (your built frontend)
├── package.json
├── package-lock.json
├── .env (your environment variables)
└── node_modules/ (after npm install)
```

## Essential Environment Variables

```env
# Required
NODE_ENV=production
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# Optional (for individual DB config)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# Server
PORT=3000
```

## Security Checklist

- ✅ Use strong database passwords
- ✅ Enable HTTPS/SSL certificate
- ✅ Set proper file permissions
- ✅ Don't expose .env file publicly
- ✅ Use latest Node.js version
- ✅ Keep dependencies updated

## Performance Tips

- Enable gzip compression in cPanel
- Use cPanel's built-in caching if available
- Monitor resource usage
- Consider CDN for static assets
- Optimize database queries

## Backup Strategy

- **Database**: Use cPanel MySQL backup tools
- **Files**: Download application files regularly
- **Environment**: Keep .env backup securely
- **Test restoration**: Verify backups work

## Next Steps After Deployment

1. **Monitor**: Check cPanel logs regularly
2. **Update**: Keep dependencies current
3. **Scale**: Monitor resource usage
4. **Secure**: Regular security updates
5. **Backup**: Implement backup routine

## Getting Help

- **cPanel Issues**: Contact your hosting provider
- **Application Issues**: Check error logs first
- **Database Issues**: Use phpMyAdmin for testing
- **Node.js Issues**: Verify version compatibility

---

**Success Indicators:**
- Application loads without errors
- Calculator functions work correctly
- Database operations complete successfully
- All appliance management features functional
- Export features working
- Responsive design displays properly

**Built for cPanel deployment:** ${new Date().toISOString()}