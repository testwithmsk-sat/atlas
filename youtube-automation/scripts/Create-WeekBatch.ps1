param(
    [Parameter(Mandatory = $true)]
    [int]$Week
)

$root = Split-Path -Parent $PSScriptRoot
$calendarPath = Join-Path $root "data\content-calendar.csv"

if (-not (Test-Path $calendarPath)) {
    throw "Content calendar not found: $calendarPath"
}

$rows = Import-Csv -Path $calendarPath | Where-Object { [int]$_.Week -eq $Week }

if (-not $rows) {
    throw "No rows found for week $Week"
}

foreach ($row in $rows) {
    $slug = ($row.Topic.ToLower() -replace "[^a-z0-9]+", "-").Trim("-")
    $scriptPath = Join-Path $PSScriptRoot "New-VideoProject.ps1"
    & $scriptPath -Slug $slug -VideoType $row.VideoType | Out-Host
}

Write-Output "Created batch for week $Week"
