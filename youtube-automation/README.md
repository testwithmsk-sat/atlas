# Faceless YouTube Automation System

This is a simple operating system for building a faceless YouTube channel with AI assistance.

It is designed for:
- no filming
- no speaking
- no editing experience
- one beginner-friendly niche
- scalable weekly production

## Goal

Build one YouTube channel around `AI tools for students, creators, and freelancers in India`.

The income model is:
- YouTube ads
- affiliate links
- a small digital product later

Important: a target like `Rs. 1,00,000/month` is possible only after consistent publishing and proven viewer demand. This system is built to give you a realistic, repeatable path instead of fake full-autopilot promises.

## What Is Included

- a 30-day content calendar
- 50 content ideas
- copy-ready AI prompts
- long-video and Shorts templates
- title, thumbnail, and description templates
- an analytics tracker
- PowerShell scripts to create video work folders and keep production organized

## Simple Weekly Workflow

1. Pick `3` long videos and `5` Shorts from `data/content-calendar.csv`.
2. Use `prompts/chatgpt-prompts.md` to generate scripts, titles, and descriptions.
3. Create visuals in Canva or CapCut.
4. Generate optional narration using an AI voice tool.
5. Save every asset in the matching folder under `videos/`.
6. Upload and schedule inside YouTube Studio.
7. Record results in `data/analytics-tracker.csv`.

## Recommended Tool Stack

- ChatGPT for ideas, scripts, SEO, and descriptions
- Canva or CapCut for visuals and editing
- ElevenLabs optional for AI narration
- YouTube Studio for upload and scheduling
- Google Sheets if you want cloud tracking later

## Folder Guide

- `data/`: calendars, ideas, and trackers
- `docs/`: monetization and workflow notes
- `prompts/`: ready-to-use prompts for ChatGPT
- `scripts/`: helper scripts for batch production
- `templates/`: reusable templates for each video
- `videos/`: one folder per video project

## Quick Start

From PowerShell:

```powershell
Set-Location C:\Users\Dell\Documents\Playground\youtube-automation
.\scripts\New-VideoProject.ps1 -Slug free-ai-tools-for-students -VideoType Long
```

That creates a production folder with placeholders for script, assets, thumbnail text, and description.

Then open:
- `prompts/chatgpt-prompts.md`
- `templates/long-video-template.md`
- `templates/shorts-template.md`

## First 30 Days

- Week 1: publish `2` long videos and `5` Shorts
- Week 2: publish `3` long videos and `5` Shorts
- Week 3: repeat what got the best CTR and watch time
- Week 4: improve winners, add affiliate links, and keep publishing

## Monetization Notes

Do not rely only on ads. The strongest path is:

1. grow with Shorts and long videos
2. qualify for YPP
3. add affiliate links
4. add a simple digital product

Read `docs/monetization-roadmap.md` before scaling.
