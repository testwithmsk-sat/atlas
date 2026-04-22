@echo off
setlocal

set "SITE=%~dp0index.html"

if not exist "%SITE%" (
  echo Could not find index.html
  pause
  exit /b 1
)

start "" chrome.exe "%SITE%"
