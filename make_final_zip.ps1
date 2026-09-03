$zipPath = "ClaudeMining_FULL_Hostinger.zip"
$deployDir = "deploy_package_temp"

Write-Host "Cleaning up old files..."
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }

Write-Host "Creating deployment structure..."
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 1. Copy Backend Server and Ecosystem
Copy-Item "server.js" -Destination "$deployDir\"
Copy-Item "ecosystem.config.cjs" -Destination "$deployDir\"

# 2. Copy Production .env (we will use the root one or deploy_package_clean one)
Copy-Item "deploy_package_clean\.env.example" -Destination "$deployDir\.env"

# 3. Create Package.json for backend
$packageJson = @"
{
  "name": "claudemining-backend",
  "version": "1.0.0",
  "description": "ClaudeMining Backend & Static Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.3.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.14"
  }
}
"@
Set-Content -Path "$deployDir\package.json" -Value $packageJson

# 4. Copy Landing Page (Marketing) Files from 'web app' directory
Copy-Item "web app\index.html" -Destination "$deployDir\" -Force
Copy-Item "web app\style.css" -Destination "$deployDir\" -Force
Copy-Item "web app\script.js" -Destination "$deployDir\" -Force
if (Test-Path "web app\assets") {
    Copy-Item "web app\assets" -Destination "$deployDir\" -Recurse -Force
}
Copy-Item "public" -Destination "$deployDir\" -Recurse -Force

# 4.1 Copy APK files
if (Test-Path "*.apk") {
    Copy-Item "*.apk" -Destination "$deployDir\"
}

# 5. Copy React SPA App (Built in dist) to 'app'
New-Item -ItemType Directory -Path "$deployDir\app" | Out-Null
Copy-Item "dist\*" -Destination "$deployDir\app\" -Recurse
# Rename react.html to index.html inside the app folder so the backend serves it
if (Test-Path "$deployDir\app\react.html") {
    Rename-Item "$deployDir\app\react.html" "index.html"
}

# 6. Compress into ZIP
Write-Host "Zipping the package..."
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath

Write-Host "Cleanup temp dir..."
Remove-Item $deployDir -Recurse -Force

Write-Host "DONE! ZIP File created: $zipPath"
