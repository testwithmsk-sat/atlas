$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$packagesRoot = Join-Path $root "download-package-source"
$outputRoot = Join-Path $root "deliverables"

$packages = @(
  @{
    Slug = "wedding-invitation-template-bundle"
    Folder = "wedding"
    Artwork = "public/products/wedding-invitation-template-bundle.svg"
  },
  @{
    Slug = "budget-wedding-planner-bundle"
    Folder = "planning"
    Artwork = "public/products/budget-wedding-planner-bundle.svg"
  },
  @{
    Slug = "wedding-signs-bundle"
    Folder = "wedding"
    Artwork = "public/products/wedding-signs-bundle.svg"
  },
  @{
    Slug = "bridal-shower-games-bundle"
    Folder = "celebration"
    Artwork = "public/products/bridal-shower-games-bundle.svg"
  }
)

New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null

foreach ($package in $packages) {
  $sourceDir = Join-Path $packagesRoot $package.Slug
  $targetDir = Join-Path $outputRoot $package.Folder
  $zipPath = Join-Path $targetDir ("{0}.zip" -f $package.Slug)
  $artworkSource = Join-Path $root $package.Artwork
  $artworkTarget = Join-Path $sourceDir (Split-Path $artworkSource -Leaf)

  if (-not (Test-Path $sourceDir)) {
    throw "Missing package source directory: $sourceDir"
  }

  if (-not (Test-Path $artworkSource)) {
    throw "Missing artwork source: $artworkSource"
  }

  Copy-Item -LiteralPath $artworkSource -Destination $artworkTarget -Force
  New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

  if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
  }

  Compress-Archive -Path (Join-Path $sourceDir "*") -DestinationPath $zipPath -CompressionLevel Optimal
}

Write-Host "Prepared download packages in $outputRoot"
