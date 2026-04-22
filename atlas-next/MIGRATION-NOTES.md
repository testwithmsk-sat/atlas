# Migration Notes

## Current direction

The business goal is changing from:

- static product pages
- external checkout
- demo account flow

to:

- products managed inside the website
- real cart and checkout
- payment on the website
- customer accounts with download access

## Recommended backend stack

- Next.js
- Supabase Auth
- Supabase Postgres
- Stripe
- storage for digital files

## Immediate implementation targets

1. Add real category filtering to `/shop`
2. Add cart state with React context or server actions
3. Create a product schema and seed data table
4. Replace placeholder account page with auth
5. Replace placeholder checkout page with Stripe
6. Add post-purchase download access

## Files added for this phase

- `.env.example`
- `supabase-schema.sql`
- `lib/catalog.js`
- `lib/supabase-server.js`
- `lib/stripe.js`
- `app/api/checkout/route.js`

## Menu direction

Recommended final menu:

- Shop
- Categories
- Bundles
- Best Sellers
- New Arrivals
- Freebies
- Support
- Account
- Cart
