# cPanel Deployment Checklist for VECTIS Energy Calculator

## Pre-Deployment Checklist

### ✅ Local Environment
- [ ] Application runs without errors locally
- [ ] All dependencies are in package.json
- [ ] Database connection works with MySQL
- [ ] Build process completes successfully
- [ ] All features tested and working

### ✅ cPanel Requirements
- [ ] Hosting provider supports Node.js
- [ ] MySQL database access available
- [ ] Sufficient storage space (minimum 500MB)
- [ ] Node.js version 18+ supported
- [ ] SSL certificate available

## Database Setup Checklist

### ✅ MySQL Database Creation
- [ ] Database created in cPanel MySQL Databases
- [ ] Database user created with full permissions
- [ ] Database credentials noted down safely
- [ ] Database connection tested

### ✅ Schema Import
- [ ] `mysql-setup.sql` file uploaded to cPanel
- [ ] Schema imported via phpMyAdmin
- [ ] Sample data imported successfully
- [ ] Database tables visible and accessible

## File Upload Checklist

### ✅ Build Files
- [ ] `npm run build` executed successfully
- [ ] `dist/` folder contains built backend
- [ ] `client/dist/` folder contains built frontend
- [ ] All static assets included

### ✅ Essential Files Upload
- [ ] `package.json` and `package-lock.json`
- [ ] `dist/` directory (built backend)
- [ ] `client/dist/` directory (built frontend)
- [ ] `.env` file with production settings
- [ ] `node_modules/` (if not installing on server)

### ✅ Configuration Files
- [ ] `.env` file created with correct database URL
- [ ] Environment variables match cPanel setup
- [ ] File permissions set correctly (755/644)

## cPanel Configuration Checklist

### ✅ Node.js App Setup
- [ ] Node.js App created in cPanel
- [ ] Correct Node.js version selected (18+)
- [ ] Application mode set to "Production"
- [ ] Startup file set to `dist/index.js`
- [ ] Application URL configured correctly

### ✅ Dependencies Installation
- [ ] `npm install --production` completed
- [ ] All dependencies installed successfully
- [ ] No error messages in installation log

### ✅ Domain Configuration
- [ ] Domain/subdomain pointing to correct directory
- [ ] DNS settings updated (if needed)
- [ ] SSL certificate installed and active
- [ ] HTTPS redirect enabled

## Testing Checklist

### ✅ Basic Functionality
- [ ] Application loads without errors
- [ ] Homepage displays correctly
- [ ] Calculator functions work
- [ ] Appliance management works
- [ ] Database operations successful

### ✅ Advanced Features
- [ ] All calculations accurate
- [ ] Export functionality works
- [ ] Responsive design on mobile
- [ ] All buttons and forms functional
- [ ] Error handling working properly

### ✅ Performance Tests
- [ ] Page load times acceptable
- [ ] Database queries respond quickly
- [ ] No console errors in browser
- [ ] Memory usage within limits

## Security Checklist

### ✅ Database Security
- [ ] Database user has minimal required permissions
- [ ] Database password is strong and secure
- [ ] Connection string stored securely in .env
- [ ] No database credentials in code

### ✅ Application Security
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced for all connections
- [ ] Error messages don't expose sensitive info

## Monitoring Checklist

### ✅ Error Monitoring
- [ ] cPanel error logs accessible
- [ ] Application logs being generated
- [ ] Database connection errors monitored
- [ ] Performance metrics tracked

### ✅ Backup Strategy
- [ ] Database backup scheduled
- [ ] Application files backed up
- [ ] Recovery process documented
- [ ] Backup restoration tested

## Post-Deployment Checklist

### ✅ Final Verification
- [ ] All URLs working correctly
- [ ] All features tested in production
- [ ] Performance acceptable
- [ ] SEO meta tags displaying correctly
- [ ] Analytics tracking (if implemented)

### ✅ Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Contact information updated

## Common Issues Resolution

### Database Connection Issues
- [ ] Verify DATABASE_URL format
- [ ] Check database credentials
- [ ] Confirm database exists
- [ ] Test connection from phpMyAdmin

### File Permission Issues
- [ ] Set directories to 755
- [ ] Set files to 644
- [ ] Ensure Node.js can read all files
- [ ] Check cPanel file manager permissions

### Application Startup Issues
- [ ] Verify startup file path
- [ ] Check Node.js version compatibility
- [ ] Review error logs
- [ ] Test locally with production build

### Performance Issues
- [ ] Monitor resource usage in cPanel
- [ ] Check database query performance
- [ ] Optimize static file serving
- [ ] Consider caching strategies

---

**Completion Notes:**
- Date of deployment: ___________
- Version deployed: ___________
- Issues encountered: ___________
- Resolution notes: ___________