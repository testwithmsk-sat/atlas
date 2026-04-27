import path from "node:path";
import { additionalDownloadManifest } from "@/lib/download-manifest";

const singlePdfEditorEntries = additionalDownloadManifest.filter(
  (item) => item.isPurchasable && !item.isBundle && item.files.length === 1 && item.files[0]?.fileType === "pdf"
);

const manualEditorEntries = [
  [
    "editable-wedding-pdf-template-bundle",
    {
      localPath: path.join(
        process.cwd(),
        "public",
        "editor-sources",
        "wedding",
        "editable-wedding-pdf-template-bundle-sample.pdf"
      ),
      storagePath: null,
      fileType: "pdf",
      contentType: "application/pdf"
    }
  ]
];

const editorSourceEntries = new Map([
  ...singlePdfEditorEntries.map((item) => [item.slug, item.files[0]]),
  ...manualEditorEntries
]);

export function getEditorSourceEntry(slug) {
  return editorSourceEntries.get(slug) || null;
}
