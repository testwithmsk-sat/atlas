@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PACKAGE_FILE=%SCRIPT_DIR%the-digital-atlas-project-package.json"
set "OUTPUT_DIR=%SCRIPT_DIR%exported-site"

if not exist "%PACKAGE_FILE%" (
  echo Package file not found:
  echo %PACKAGE_FILE%
  echo.
  echo Export the project package from the browser helper first.
  pause
  exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Apply-WebsitePackage.ps1" -PackagePath "%PACKAGE_FILE%" -OutputDir "%OUTPUT_DIR%" -SourceDir "%SCRIPT_DIR%"

echo.
echo Finished. Rebuilt files are in:
echo %OUTPUT_DIR%
pause
