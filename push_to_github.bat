@echo off
SET GIT="C:\Users\ijaz\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe"

echo === Git Init ===
%GIT% init

echo === Set user config ===
%GIT% config user.email "cloudmining72@gmail.com"
%GIT% config user.name "cloudmining72-jpg"

echo === Add remote ===
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/cloudmining72-jpg/cluad.git

echo === Add all files ===
%GIT% add .

echo === Commit ===
%GIT% commit -m "feat: Full project with OTP system, landing page, logo fix - Latest build"

echo === Set branch to main ===
%GIT% branch -M main

echo === Push to GitHub ===
%GIT% push -u origin main --force

echo ===========================
echo DONE - Code pushed to GitHub
echo ===========================
pause
