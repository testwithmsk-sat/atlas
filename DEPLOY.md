# Deploy The Digital Atlas On Netlify

This project is now prepared specifically for a static Netlify launch.

## What is ready already

- Static multi-page storefront
- Product detail pages positioned for internal website product routes
- Netlify-ready contact and freebie forms
- Policy pages, `404.html`, `robots.txt`, `sitemap.xml`, and `site.webmanifest`
- Netlify config in `netlify.toml`

## Recommended Netlify flow

1. Sign in to Netlify.
2. Choose `Add new site` -> `Deploy manually`.
3. Upload the full contents of this folder.
4. After deploy, rename the site to something brand-friendly such as `the-digital-atlas.netlify.app`.

## Files that must be included

- all `.html` files
- `styles.css`
- `app.js`
- `netlify.toml`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- both logo `.svg` files

## Important Netlify checks after first deploy

1. Open `Forms` in the Netlify dashboard.
2. Confirm these forms were detected:
   - `contact-support`
   - `freebie-signup`
   - `homepage-freebie-signup`
3. Submit each public form once on the live site and confirm entries appear in Netlify Forms.

## Live pages to test after deploy

- `/index.html`
- `/shop.html`
- `/bundles.html`
- `/free-resources.html`
- `/contact.html`
- `/privacy.html`
- `/terms.html`
- `/refund-policy.html`
- `/license.html`
- one product page such as `/wedding-invitation-template-bundle.html`

## What is live-ready vs preview-only

Live-ready now:
- storefront pages
- policy pages
- FAQ/contact/freebie flow
- storefront copy and product links now point toward website-native shopping
- Netlify form capture

Preview-only for now:
- `login.html`
- `dashboard.html`

Those two pages are intentionally informational previews, not real customer-auth pages.

## Recommended next integrations after deploy

1. Connect a real email platform for freebie delivery.
2. Add analytics such as Google Analytics or Meta Pixel.
3. Add your real support email and brand business details.
4. Replace the rules-based chat assistant with a real OpenAI-backed chatbot later if needed.

## Final note

This is a strong storefront foundation for moving into a native website catalog.
Use the Next.js app in `atlas-next` for the real add-to-cart, payment, downloads, and account flow.
