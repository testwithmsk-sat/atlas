import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  navy:    rgb(0.106, 0.165, 0.290),   // #1B2A4A
  gold:    rgb(0.788, 0.659, 0.298),   // #C9A84C
  white:   rgb(1, 1, 1),
  offwhite:rgb(0.973, 0.965, 0.949),   // #F8F6F2
  muted:   rgb(0.38, 0.42, 0.50),
  dark:    rgb(0.12, 0.15, 0.20),
  light:   rgb(0.90, 0.92, 0.95),
  accent:  rgb(0.95, 0.92, 0.85),
};

function clampText(text, maxLen = 80) {
  const s = String(text || "").replace(/[^\x20-\x7E]/g, " ").trim();
  return s.length > maxLen ? s.slice(0, maxLen - 1) + "…" : s;
}

function wrapText(text, maxChars = 72) {
  const words = String(text || "").replace(/[^\x20-\x7E]/g, " ").trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

// ── Branded PDF builder ───────────────────────────────────────────────────────
export async function buildPdfBuffer({ title, summary, deliverables = [], notes = [], callouts = [] }) {
  const pdf = await PDFDocument.create();
  const font     = await pdf.embedFont(StandardFonts.Helvetica);
  const bold     = await pdf.embedFont(StandardFonts.HelveticaBold);
  const oblique  = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const W = 612, H = 792;
  const ML = 52, MR = 52, MT = 56, MB = 56;
  const CW = W - ML - MR;

  function newPage() {
    const p = pdf.addPage([W, H]);
    // Sidebar accent strip
    p.drawRectangle({ x: 0, y: 0, width: 8, height: H, color: C.gold });
    // Top header bar
    p.drawRectangle({ x: 0, y: H - 44, width: W, height: 44, color: C.navy });
    // Brand name in header
    p.drawText("THE DIGITAL ATLAS", { x: ML, y: H - 28, size: 9, font: bold, color: C.gold });
    p.drawText("digitalatlas.co", { x: W - MR - 70, y: H - 28, size: 8, font, color: C.white });
    // Bottom footer
    p.drawRectangle({ x: 0, y: 0, width: W, height: 30, color: C.navy });
    p.drawText("Generated for you by The Digital Atlas  ·  thedigitalatlas.vercel.app", {
      x: ML, y: 10, size: 7.5, font, color: rgb(0.6, 0.65, 0.75)
    });
    return p;
  }

  // ── PAGE 1: Cover ─────────────────────────────────────────────────────────
  let page = newPage();

  // Hero background block
  page.drawRectangle({ x: ML - 4, y: H - 180, width: CW + 8, height: 118, color: C.offwhite });
  page.drawRectangle({ x: ML - 4, y: H - 180, width: 4, height: 118, color: C.gold });

  // Title
  const titleLines = wrapText(clampText(title, 120), 42);
  let ty = H - 90;
  for (const line of titleLines.slice(0, 3)) {
    page.drawText(line, { x: ML + 12, y: ty, size: 22, font: bold, color: C.navy });
    ty -= 30;
  }

  // Label badge
  page.drawRectangle({ x: ML + 12, y: H - 188, width: 110, height: 18, color: C.gold });
  page.drawText("DIGITAL PLANNING GUIDE", { x: ML + 16, y: H - 184, size: 7.5, font: bold, color: C.navy });

  // Summary paragraph
  let cy = H - 220;
  const summaryLines = wrapText(summary, 72);
  page.drawText("About This Guide", { x: ML, y: cy, size: 11, font: bold, color: C.navy });
  cy -= 18;
  page.drawRectangle({ x: ML, y: cy + 2, width: 40, height: 2, color: C.gold });
  cy -= 14;
  for (const line of summaryLines.slice(0, 4)) {
    page.drawText(line, { x: ML, y: cy, size: 10.5, font, color: C.dark });
    cy -= 16;
  }

  // Deliverables box
  cy -= 12;
  page.drawRectangle({ x: ML - 4, y: cy - (deliverables.length * 22) - 16, width: CW + 8, height: (deliverables.length * 22) + 44, color: C.accent });
  page.drawText("What's Inside", { x: ML + 8, y: cy, size: 11, font: bold, color: C.navy });
  cy -= 20;
  for (const item of deliverables.slice(0, 8)) {
    const lines = wrapText(item, 62);
    page.drawRectangle({ x: ML + 8, y: cy - 2, width: 6, height: 6, color: C.gold });
    page.drawText(lines[0] || "", { x: ML + 22, y: cy, size: 10, font, color: C.dark });
    cy -= 20;
    for (const extra of lines.slice(1, 2)) {
      page.drawText(extra, { x: ML + 22, y: cy, size: 10, font, color: C.dark });
      cy -= 18;
    }
  }

  // ── PAGE 2: Planning steps / Why it fits ─────────────────────────────────
  page = newPage();
  cy = H - MT - 44;

  if (notes.length) {
    page.drawText("Why This Direction Fits You", { x: ML, y: cy, size: 14, font: bold, color: C.navy });
    cy -= 8;
    page.drawRectangle({ x: ML, y: cy, width: CW, height: 2, color: C.gold });
    cy -= 20;

    for (const [i, item] of notes.entries()) {
      if (cy < MB + 60) { page = newPage(); cy = H - MT - 44; }
      const lines = wrapText(item, 68);
      // Number circle
      page.drawCircle({ x: ML + 10, y: cy + 4, size: 9, color: C.navy });
      page.drawText(String(i + 1), { x: ML + 7, y: cy + 1, size: 8, font: bold, color: C.white });
      page.drawText(lines[0] || "", { x: ML + 26, y: cy, size: 10.5, font, color: C.dark });
      cy -= 18;
      for (const extra of lines.slice(1)) {
        page.drawText(extra, { x: ML + 26, y: cy, size: 10.5, font, color: C.dark });
        cy -= 16;
      }
      cy -= 8;
    }
    cy -= 16;
  }

  if (callouts.length) {
    if (cy < MB + 120) { page = newPage(); cy = H - MT - 44; }
    page.drawRectangle({ x: ML - 4, y: cy - (callouts.length * 28) - 30, width: CW + 8, height: (callouts.length * 28) + 50, color: C.accent });
    page.drawText("Next Steps to Take Action", { x: ML + 8, y: cy, size: 13, font: bold, color: C.navy });
    cy -= 8;
    page.drawRectangle({ x: ML + 8, y: cy, width: 50, height: 2, color: C.gold });
    cy -= 20;

    for (const [i, item] of callouts.entries()) {
      if (cy < MB + 40) { page = newPage(); cy = H - MT - 44; }
      const lines = wrapText(item, 66);
      page.drawText(`${i + 1}.`, { x: ML + 10, y: cy, size: 10.5, font: bold, color: C.gold });
      page.drawText(lines[0] || "", { x: ML + 28, y: cy, size: 10.5, font, color: C.dark });
      cy -= 18;
      for (const extra of lines.slice(1)) {
        page.drawText(extra, { x: ML + 28, y: cy, size: 10.5, font, color: C.dark });
        cy -= 16;
      }
      cy -= 6;
    }
  }

  // ── Final page: CTA ───────────────────────────────────────────────────────
  page = newPage();
  cy = H - MT - 80;
  page.drawRectangle({ x: ML - 4, y: cy - 60, width: CW + 8, height: 100, color: C.navy });
  page.drawText("Ready for the full editable bundle?", { x: ML + 12, y: cy, size: 14, font: bold, color: C.white });
  cy -= 22;
  page.drawText("Unlock the complete version with printable PDFs, editable DOCX,", { x: ML + 12, y: cy, size: 10, font, color: C.light });
  cy -= 15;
  page.drawText("structured XLSX trackers and more — all tailored to your goal.", { x: ML + 12, y: cy, size: 10, font, color: C.light });
  cy -= 30;
  page.drawRectangle({ x: ML + 12, y: cy - 4, width: 180, height: 26, color: C.gold });
  page.drawText("thedigitalatlas.vercel.app", { x: ML + 22, y: cy + 4, size: 10.5, font: bold, color: C.navy });

  return Buffer.from(await pdf.save());
}

// ── Styled DOCX builder ───────────────────────────────────────────────────────
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function toBuffer(value) { return Buffer.isBuffer(value) ? value : Buffer.from(String(value || ""), "utf8"); }
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

function getDos(d = new Date()) {
  return {
    dosTime: (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | Math.floor(d.getUTCSeconds() / 2),
    dosDate: ((Math.max(1980, d.getUTCFullYear()) - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate()
  };
}

function createZip(entries) {
  const localParts = [], centralParts = [];
  let offset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = toBuffer(entry.data);
    const { dosDate, dosTime } = getDos(entry.date);
    const crc = crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(0, 8); lh.writeUInt16LE(dosTime, 10); lh.writeUInt16LE(dosDate, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(data.length, 18); lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
    localParts.push(lh, name, data);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0, 8); ch.writeUInt16LE(0, 10); ch.writeUInt16LE(dosTime, 12);
    ch.writeUInt16LE(dosDate, 14); ch.writeUInt32LE(crc, 16); ch.writeUInt32LE(data.length, 20);
    ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32); ch.writeUInt16LE(0, 34); ch.writeUInt16LE(0, 36);
    ch.writeUInt16LE(0, 38); ch.writeUInt16LE(0, 40); ch.writeUInt32LE(0x20, 42);
    ch.writeUInt32LE(offset, 42);
    centralParts.push(ch, name);
    offset += 30 + name.length + data.length;
  }
  const central = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(0, 4); eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(central.length, 12); eocd.writeUInt32LE(offset, 16); eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, central, eocd]);
}

function xmlEscape(v) {
  return String(v || "").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim()
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&apos;");
}

function docxPara(text, opts = {}) {
  const sz = opts.size || 22;
  const color = opts.color || "1B2A4A";
  const bold = opts.bold ? "<w:b/><w:bCs/>" : "";
  const shade = opts.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${opts.shade}"/>` : "";
  const spacing = opts.spacing ? `<w:spacing w:before="${opts.before||0}" w:after="${opts.after||120}"/>` : "";
  return `<w:p><w:pPr>${shade}${spacing ? `<w:spacing w:before="${opts.before||0}" w:after="${opts.after||120}"/>` : ""}</w:pPr><w:r><w:rPr>${bold}<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/><w:color w:val="${color}"/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
}

export function buildDocxBuffer({ title, summary, sections = [] }) {
  const body = [
    docxPara(title,   { size: 36, bold: true,  color: "1B2A4A", before: 0,   after: 80  }),
    docxPara(summary, { size: 21, bold: false,  color: "555F6F", before: 0,   after: 200 }),
    ...sections.flatMap(section => [
      docxPara(section.heading, { size: 26, bold: true,  color: "1B2A4A", shade: "F0ECD8", before: 240, after: 80 }),
      ...(section.items || []).map(item =>
        docxPara("• " + item, { size: 21, color: "333A45", before: 0, after: 80 })
      )
    ]),
    docxPara("Generated by The Digital Atlas — thedigitalatlas.vercel.app", { size: 16, color: "AAAAAA", before: 400, after: 0 })
  ].join("");

  return createZip([
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>` },
    { name: "word/document.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>` }
  ]);
}

// ── Styled XLSX builder ───────────────────────────────────────────────────────
function buildWorksheetRows(rows) {
  return rows.map((row, ri) => {
    const cells = row.map((cell, ci) =>
      `<c r="${String.fromCharCode(65 + ci)}${ri + 1}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`
    ).join("");
    return `<row r="${ri + 1}">${cells}</row>`;
  }).join("");
}

export function buildXlsxBuffer({ sheetName = "Plan", rows = [] }) {
  return createZip([
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: "xl/styles.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/><color rgb="FF1B2A4A"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1B2A4A"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0"><alignment horizontal="left"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment wrapText="1"/></xf></cellXfs></styleSheet>` },
    { name: "xl/worksheets/sheet1.xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${buildWorksheetRows(rows)}</sheetData></worksheet>` }
  ]);
}
