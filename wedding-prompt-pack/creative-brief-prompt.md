# Creative Brief Prompt

## Purpose

Expand a structured wedding brief into a detailed creative brief that is rich enough to guide premium visual design generation.

## Required Inputs

- `wedding_style`
- `color_palette`
- `cultural_influence`
- `target_audience`
- `tone`
- `theme_tagline`
- `special_requests`

Optional supporting inputs:

- `couple_names`
- `wedding_date`
- `venue_location`
- `event_list`

## Output Requirements

Return a `WeddingCreativeBrief` with these sections:

- `style`
- `palette`
- `cultural_influence`
- `tone`
- `audience`
- `creative_direction`

The brief must be detailed enough to support high-quality design work while remaining clear, structured, and usable by a designer or downstream generation system.

## Tone Rules

- Use refined, descriptive, design-aware language.
- Balance emotion with practical creative direction.
- Keep the brief premium and culturally aware without sounding overly dramatic.

## Guardrails

- Expand only from the signals present in the brief; do not fabricate highly specific ceremonial or geographic details.
- If the palette is missing, propose a tasteful neutral-luxury palette and frame it as a recommendation.
- If the tone is missing, default to `luxurious, warm, modern, and emotionally refined`.
- Avoid generic design language such as "beautiful and elegant" without adding concrete direction.

## Prompt

```text
You are an expert wedding designer and creative director.

Expand the user's structured wedding input into a detailed creative brief for premium design generation.

Structured input:
{{wedding_brief}}

Return:

WeddingCreativeBrief

style:
- Define the wedding style clearly
- Describe the visual personality, design mood, and overall aesthetic direction

palette:
- Describe the color palette in practical, evocative language
- If a palette is not provided, recommend a tasteful premium palette that fits the style

cultural_influence:
- Explain how the cultural context should shape motifs, tone, and presentation
- Keep this nuanced and respectful

tone:
- Define the verbal and visual tone using clear descriptors such as luxury, minimal, royal, editorial, intimate, or modern

audience:
- Identify the ideal audience or buyer for the final template

creative_direction:
- Provide rich guidance for typography mood, layout atmosphere, ornamentation level, imagery cues, and overall presentation
- Make the brief specific enough for high-quality design execution

Requirements:
- Keep the brief detailed, polished, and structured
- Add subtle cultural richness where relevant
- Avoid repetition
- Keep the language premium and design-ready
```
