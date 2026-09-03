#!/bin/bash
# =====================================================
# ClaudeMining - Hostinger VPS Auto Deploy Script
# Run this ONCE after uploading files to server
# =====================================================

echo "=== ClaudeMining Hostinger Setup ==="

# 1. Install Node.js dependencies
echo "Installing dependencies..."
npm install --production

# 2. Install PM2 globally (keeps server running 24/7)
echo "Installing PM2..."
npm install -g pm2

# 3. Create uploads folder
mkdir -p uploads

# 4. Start server with PM2
echo "Starting server..."
pm2 start ecosystem.config.cjs

# 5. Save PM2 so it auto-starts on reboot
pm2 save
pm2 startup

echo ""
echo "=== DONE! Server is LIVE! ==="
echo "Check status: pm2 status"
echo "View logs:    pm2 logs claudemining"
echo "Restart:      pm2 restart claudemining"
