param(
  [Parameter(Mandatory=$true)]
  [string]$SourceFolder
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$Destination = Join-Path $ProjectRoot "public\audio\qaida\qamar"

New-Item -ItemType Directory -Force -Path $Destination | Out-Null

$extensions = @("*.mp3", "*.m4a", "*.ogg", "*.wav", "*.aac")
$audioFiles = @()

foreach ($ext in $extensions) {
  $audioFiles += Get-ChildItem -Path $SourceFolder -Recurse -File -Filter $ext -ErrorAction SilentlyContinue
}

if ($audioFiles.Count -eq 0) {
  Write-Host "No audio files found in: $SourceFolder" -ForegroundColor Red
  exit 1
}

Write-Host "Found $($audioFiles.Count) audio files." -ForegroundColor Green

$index = 1
foreach ($file in $audioFiles) {
  $safeName = ("source-{0:D3}{1}" -f $index, $file.Extension.ToLower())
  Copy-Item $file.FullName (Join-Path $Destination $safeName) -Force
  $index++
}

Write-Host ""
Write-Host "Audio copied to:" -ForegroundColor Cyan
Write-Host $Destination
Write-Host ""
Write-Host "IMPORTANT: Source clips still need semantic mapping/renaming in lib/qaidaAudio.ts."
Write-Host "Keep public\audio\qaida\qamar\ATTRIBUTION.txt with the project."
