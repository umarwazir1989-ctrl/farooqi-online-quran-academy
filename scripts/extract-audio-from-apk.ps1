param(
  [Parameter(Mandatory=$true)]
  [string]$ApkPath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ApkPath)) {
  throw "APK not found: $ApkPath"
}

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Temp = Join-Path $env:TEMP ("fq-qaida-apk-" + [guid]::NewGuid().ToString())
$ZipCopy = Join-Path $Temp "app.zip"
$Extracted = Join-Path $Temp "extracted"

New-Item -ItemType Directory -Force -Path $Temp | Out-Null
Copy-Item $ApkPath $ZipCopy

Expand-Archive -Path $ZipCopy -DestinationPath $Extracted -Force

Write-Host "APK extracted. Searching for audio..." -ForegroundColor Cyan

& (Join-Path $PSScriptRoot "import-qaida-audio.ps1") -SourceFolder $Extracted

Write-Host ""
Write-Host "Finished. Temporary files:" $Temp
