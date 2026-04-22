# The Digital Atlas Next.js Rebuild

This folder is the starter app for moving the website from a static storefront to a real ecommerce product.

## What is included

- App Router structure
- shared layout and storefront navigation
- reusable product card component
- central product data file
- category and subcategory taxonomy for expanding the catalog
- starter routes for:
  - `/`
  - `/shop`
  - `/products/[slug]`
  - `/cart`
  - `/account`
  - `/checkout`

## Recommended next build order

1. Copy `.env.example` to `.env.local`
2. Add Supabase and Stripe keys
3. Run the SQL in `supabase-schema.sql`
4. Run `npm run prepare:downloads` to build local ZIP deliverables in `deliverables/`
5. Run `npm run sync:downloads` to create the Storage bucket, upload ZIPs, and upsert `download_files`
6. Run the app with `npm run dev`
7. Review the website-ready categories and starter catalog plan in `/shop`
8. Add Supabase auth users and complete a Stripe test checkout
9. Verify the webhook creates the order plus customer download records automatically and the account page returns signed URLs

## Why this folder exists

The current root site still works as the static public storefront. This app lets you build the full in-site ecommerce version safely without breaking the live pages while the rebuild is in progress.
