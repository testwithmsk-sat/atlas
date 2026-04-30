# Wedding Prompt Pack

This package turns the rough draft from `richtext_converted_to_markdown.md` into a clean, reusable prompt system for premium personalized wedding collateral.

It is designed for structured inputs and produces three consistent deliverable types:

- a printable wedding template document,
- a premium product summary,
- and a detailed creative brief.

## Files

- `master-orchestrator-prompt.md` coordinates generation and enforces shared quality rules.
- `wedding-template-prompt.md` produces the printable 3-5 page wedding template.
- `product-summary-prompt.md` produces concise conversion-focused product copy.
- `creative-brief-prompt.md` expands a wedding brief into a design-ready brief.
- `wedding-brief-schema.json` defines the structured input and output contracts.

## Input Contract

Provide a single structured brief object with these fields:

- `couple_names`
- `wedding_date`
- `theme_tagline`
- `wedding_style`
- `color_palette`
- `cultural_influence`
- `venue_location`
- `event_list`
- `timeline`
- `guest_notes`
- `target_audience`
- `tone`
- `special_requests`

These fields are the preferred structure, but partial briefs are valid. When a field is missing, the prompts are designed to preserve placeholders for critical facts and use tasteful defaults for optional details.

## Output Contracts

### `WeddingTemplateDocument`

- `cover_page`
- `event_details`
- `schedule_timeline`
- `guest_notes`
- `design_style_description`

### `WeddingProductSummary`

- `title`
- `emotional_description`
- `key_highlights`
- `deliverables`

### `WeddingCreativeBrief`

- `style`
- `palette`
- `cultural_influence`
- `tone`
- `audience`
- `creative_direction`

## Default Behavior

- Support Indian weddings by default while adapting when another cultural context is explicitly provided.
- Use premium placeholders when critical details are missing instead of inventing names, venues, or ceremony timings.
- Use tasteful neutral defaults for optional fields such as palette or guest notes when they are omitted.
- Keep all outputs elegant, emotionally warm, and suitable for polished PDF presentation.

## Recommended Flow

1. Start with `master-orchestrator-prompt.md`.
2. Pass the structured brief.
3. Ask for one or more output modes: `wedding_template`, `product_summary`, `creative_brief`, or `all`.
4. Use the matching prompt artifact directly when you need only one deliverable.

## Example Input

```json
{
  "couple_names": "Aarav Mehta & Isha Rao",
  "wedding_date": "18 February 2027",
  "theme_tagline": "Where timeless ritual meets modern romance",
  "wedding_style": "modern royal garden wedding",
  "color_palette": "ivory, sindoor red, muted gold, and soft sage",
  "cultural_influence": "North and South Indian fusion",
  "venue_location": "Jaipur, Rajasthan",
  "event_list": [
    "Engagement",
    "Mehendi",
    "Wedding",
    "Reception"
  ],
  "timeline": [
    {
      "event": "Mehendi",
      "date": "16 February 2027",
      "time": "4:00 PM",
      "location": "Courtyard Lawn"
    }
  ],
  "guest_notes": [
    "Traditional attire is warmly encouraged.",
    "Guest arrival requested 30 minutes before ceremony start."
  ],
  "target_audience": "couples seeking a luxury personalized wedding PDF",
  "tone": "luxurious, warm, emotionally refined",
  "special_requests": [
    "Keep wording culturally rich but not overly ornate.",
    "Ensure print readability and balanced section lengths."
  ]
}
```
