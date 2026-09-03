$zipPath = "ClaudeMining_Hostinger_Latest.zip"
$deployDir = "deploy_temp_latest"

Write-Host "Cleaning old files..."
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }

Write-Host "Creating deployment structure..."
New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path "$deployDir\app" | Out-Null
New-Item -ItemType Directory -Path "$deployDir\uploads" | Out-Null

# 1. Backend files (server.js with OTP system)
Copy-Item "server.js"           -Destination "$deployDir\" -Force
Copy-Item "ecosystem.config.cjs"-Destination "$deployDir\" -Force
Copy-Item ".env"                -Destination "$deployDir\" -Force
Copy-Item ".htaccess"           -Destination "$deployDir\" -Force
Copy-Item "package.json"        -Destination "$deployDir\" -Force
Write-Host "  -> Backend files copied"

# 2. Latest Landing Page files
Copy-Item "index.html"  -Destination "$deployDir\" -Force
Copy-Item "style.css"   -Destination "$deployDir\" -Force
Copy-Item "script.js"   -Destination "$deployDir\" -Force
Write-Host "  -> Landing page files copied"

# 3. Logo & Image files at ROOT (fixes logo not showing bug)
Copy-Item "claudemining-logo.jpg"   -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "claudex-logo.jpg"        -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "favicon.svg"             -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "app-download-preview.jpg"-Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "datacenter.jpg"          -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Write-Host "  -> Logo & image files copied to root (logo fix applied)"

# 4. APK file (latest bahi-bahi.apk)
if (Test-Path "bahi-bahi.apk") {
    Copy-Item "bahi-bahi.apk" -Destination "$deployDir\" -Force
    Write-Host "  -> bahi-bahi.apk copied"
}

# 5. React app from dist folder -> app/
if (Test-Path "dist") {
    Copy-Item "dist\*" -Destination "$deployDir\app\" -Recurse -Force
    Write-Host "  -> dist (React app) copied to app/"
    if (Test-Path "$deployDir\app\react.html") {
        Rename-Item "$deployDir\app\react.html" "index.html"
        Write-Host "  -> react.html renamed to index.html"
    }
}

# 6. Public folder
if (Test-Path "public") {
    Copy-Item "public" -Destination "$deployDir\" -Recurse -Force
    Write-Host "  -> public/ copied"
}

# 7. Nginx config
if (Test-Path "nginx_sample.conf") {
    Copy-Item "nginx_sample.conf" -Destination "$deployDir\" -Force
}

Write-Host ""
Write-Host "Creating ZIP..."
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force

Write-Host "Cleanup temp dir..."
Remove-Item $deployDir -Recurse -Force

$size = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "============================================"
Write-Host " DONE! ZIP Created: $zipPath"
Write-Host " Size: $size MB"
Write-Host " Location: $(Get-Location)\$zipPath"
Write-Host "============================================"
