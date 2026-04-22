$root = Split-Path -Parent $PSScriptRoot
$calendarPath = Join-Path $root "data\content-calendar.csv"

if (-not (Test-Path $calendarPath)) {
    throw "Content calendar not found: $calendarPath"
}

$rows = Import-Csv -Path $calendarPath

$rows | Format-Table Week, Day, VideoType, Topic, PrimaryAngle -AutoSize
