import fs from "node:fs";
import path from "node:path";
import { additionalDownloadManifest } from "../lib/download-manifest.js";

const root = process.cwd();
const outputPath = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, "tmp", "product-preview-manifest.json");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(additionalDownloadManifest, null, 2));

console.log(`Exported ${additionalDownloadManifest.length} preview manifest entries to ${outputPath}`);
