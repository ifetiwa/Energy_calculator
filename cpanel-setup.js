#!/usr/bin/env node

/**
 * VECTIS Energy Calculator - cPanel Setup Script
 * 
 * This script helps automate the cPanel deployment process by:
 * 1. Building the application for production
 * 2. Creating the necessary directory structure
 * 3. Copying files to the correct locations
 * 4. Generating deployment-ready configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  buildDir: 'cpanel-build',
  requiredFiles: [
    'package.json',
    'package-lock.json',
    '.env.example',
    'server/mysql-setup.sql',
    'DEPLOYMENT.md',
    'cpanel-deployment-checklist.md'
  ],
  buildDirs: [
    'dist',
    'client/dist'
  ]
};

console.log('🚀 VECTIS Energy Calculator - cPanel Deployment Setup\n');

// Step 1: Clean previous build
console.log('1. Cleaning previous build...');
if (fs.existsSync(CONFIG.buildDir)) {
  fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
}
fs.mkdirSync(CONFIG.buildDir, { recursive: true });

// Step 2: Build the application
console.log('2. Building application...');
try {
  console.log('   - Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('   - Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('   ✅ Build completed successfully');
} catch (error) {
  console.error('   ❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Copy essential files
console.log('3. Copying essential files...');
CONFIG.requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const destPath = path.join(CONFIG.buildDir, file);
    const destDir = path.dirname(destPath);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(file, destPath);
    console.log(`   ✅ Copied: ${file}`);
  } else {
    console.log(`   ⚠️  Not found: ${file}`);
  }
});

// Step 4: Copy build directories
console.log('4. Copying build directories...');
CONFIG.buildDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const destPath = path.join(CONFIG.buildDir, dir);
    
    // Create destination directory
    fs.mkdirSync(destPath, { recursive: true });
    
    // Copy contents recursively
    copyDir(dir, destPath);
    console.log(`   ✅ Copied: ${dir}`);
  } else {
    console.log(`   ❌ Build directory not found: ${dir}`);
  }
});

// Step 5: Create production package.json
console.log('5. Creating production package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Keep only production dependencies and essential scripts
const productionPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  type: packageJson.type,
  description: "VECTIS Energy Calculator - Production Build",
  scripts: {
    start: "NODE_ENV=production node dist/index.js",
    "db:setup": "mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME < server/mysql-setup.sql"
  },
  dependencies: packageJson.dependencies,
  engines: {
    node: ">=18.0.0"
  }
};

fs.writeFileSync(
  path.join(CONFIG.buildDir, 'package.json'),
  JSON.stringify(productionPackageJson, null, 2)
);
console.log('   ✅ Production package.json created');

// Step 6: Create .htaccess for cPanel
console.log('6. Creating .htaccess file...');
const htaccessContent = `# VECTIS Energy Calculator - cPanel Configuration

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Node.js app routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /app.js [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;

fs.writeFileSync(path.join(CONFIG.buildDir, '.htaccess'), htaccessContent);
console.log('   ✅ .htaccess created');

// Step 7: Create deployment instructions
console.log('7. Creating deployment instructions...');
const instructions = `# DEPLOYMENT INSTRUCTIONS

## What's in this folder:
- dist/: Built backend application
- client/dist/: Built frontend application  
- package.json: Production dependencies
- .env.example: Environment variables template
- server/mysql-setup.sql: Database schema
- .htaccess: Web server configuration

## Upload to cPanel:
1. Upload all files to your public_html directory (or subdirectory)
2. Create .env file based on .env.example with your database credentials
3. Run: npm install --production
4. Import database schema using phpMyAdmin
5. Configure Node.js app in cPanel to use dist/index.js
6. Test your application

## Database Setup:
mysql -u [username] -p[password] -h [host] [database] < server/mysql-setup.sql

## Environment Variables (.env):
NODE_ENV=production
DATABASE_URL=mysql://username:password@localhost:3306/database_name
PORT=3000

Built on: ${new Date().toISOString()}
Version: ${packageJson.version}
`;

fs.writeFileSync(path.join(CONFIG.buildDir, 'DEPLOY_INSTRUCTIONS.txt'), instructions);
console.log('   ✅ Deployment instructions created');

console.log('\n🎉 cPanel deployment package ready!');
console.log(`📁 Files are in: ${CONFIG.buildDir}/`);
console.log('\nNext steps:');
console.log('1. Zip the contents of cpanel-build/ folder');
console.log('2. Upload to your cPanel File Manager');
console.log('3. Extract in public_html (or subdirectory)');
console.log('4. Follow DEPLOY_INSTRUCTIONS.txt');
console.log('\n📚 See DEPLOYMENT.md for detailed instructions');

// Helper function to copy directory recursively
function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}