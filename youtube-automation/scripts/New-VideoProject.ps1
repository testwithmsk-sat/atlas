param(
    [Parameter(Mandatory = $true)]
    [string]$Slug,

    [ValidateSet("Long", "Short")]
    [string]$VideoType = "Long"
)

$root = Split-Path -Parent $PSScriptRoot
$projectPath = Join-Path $root "videos\$Slug"

New-Item -ItemType Directory -Force -Path $projectPath | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $projectPath "assets") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $projectPath "exports") | Out-Null

$readme = @"
# $Slug

Video type: $VideoType

Checklist:
- [ ] title selected
- [ ] script written
- [ ] visuals collected
- [ ] voiceover generated
- [ ] edit completed
- [ ] thumbnail ready
- [ ] description ready
- [ ] uploaded
- [ ] analytics logged
"@

$scriptTemplate = if ($VideoType -eq "Long") {
@"
Hook:

Main sections:
1.
2.
3.
4.
5.

CTA:
"@
} else {
@"
Hook:

Core point:

CTA:
"@
}

$descriptionTemplate = @"
Title:

Description:

Links:
- [Affiliate Link 1]
- [Affiliate Link 2]
"@

$thumbnailTemplate = @"
Option 1:
Option 2:
Option 3:
"@

Set-Content -Path (Join-Path $projectPath "README.md") -Value $readme
Set-Content -Path (Join-Path $projectPath "script.txt") -Value $scriptTemplate
Set-Content -Path (Join-Path $projectPath "description.txt") -Value $descriptionTemplate
Set-Content -Path (Join-Path $projectPath "thumbnail.txt") -Value $thumbnailTemplate

Write-Output "Created project: $projectPath"
