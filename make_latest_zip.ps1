$zipPath = "ClaudeMining_Hostinger_Latest.zip"
$deployDir = "deploy_temp_latest"

Write-Host "Cleaning old files..."
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }

Write-Host "Creating deployment structure..."
New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path "$deployDir\app" | Out-Null
New-Item -ItemType Directory -Path "$deployDir\uploads" | Out-Null

# 1. Backend files
Copy-Item "server.js"            -Destination "$deployDir\" -Force
Copy-Item "ecosystem.config.cjs" -Destination "$deployDir\" -Force
Copy-Item ".env"                 -Destination "$deployDir\" -Force
Copy-Item ".htaccess"            -Destination "$deployDir\" -Force
Copy-Item "package.json"         -Destination "$deployDir\" -Force
Write-Host "  -> Backend files OK"

# 2. Landing Page files (FIXED: APK links corrected)
Copy-Item "index.html" -Destination "$deployDir\" -Force
Copy-Item "style.css"  -Destination "$deployDir\" -Force
Copy-Item "script.js"  -Destination "$deployDir\" -Force
Write-Host "  -> Landing page OK (APK links fixed)"

# 3. Logo & image files at ROOT (logo fix)
Copy-Item "claudemining-logo.jpg"    -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "claudex-logo.jpg"         -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Copy-Item "favicon.svg"              -Destination "$deployDir\" -Force -ErrorAction SilentlyContinue
Write-Host "  -> Logo files at root OK"

# 4. APK - ClaudeMining.apk or bahi-bahi.apk
if (Test-Path "ClaudeMining.apk") {
    Copy-Item "ClaudeMining.apk" -Destination "$deployDir\ClaudeMining.apk" -Force
    $apkSize = [math]::Round((Get-Item "ClaudeMining.apk").Length / 1MB, 1)
    Write-Host "  -> ClaudeMining.apk ($apkSize MB) copied - OK"
} elseif (Test-Path "bahi-bahi.apk") {
    Copy-Item "bahi-bahi.apk" -Destination "$deployDir\ClaudeMining.apk" -Force
    $apkSize = [math]::Round((Get-Item "bahi-bahi.apk").Length / 1MB, 1)
    Write-Host "  -> ClaudeMining.apk ($apkSize MB) from bahi-bahi.apk - OK"
}

# 5. React app dist -> app/
if (Test-Path "dist") {
    Copy-Item "dist\*" -Destination "$deployDir\app\" -Recurse -Force
    if (Test-Path "$deployDir\app\react.html") {
        Rename-Item "$deployDir\app\react.html" "index.html"
        Write-Host "  -> React app copied to app/ folder"
    }
}

# 6. Assets folder (has logo.jpg, mining images etc)
if (Test-Path "assets") {
    Copy-Item "assets" -Destination "$deployDir\" -Recurse -Force
    Write-Host "  -> assets/ folder OK"
}

# 7. Public folder
if (Test-Path "public") {
    Copy-Item "public" -Destination "$deployDir\" -Recurse -Force
    Write-Host "  -> public/ folder OK"
}

# 8. Nginx config
if (Test-Path "nginx_sample.conf") {
    Copy-Item "nginx_sample.conf" -Destination "$deployDir\" -Force
}

Write-Host ""
Write-Host "Creating ZIP..."
Compress-Archive -Path "$deployDir\*" -DestinationPath $zipPath -Force

Write-Host "Cleanup..."
Remove-Item $deployDir -Recurse -Force

$size = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "============================================"
Write-Host " DONE! ZIP: $zipPath ($size MB)"
Write-Host " APK: bahi-bahi.apk -> ClaudeMining.apk"
Write-Host " Fixes: Logo at root + APK links corrected"
Write-Host "============================================"
