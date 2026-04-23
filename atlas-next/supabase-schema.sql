create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  category text not null,
  category_slug text,
  subcategory text,
  subcategory_slug text,
  badge text,
  price_label text not null,
  status text default 'Digital download',
  product_type text default 'Digital download',
  summary text not null,
  image text,
  highlights jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.product_categories (
  slug text primary key,
  name text not null,
  nav_label text not null,
  description text not null,
  sort_order integer not null default 0
);

create table if not exists public.product_subcategories (
  slug text primary key,
  category_slug text not null references public.product_categories(slug) on delete cascade,
  name text not null,
  description text default '',
  sort_order integer not null default 0
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  stripe_checkout_session_id text unique not null,
  customer_email text not null,
  customer_name text default '',
  amount_total numeric(10, 2) not null default 0,
  currency text not null default 'USD',
  payment_status text not null default 'pending',
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_slug text default '',
  product_name text not null,
  quantity integer not null default 1,
  unit_amount numeric(10, 2) not null default 0,
  line_total numeric(10, 2) not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.download_files (
  id bigint generated always as identity primary key,
  product_slug text not null references public.products(slug) on delete cascade,
  file_name text not null,
  file_url text,
  storage_bucket text,
  storage_path text,
  file_type text default 'download',
  access_mode text default 'signed',
  sort_order integer not null default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique (product_slug, storage_bucket, storage_path),
  unique (product_slug, file_url)
);

create table if not exists public.customer_downloads (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  customer_email text not null,
  product_slug text not null references public.products(slug) on delete cascade,
  download_file_id bigint not null references public.download_files(id) on delete cascade,
  granted_at timestamptz default now(),
  unique (order_id, customer_email, download_file_id)
);

alter table public.download_files alter column file_url drop not null;
alter table public.products add column if not exists category_slug text;
alter table public.products add column if not exists subcategory text;
alter table public.products add column if not exists subcategory_slug text;
alter table public.products add column if not exists product_type text default 'Digital download';
alter table public.download_files add column if not exists storage_bucket text;
alter table public.download_files add column if not exists storage_path text;
alter table public.download_files add column if not exists access_mode text default 'signed';

create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists products_category_slug_idx on public.products(category_slug);
create index if not exists products_subcategory_slug_idx on public.products(subcategory_slug);
create index if not exists download_files_product_slug_idx on public.download_files(product_slug);
create index if not exists customer_downloads_customer_email_idx on public.customer_downloads(customer_email);
create index if not exists customer_downloads_order_id_idx on public.customer_downloads(order_id);

insert into public.product_categories (slug, name, nav_label, description, sort_order)
values
  ('wedding', 'Wedding', 'Wedding', 'Elegant templates and printables for invitations, planning, signage, and celebration extras.', 1),
  ('events-parties', 'Events & Parties', 'Parties', 'Printable invites, games, itineraries, and decor details for birthdays, baby showers, and celebrations.', 2),
  ('business', 'Business', 'Business', 'Templates for client work, branded documents, offers, marketing, and operations.', 3),
  ('planners-productivity', 'Planners & Productivity', 'Planners', 'Trackers, planners, and digital tools for finance, routines, goals, and everyday organization.', 4),
  ('career-education', 'Career & Education', 'Career', 'Resume templates, study planners, classroom resources, and career organization tools.', 5),
  ('social-content', 'Social & Content', 'Content', 'Canva packs, pin templates, content calendars, and digital marketing assets.', 6),
  ('creative-assets', 'Creative Assets', 'Assets', 'SVG bundles, icons, mockups, clipart, presets, and design support assets.', 7),
  ('templates-documents', 'Templates & Documents', 'Templates', 'Editable documents, printable forms, workbooks, checklists, journals, and fillable resources.', 8)
on conflict (slug) do update
set
  name = excluded.name,
  nav_label = excluded.nav_label,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.product_subcategories (slug, category_slug, name, description, sort_order)
values
  ('invitations-stationery', 'wedding', 'Invitations & Stationery', 'Wedding invitation suites, RSVP cards, and matching stationery.', 1),
  ('planning-budget', 'wedding', 'Planning & Budget', 'Wedding planners, budget tools, and timeline kits.', 2),
  ('signs-day-of-details', 'wedding', 'Signs & Day-Of Details', 'Signs, seating charts, table numbers, and day-of details.', 3),
  ('showers-parties', 'wedding', 'Showers & Parties', 'Bridal shower, bachelorette, and wedding celebration printables.', 4),
  ('party-invitations', 'events-parties', 'Party Invitations', 'Invitations and announcement templates for events and parties.', 5),
  ('games-activities', 'events-parties', 'Games & Activities', 'Printable games and activity packs.', 6),
  ('signs-decor', 'events-parties', 'Signs & Decor', 'Party signage, decor, and event styling details.', 7),
  ('client-documents', 'business', 'Client Documents', 'Client guides, invoices, contracts, and proposal templates.', 8),
  ('marketing-sales', 'business', 'Marketing & Sales', 'Lead magnets, launch templates, and promotional assets.', 9),
  ('operations-systems', 'business', 'Operations & Systems', 'SOPs, workflows, and internal system templates.', 10),
  ('finance-budgeting', 'planners-productivity', 'Finance & Budgeting', 'Budget, savings, debt, and expense trackers.', 11),
  ('goal-planning', 'planners-productivity', 'Goal Planning', 'Goal dashboards, daily planners, and routine systems.', 12),
  ('home-family', 'planners-productivity', 'Home & Family', 'Family organizers, home routines, and household printables.', 13),
  ('resume-job-search', 'career-education', 'Resume & Job Search', 'Resume templates, job trackers, and interview prep tools.', 14),
  ('study-school', 'career-education', 'Study & School', 'Student study planners and academic organization tools.', 15),
  ('teacher-resources', 'career-education', 'Teacher Resources', 'Lesson planners and classroom resources.', 16),
  ('social-templates', 'social-content', 'Social Templates', 'Pinterest, Instagram, and social media template packs.', 17),
  ('lead-magnets-workbooks', 'social-content', 'Lead Magnets & Workbooks', 'Ebooks, workbooks, and opt-in assets.', 18),
  ('content-calendars', 'social-content', 'Content Calendars', 'Editorial planning and content workflow systems.', 19),
  ('svg-cut-files', 'creative-assets', 'SVG & Cut Files', 'SVG bundles and cut file assets.', 20),
  ('mockups-brand-assets', 'creative-assets', 'Mockups & Brand Assets', 'Mockups, brand kits, and presentation assets.', 21),
  ('presets-brushes', 'creative-assets', 'Presets & Brushes', 'Presets, brushes, and creative support assets.', 22),
  ('printable-forms', 'templates-documents', 'Printable Forms', 'Forms, trackers, checklists, and fillable documents.', 23),
  ('journals-workbooks', 'templates-documents', 'Journals & Workbooks', 'Guided journals and workbook-style products.', 24),
  ('editable-documents', 'templates-documents', 'Editable Documents', 'Editable digital documents for repeat use.', 25)
on conflict (slug) do update
set
  category_slug = excluded.category_slug,
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.products (slug, name, category, category_slug, subcategory, subcategory_slug, badge, price_label, status, product_type, summary, image, highlights, is_active)
values
  (
    'wedding-invitation-template-bundle',
    'Wedding Invitation Template Bundle',
    'Wedding',
    'wedding',
    'Invitations & Stationery',
    'invitations-stationery',
    'Best Seller',
    '₹649',
    'Digital download',
    'Canva template bundle',
    'A polished wedding stationery suite with a premium look for couples who want elegant printable details.',
    '/products/wedding-invitation-template-bundle.svg',
    '["Ready-to-style invitation bundle", "Designed for modern printable delivery", "Ideal for a future in-site digital checkout flow"]'::jsonb,
    true
  ),
  (
    'budget-wedding-planner-bundle',
    'Budget Wedding Planner Bundle',
    'Wedding',
    'wedding',
    'Planning & Budget',
    'planning-budget',
    'Planning Essential',
    '₹649',
    'Digital download',
    'Printable planner bundle',
    'A wedding planning and budget system designed to help customers organize details and spending clearly.',
    '/products/budget-wedding-planner-bundle.svg',
    '["Budget tracking and planning pages", "Strong candidate for account-based download delivery", "Fits future cart and bundle upsell flows"]'::jsonb,
    true
  ),
  (
    'wedding-signs-bundle',
    'Wedding Signs Bundle',
    'Wedding',
    'wedding',
    'Signs & Day-Of Details',
    'signs-day-of-details',
    'Ceremony Favorite',
    '₹499',
    'Digital download',
    'Printable sign bundle',
    'A cohesive wedding signage pack for ceremonies and receptions that need a clear, polished finish.',
    '/products/wedding-signs-bundle.svg',
    '["Event signage collection", "Strong cross-sell for invitation buyers", "Good fit for related-product merchandising"]'::jsonb,
    true
  ),
  (
    'bridal-shower-games-bundle',
    'Bridal Shower Games Bundle',
    'Wedding',
    'wedding',
    'Showers & Parties',
    'showers-parties',
    'Party Favorite',
    '₹399',
    'Digital download',
    'Printable game bundle',
    'An easy party printable bundle for hosts who want polished celebration products with less setup.',
    '/products/bridal-shower-games-bundle.svg',
    '["Party-ready printable product", "Great for category merchandising", "Good starter item for future bundle logic"]'::jsonb,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  category = excluded.category,
  category_slug = excluded.category_slug,
  subcategory = excluded.subcategory,
  subcategory_slug = excluded.subcategory_slug,
  badge = excluded.badge,
  price_label = excluded.price_label,
  status = excluded.status,
  product_type = excluded.product_type,
  summary = excluded.summary,
  image = excluded.image,
  highlights = excluded.highlights,
  is_active = excluded.is_active;

insert into public.download_files (product_slug, file_name, file_url, storage_bucket, storage_path, file_type, access_mode, sort_order, is_active)
values
  (
    'wedding-invitation-template-bundle',
    'wedding-invitation-template-bundle.zip',
    null,
    'product-downloads',
    'wedding/wedding-invitation-template-bundle.zip',
    'zip',
    'signed',
    0,
    true
  ),
  (
    'budget-wedding-planner-bundle',
    'budget-wedding-planner-bundle.zip',
    null,
    'product-downloads',
    'planning/budget-wedding-planner-bundle.zip',
    'zip',
    'signed',
    0,
    true
  ),
  (
    'wedding-signs-bundle',
    'wedding-signs-bundle.zip',
    null,
    'product-downloads',
    'wedding/wedding-signs-bundle.zip',
    'zip',
    'signed',
    0,
    true
  ),
  (
    'bridal-shower-games-bundle',
    'bridal-shower-games-bundle.zip',
    null,
    'product-downloads',
    'celebration/bridal-shower-games-bundle.zip',
    'zip',
    'signed',
    0,
    true
  )
on conflict (product_slug, storage_bucket, storage_path) do update
set
  file_name = excluded.file_name,
  file_url = excluded.file_url,
  file_type = excluded.file_type,
  access_mode = excluded.access_mode,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
