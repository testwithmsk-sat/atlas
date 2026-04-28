import fs from "node:fs";
import path from "node:path";
import { additionalDownloadManifest } from "@/lib/download-manifest";
import { getEditorSourceEntry } from "@/lib/editor-source-manifest";
import { fallbackProducts } from "@/lib/products";

const previewableManifestEntries = additionalDownloadManifest.filter((item) => item?.isPurchasable !== false);
const manifestEntryBySlug = new Map(previewableManifestEntries.map((item) => [item.slug, item]));
const fallbackProductBySlug = new Map(fallbackProducts.map((product) => [product.slug, product]));

function isPdfFile(file) {
  return String(file?.fileType || "").toLowerCase() === "pdf";
}

function formatFallbackLabel(value) {
  return String(value || "Preview")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toPublicUrl(fullPath) {
  const publicRoot = path.join(process.cwd(), "public");
  const relativePath = path.relative(publicRoot, fullPath);

  if (!relativePath || relativePath.startsWith("..")) return "";
  return `/${relativePath.split(path.sep).join("/")}`;
}

function collectPublicPdfPreviewEntries() {
  const previewMap = new Map();
  const downloadsRoot = path.join(process.cwd(), "public", "downloads");

  if (!fs.existsSync(downloadsRoot)) {
    return previewMap;
  }

  const walk = (directoryPath) => {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".pdf") {
        continue;
      }

      const slug = path.basename(entry.name, ".pdf");
      const product = fallbackProductBySlug.get(slug);
      const previews = previewMap.get(slug) || [];

      previews.push({
        label: product?.name || formatFallbackLabel(entry.name),
        publicUrl: toPublicUrl(fullPath),
        fileType: "pdf"
      });

      previewMap.set(slug, previews);
    }
  };

  walk(downloadsRoot);
  return previewMap;
}

const publicPdfPreviewEntries = collectPublicPdfPreviewEntries();

function dedupePreviewSources(sources) {
  const seen = new Set();

  return sources.filter((source) => {
    const key = source.publicUrl || source.storagePath || source.localPath || `${source.label}-${source.fileType}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildManifestPdfSources(entry) {
  return (entry?.files || [])
    .filter(isPdfFile)
    .map((file, index) => ({
      label: entry.name || formatFallbackLabel(file.localPath || file.storagePath || `Preview ${index + 1}`),
      localPath: file.localPath || "",
      storagePath: file.storagePath || "",
      fileType: "pdf"
    }));
}

function buildBundleChildPdfSources(product) {
  if (!product?.isBundle || !Array.isArray(product.bundleContents) || product.bundleContents.length === 0) {
    return [];
  }

  return previewableManifestEntries
    .filter((entry) => entry.isBundle !== true && product.bundleContents.includes(entry.name))
    .flatMap((entry) => buildManifestPdfSources(entry));
}

function buildRawPreviewSources(slug) {
  const product = fallbackProductBySlug.get(slug);
  if (!product) return [];

  const manifestEntry = manifestEntryBySlug.get(slug);
  const publicPdfSources = publicPdfPreviewEntries.get(slug) || [];
  const editorSource = getEditorSourceEntry(slug);
  const previewSources = [];

  if (manifestEntry) {
    const directManifestSources = buildManifestPdfSources(manifestEntry);

    if (product.isBundle) {
      if (directManifestSources.length > 1) {
        previewSources.push(...directManifestSources);
      } else {
        previewSources.push(...buildBundleChildPdfSources(product));
        previewSources.push(...directManifestSources);
      }
    } else {
      previewSources.push(...directManifestSources);
    }
  }

  previewSources.push(...publicPdfSources);

  if (editorSource && isPdfFile(editorSource)) {
    previewSources.push({
      label: product.isBundle ? `${product.name} Sample Preview` : product.name,
      localPath: editorSource.localPath || "",
      storagePath: editorSource.storagePath || "",
      fileType: "pdf"
    });
  }

  return dedupePreviewSources(previewSources);
}

export function getProductPreviewAsset(slug, index = 0) {
  const normalizedIndex = Number.isFinite(Number(index)) ? Number(index) : 0;
  const previewSources = buildRawPreviewSources(slug);
  return previewSources[normalizedIndex] || null;
}

export function getProductPreviewSources(slug) {
  return buildRawPreviewSources(slug).map((source, index) => ({
    id: `${slug}-${index}`,
    label: source.label,
    fileType: source.fileType,
    src: source.publicUrl || `/api/previews/${slug}?index=${index}`
  }));
}
