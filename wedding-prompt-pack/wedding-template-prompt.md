# Wedding Template Prompt

## Purpose

Generate a complete, beautifully structured wedding template for print-ready PDF layout using a structured wedding brief.

## Required Inputs

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
- `tone`
- `special_requests`

## Output Requirements

Return a `WeddingTemplateDocument` with these sections:

- `cover_page`
- `event_details`
- `schedule_timeline`
- `guest_notes`
- `design_style_description`

The document must:

- feel elegant, modern, and emotionally engaging,
- remain suitable for a polished 3-5 page PDF,
- use balanced sections and clean headings,
- include Engagement, Mehendi, Wedding, and Reception when those events are provided,
- and remain readable for print without dense blocks of text.

## Tone Rules

- Use premium wording with emotional warmth and composure.
- Add subtle cultural richness when relevant to the brief.
- Keep the language elevated but never theatrical or repetitive.
- Make every section feel intentionally curated rather than automatically generated.

## Guardrails

- Do not invent logistics such as event times or venues if they were not supplied.
- Use placeholders for missing critical facts:
  `[Couple Names]`, `[Wedding Date]`, `[Theme Tagline]`, `[Venue Location]`.
- If event details are sparse, keep descriptions graceful and concise rather than padded.
- Avoid repeating the same emotional phrasing from one event section to the next.
- Keep guest notes practical, polished, and easy to scan.

## Prompt

```text
You are an expert wedding designer and document creator.

Create a complete, beautifully structured wedding template based on the user's structured input.

Structured input:
{{wedding_brief}}

Style requirements:
- Elegant, modern, and emotionally engaging
- Suitable for Indian weddings by default, while adapting to the specified cultural context
- Use premium wording, never generic phrases
- Keep it printable as a high-quality PDF

Required output:

WeddingTemplateDocument

cover_page:
- Couple names
- Wedding date
- Theme tagline
- A refined opening line that feels memorable and editorial

event_details:
- Include sections for the events provided in `event_list`
- Prioritize Engagement, Mehendi, Wedding, and Reception when present
- Give each event a concise, premium description suitable for a wedding document

schedule_timeline:
- Present the timeline in a clean, readable sequence
- Preserve only the facts provided
- If timings or locations are missing, keep the structure graceful without inventing them

guest_notes:
- Present guest instructions or etiquette notes in a polished and welcoming tone
- Keep them concise and easy to scan

design_style_description:
- Describe the recommended color palette, typography mood, and overall visual direction
- Make the design guidance feel premium and useful for PDF layout or downstream design work

Enhancements:
- Make the language emotional and premium
- Ensure consistency in tone
- Add subtle cultural richness where appropriate
- Improve readability for print
- Remove repetition

Formatting:
- Clean headings
- Balanced spacing
- Structured sections
- Visually balanced text blocks
- Keep total content suitable for a 3-5 page PDF
```
