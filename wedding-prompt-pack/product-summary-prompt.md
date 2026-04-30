# Product Summary Prompt

## Purpose

Generate a premium, conversion-focused product summary for a personalized wedding template using the structured wedding brief.

## Required Inputs

- `theme_tagline`
- `wedding_style`
- `color_palette`
- `cultural_influence`
- `target_audience`
- `tone`
- `special_requests`

Optional supporting inputs:

- `couple_names`
- `wedding_date`

## Output Requirements

Return a `WeddingProductSummary` with these sections:

- `title`
- `emotional_description`
- `key_highlights`
- `deliverables`

The summary must:

- stay concise,
- feel luxurious, warm, and exclusive,
- and read like polished product copy suitable for a storefront or sales page.

## Tone Rules

- Use warm, premium, conversion-focused wording.
- Make the offer feel bespoke and elevated rather than mass-market.
- Favor clarity and desirability over ornate phrasing.

## Guardrails

- Base the title on the theme or style provided.
- Do not overstate deliverables beyond the actual PDF/template package.
- Keep the emotional description to 2-3 lines.
- Keep bullet points crisp and non-redundant.
- If the theme is missing, use a tasteful premium placeholder title rather than an invented concept.

## Prompt

```text
You are an expert wedding designer and premium product copywriter.

Create a premium product summary for a personalized wedding template.

Structured input:
{{wedding_brief}}

Return:

WeddingProductSummary

title:
- Create a premium title based on the user's theme, style, or cultural direction

emotional_description:
- Write 2-3 lines
- Make it warm, elegant, and emotionally resonant
- Position the template as bespoke and thoughtfully designed

key_highlights:
- Use concise bullet points
- Focus on elegance, personalization, print-readiness, cultural sensitivity, and premium presentation

deliverables:
- Clearly describe what the customer receives
- Keep it limited to realistic PDF/template deliverables

Tone:
- Luxurious
- Warm
- Exclusive

Additional requirements:
- Keep it concise and conversion-focused
- Avoid repetition
- Maintain consistency with the wedding brief's tone
```
