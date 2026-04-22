# Daily Ops Checklist

## Daily

1. Open `data/content-calendar.csv`
2. Check the next unscheduled video
3. Open that video's folder in `videos/`
4. Confirm these files exist:
   - `script.txt`
   - `description.txt`
   - `thumbnail.txt`
   - `title-options.txt`
5. Build or edit the asset pack
6. Export video and thumbnail
7. Upload in YouTube Studio
8. Add playlist and description links
9. Log the upload in `data/analytics-tracker.csv`

## Every 2 Days

1. Review top views after 48 hours
2. Record CTR and average view duration
3. Mark which topic angle worked best

## Every Week

1. Run the next week batch:

```powershell
Set-Location C:\Users\Dell\Documents\Playground\youtube-automation
.\scripts\Create-WeekBatch.ps1 -Week 2
```

2. Fill scripts and titles for that batch
3. Build thumbnails for the 2 best long videos
4. Publish at least:
   - `3` long videos
   - `5` Shorts

## Rule

Do not switch niche in the first 30 days.
