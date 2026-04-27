import { additionalDownloadManifest } from "@/lib/download-manifest";

const singlePdfEditorEntries = additionalDownloadManifest.filter(
  (item) => item.isPurchasable && !item.isBundle && item.files.length === 1 && item.files[0]?.fileType === "pdf"
);

const editorSourceEntries = new Map(singlePdfEditorEntries.map((item) => [item.slug, item.files[0]]));

export function getEditorSourceEntry(slug) {
  return editorSourceEntries.get(slug) || null;
}
