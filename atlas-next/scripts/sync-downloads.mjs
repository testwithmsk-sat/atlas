import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const env = loadEnvFile(path.join(root, ".env.local"));

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
];

for (const key of requiredEnv) {
  if (!env[key]) {
    throw new Error(`Missing ${key} in .env.local`);
  }
}

const bucketName = env.SUPABASE_DOWNLOADS_BUCKET || "product-downloads";
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const manifest = [
  {
    slug: "wedding-invitation-template-bundle",
    name: "Wedding Invitation Template Bundle",
    category: "Wedding",
    badge: "Best Seller",
    priceLabel: "$7.50+",
    status: "Digital download",
    summary: "A polished wedding stationery suite with a premium look for couples who want elegant printable details.",
    image: "/products/wedding-invitation-template-bundle.svg",
    highlights: ["Ready-to-style invitation bundle", "Designed for modern printable delivery", "Ideal for a future in-site digital checkout flow"],
    fileName: "wedding-invitation-template-bundle.zip",
    folder: "wedding",
    localPath: path.join(root, "deliverables", "wedding", "wedding-invitation-template-bundle.zip"),
    fileType: "zip",
    contentType: "application/zip"
  },
  {
    slug: "budget-wedding-planner-bundle",
    name: "Budget Wedding Planner Bundle",
    category: "Wedding",
    badge: "Planning Essential",
    priceLabel: "$7.50+",
    status: "Digital download",
    summary: "A wedding planning and budget system designed to help customers organize details and spending clearly.",
    image: "/products/budget-wedding-planner-bundle.svg",
    highlights: ["Budget tracking and planning pages", "Strong candidate for account-based download delivery", "Fits future cart and bundle upsell flows"],
    fileName: "budget-wedding-planner-bundle.zip",
    folder: "planning",
    localPath: path.join(root, "deliverables", "planning", "budget-wedding-planner-bundle.zip"),
    fileType: "zip",
    contentType: "application/zip"
  },
  {
    slug: "wedding-signs-bundle",
    name: "Wedding Signs Bundle",
    category: "Wedding",
    badge: "Ceremony Favorite",
    priceLabel: "$5.99+",
    status: "Digital download",
    summary: "A cohesive wedding signage pack for ceremonies and receptions that need a clear, polished finish.",
    image: "/products/wedding-signs-bundle.svg",
    highlights: ["Event signage collection", "Strong cross-sell for invitation buyers", "Good fit for related-product merchandising"],
    fileName: "wedding-signs-bundle.zip",
    folder: "wedding",
    localPath: path.join(root, "deliverables", "wedding", "wedding-signs-bundle.zip"),
    fileType: "zip",
    contentType: "application/zip"
  },
  {
    slug: "bridal-shower-games-bundle",
    name: "Bridal Shower Games Bundle",
    category: "Wedding",
    badge: "Party Favorite",
    priceLabel: "$4.99+",
    status: "Digital download",
    summary: "An easy party printable bundle for hosts who want polished celebration products with less setup.",
    image: "/products/bridal-shower-games-bundle.svg",
    highlights: ["Party-ready printable product", "Great for category merchandising", "Good starter item for future bundle logic"],
    fileName: "bridal-shower-games-bundle.zip",
    folder: "celebration",
    localPath: path.join(root, "deliverables", "celebration", "bridal-shower-games-bundle.zip"),
    fileType: "zip",
    contentType: "application/zip"
  },
  {
    slug: "budget-bride-plan-classic-invitation",
    name: "Budget Bride Botanical Wedding Suite",
    category: "Wedding",
    badge: "Launch Ready",
    priceLabel: "$12.99",
    status: "Digital download",
    summary: "A botanical wedding suite with invitation, RSVP, details card, save the date, signage, planning sheets, and celebration extras in one coordinated collection.",
    image: "/products/budget-bride-plan-1.png",
    highlights: ["12-page coordinated botanical wedding collection", "Includes stationery, signage, planning, and shower extras", "Delivered as a printable PDF suite"],
    fileName: "budget-bride-botanical-wedding-suite.pdf",
    folder: "wedding",
    localPath: String.raw`D:\New folder\wedding\Budget Bride Plan 1.pdf`,
    fileType: "pdf",
    contentType: "application/pdf"
  },
  {
    slug: "budget-bride-plan-rose-invitation",
    name: "Budget Bride Rose Wedding Suite",
    category: "Wedding",
    badge: "Launch Ready",
    priceLabel: "$12.99",
    status: "Digital download",
    summary: "A romantic rose wedding suite with floral stationery, save the date, signage, planning pages, and party extras for a soft elegant celebration look.",
    image: "/products/budget-bride-plan-2.png",
    highlights: ["12-page coordinated rose-themed wedding collection", "Includes invitation, RSVP, details, signs, and planners", "Great for romantic floral wedding styling"],
    fileName: "budget-bride-rose-wedding-suite.pdf",
    folder: "wedding",
    localPath: String.raw`D:\New folder\wedding\Budget bride plan 2.pdf`,
    fileType: "pdf",
    contentType: "application/pdf"
  },
  {
    slug: "budget-bride-plan-welcome-sign",
    name: "Budget Bride Burgundy Wedding Suite",
    category: "Wedding",
    badge: "Launch Ready",
    priceLabel: "$12.99",
    status: "Digital download",
    summary: "A dramatic burgundy wedding suite with dark romantic stationery, welcome signage, planning pages, and celebration printables.",
    image: "/products/budget-bride-plan-3.png",
    highlights: ["12-page burgundy and gold wedding collection", "Includes signage, stationery, planning, and party extras", "Strong fit for evening or formal wedding themes"],
    fileName: "budget-bride-burgundy-wedding-suite.pdf",
    folder: "wedding",
    localPath: String.raw`D:\New folder\wedding\Budget Bride plan 3.pdf`,
    fileType: "pdf",
    contentType: "application/pdf"
  },
  {
    slug: "budget-events-and-parties-bundle",
    name: "Budget Events & Parties Printable Bundle",
    category: "Events & Parties",
    badge: "Launch Ready",
    priceLabel: "$14.99",
    status: "Digital download",
    summary: "A party printable bundle featuring invitations, games, signage, favor tags, menus, planning sheets, and itineraries.",
    image: "/products/events-parties-bundle-1.png",
    highlights: ["10-page events and parties printable collection", "Includes invites, games, signs, tags, menus, and itineraries", "Great starter bundle for celebrations and party hosts"],
    fileName: "budget-events-and-parties-printable-bundle.pdf",
    folder: "events",
    localPath: String.raw`D:\New folder\Events & Parties\event 1.pdf`,
    fileType: "pdf",
    contentType: "application/pdf"
  },
  {
    slug: "budget-business-starter-template-pack",
    name: "Budget Business Starter Template Pack",
    category: "Business",
    badge: "Launch Ready",
    priceLabel: "$24.99",
    status: "Digital download",
    summary: "A business template pack with invoice, proposal, agreement, welcome guide, brand kit, media kit, content planner, pricing guide, presentation deck, and SOP layouts.",
    image: "/products/business-invoice-template-1.png",
    highlights: ["12-page business starter collection", "Includes client docs, marketing assets, and operations templates", "Strong value-priced pack for service businesses"],
    fileName: "budget-business-starter-template-pack.pdf",
    folder: "business",
    localPath: String.raw`D:\New folder\business\business 1.pdf`,
    fileType: "pdf",
    contentType: "application/pdf"
  }
];

await ensureBucket(bucketName);

for (const item of manifest) {
  const storagePath = `${item.folder}/${item.fileName}`;
  const localPath = item.localPath;

  if (!fs.existsSync(localPath)) {
    throw new Error(`Missing local deliverable: ${localPath}`);
  }

  const productUpsert = await supabase.from("products").upsert(
    {
      slug: item.slug,
      name: item.name,
      category: item.category,
      badge: item.badge,
      price_label: item.priceLabel,
      status: item.status,
      summary: item.summary,
      image: item.image,
      highlights: item.highlights,
      is_active: true
    },
    { onConflict: "slug" }
  );

  if (productUpsert.error) {
    throw new Error(`product upsert failed for ${item.slug}: ${productUpsert.error.message}`);
  }

  const fileBuffer = fs.readFileSync(localPath);
  const uploadResult = await supabase.storage.from(bucketName).upload(storagePath, fileBuffer, {
    upsert: true,
    contentType: item.contentType
  });

  if (uploadResult.error) {
    throw new Error(`Upload failed for ${storagePath}: ${uploadResult.error.message}`);
  }

  const upsertResult = await supabase.from("download_files").upsert(
    {
      product_slug: item.slug,
      file_name: item.fileName,
      file_url: null,
      storage_bucket: bucketName,
      storage_path: storagePath,
      file_type: item.fileType,
      access_mode: "signed",
      sort_order: 0,
      is_active: true
    },
    { onConflict: "product_slug,storage_bucket,storage_path" }
  );

  if (upsertResult.error) {
    throw new Error(`download_files upsert failed for ${item.slug}: ${upsertResult.error.message}`);
  }
}

console.log(`Synced ${manifest.length} download packages to bucket "${bucketName}".`);

function loadEnvFile(filePath) {
  const values = { ...process.env };

  if (!fs.existsSync(filePath)) {
    return values;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

async function ensureBucket(bucketName) {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    throw new Error(`Could not list buckets: ${error.message}`);
  }

  if (buckets?.some((bucket) => bucket.name === bucketName)) {
    return;
  }

  const createResult = await supabase.storage.createBucket(bucketName, {
    public: false,
    fileSizeLimit: "50MB"
  });

  if (createResult.error) {
    throw new Error(`Could not create bucket "${bucketName}": ${createResult.error.message}`);
  }
}
