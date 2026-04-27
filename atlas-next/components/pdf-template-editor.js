"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function getInitialValues(template) {
  return template.fields.reduce((accumulator, field) => {
    accumulator[field.id] = field.defaultValue || "";
    return accumulator;
  }, {});
}

function wrapText(text, maxLength = 46) {
  const normalized = String(text || "").trim();
  if (!normalized) return [""];

  const words = normalized.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (nextLine.length > maxLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function slugifyFileName(value) {
  return String(value || "download")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function downloadBytes(bytes, fileName) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function drawTextBlock(page, font, text, x, y, options = {}) {
  const {
    size = 12,
    color = rgb(0.18, 0.15, 0.14),
    maxLength = 44,
    lineGap = 16
  } = options;

  const lines = wrapText(text, maxLength);
  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * lineGap,
      size,
      font,
      color
    });
  });

  return lines.length * lineGap;
}

async function exportTemplatePdf({ product, template, values }) {
  const pdfDoc = await PDFDocument.create();
  const invitationPage = template.kind === "invitation";
  const menuPage = template.kind === "menu";
  const page = pdfDoc.addPage(invitationPage ? [396, 612] : menuPage ? [300, 720] : [595, 842]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const palette = {
    text: rgb(0.16, 0.14, 0.14),
    muted: rgb(0.42, 0.35, 0.34),
    accent: rgb(0.69, 0.52, 0.35),
    paper: rgb(0.986, 0.972, 0.952)
  };

  const { width, height } = page.getSize();
  page.drawRectangle({ x: 0, y: 0, width, height, color: palette.paper });
  page.drawRectangle({ x: 28, y: height - 46, width: width - 56, height: 1, color: rgb(0.9, 0.84, 0.78) });

  if (template.kind === "invitation") {
    page.drawText(values.headline || product.name, {
      x: 54,
      y: height - 150,
      size: 30,
      font: bold,
      color: palette.text
    });
    drawTextBlock(page, regular, values.subheadline, 54, height - 190, { size: 14, color: palette.accent, maxLength: 28 });
    drawTextBlock(page, regular, values.date, 54, height - 250, { size: 16, maxLength: 28 });
    drawTextBlock(page, regular, values.venue, 54, height - 290, { size: 16, maxLength: 28 });
    drawTextBlock(page, regular, values.details, 54, height - 350, { size: 13, color: palette.muted, maxLength: 34, lineGap: 18 });
    drawTextBlock(page, regular, values.footer, 54, 92, { size: 12, color: palette.accent, maxLength: 34 });
  } else if (template.kind === "menu") {
    page.drawText(values.headline || product.name, {
      x: 34,
      y: height - 90,
      size: 22,
      font: bold,
      color: palette.text
    });
    drawTextBlock(page, regular, values.subheadline, 34, height - 120, { size: 12, color: palette.accent, maxLength: 22 });

    const menuLines = [values.line1, values.line2, values.line3, values.line4];
    menuLines.forEach((line, index) => {
      page.drawRectangle({
        x: 34,
        y: height - 200 - index * 92,
        width: width - 68,
        height: 1,
        color: rgb(0.91, 0.86, 0.81)
      });
      drawTextBlock(page, regular, line, 34, height - 182 - index * 92, { size: 13, maxLength: 22, lineGap: 18 });
    });

    drawTextBlock(page, regular, values.footer, 34, 72, { size: 11, color: palette.muted, maxLength: 24 });
  } else if (template.kind === "program") {
    page.drawText(values.headline || product.name, {
      x: 52,
      y: height - 96,
      size: 28,
      font: bold,
      color: palette.text
    });
    drawTextBlock(page, regular, values.subheadline, 52, height - 132, { size: 13, color: palette.accent, maxLength: 32 });

    const items = [values.line1, values.line2, values.line3, values.line4];
    items.forEach((line, index) => {
      page.drawCircle({
        x: 60,
        y: height - 208 - index * 84,
        size: 4,
        color: palette.accent
      });
      drawTextBlock(page, regular, line, 80, height - 200 - index * 84, { size: 16, maxLength: 42, lineGap: 20 });
    });

    drawTextBlock(page, regular, values.footer, 52, 86, { size: 12, color: palette.muted, maxLength: 42 });
  } else if (template.kind === "checklist") {
    page.drawText(values.headline || product.name, {
      x: 48,
      y: height - 92,
      size: 26,
      font: bold,
      color: palette.text
    });
    drawTextBlock(page, regular, values.subheadline, 48, height - 124, { size: 13, color: palette.muted, maxLength: 58, lineGap: 18 });

    const tasks = [values.line1, values.line2, values.line3, values.line4, values.line5];
    tasks.forEach((line, index) => {
      page.drawRectangle({
        x: 50,
        y: height - 198 - index * 88,
        width: 18,
        height: 18,
        borderColor: palette.accent,
        borderWidth: 1.5
      });
      drawTextBlock(page, regular, line, 84, height - 184 - index * 88, { size: 15, maxLength: 48, lineGap: 18 });
    });

    page.drawRectangle({
      x: 48,
      y: 92,
      width: width - 96,
      height: 110,
      color: rgb(0.973, 0.955, 0.933)
    });
    drawTextBlock(page, regular, values.footer, 62, 180, { size: 12, color: palette.muted, maxLength: 62, lineGap: 16 });
  } else {
    page.drawText(values.headline || product.name, {
      x: 48,
      y: height - 92,
      size: 26,
      font: bold,
      color: palette.text
    });
    drawTextBlock(page, regular, values.subheadline, 48, height - 128, { size: 13, color: palette.accent, maxLength: 58 });
    drawTextBlock(page, regular, values.line1, 48, height - 220, { size: 15, maxLength: 62, lineGap: 20 });
    drawTextBlock(page, regular, values.line2, 48, height - 340, { size: 15, maxLength: 62, lineGap: 20 });
    drawTextBlock(page, regular, values.footer, 48, 96, { size: 12, color: palette.muted, maxLength: 58 });
  }

  page.drawText("Personalized with The Digital Atlas Editor", {
    x: 48,
    y: 40,
    size: 9,
    font: regular,
    color: rgb(0.55, 0.5, 0.49)
  });

  return pdfDoc.save();
}

function PreviewField({ label, value }) {
  return (
    <div className="editor-preview-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function PdfTemplateEditor({ product, template, canExport, hasAccount, supportMessage }) {
  const [values, setValues] = useState(() => getInitialValues(template));
  const [status, setStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const previewValues = useDeferredValue(values);

  const updateValue = (fieldId, nextValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldId]: nextValue
    }));
  };

  const resetValues = () => {
    setValues(getInitialValues(template));
    setStatus("Editor fields reset to the original starter values.");
  };

  const handleExport = async () => {
    if (!canExport) {
      setStatus(supportMessage);
      return;
    }

    setIsExporting(true);
    setStatus("");

    try {
      const bytes = await exportTemplatePdf({ product, template, values });
      downloadBytes(bytes, `${slugifyFileName(product.slug)}-${template.exportSuffix}.pdf`);
      setStatus("Your personalized PDF export is ready.");
    } catch {
      setStatus("The PDF export could not be created. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const checklistLines = [previewValues.line1, previewValues.line2, previewValues.line3, previewValues.line4, previewValues.line5].filter(Boolean);
  const genericLines = [previewValues.line1, previewValues.line2].filter(Boolean);

  return (
    <div className="editor-shell">
      <aside className="editor-sidebar">
        <div className="editor-sidebar-card">
          <p className="eyebrow">Online Editor</p>
          <h2>{product.name}</h2>
          <p>
            Personalize this template inside the website, preview the result live, and export a fresh PDF after the
            product has been purchased.
          </p>
          <div className="editor-meta-list">
            {template.previewFacts.map((fact) => (
              <span className="catalog-chip" key={fact}>
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="editor-sidebar-card">
          <p className="eyebrow">Field Controls</p>
          <div className="editor-form-grid">
            {template.fields.map((field) => (
              <label className="editor-field" key={field.id}>
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea
                    rows={field.id === "footer" ? 3 : 4}
                    value={values[field.id]}
                    placeholder={field.placeholder}
                    onChange={(event) => updateValue(field.id, event.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.id]}
                    placeholder={field.placeholder}
                    onChange={(event) => updateValue(field.id, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="editor-actions">
            <button className="button button-primary" type="button" onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Creating PDF..." : canExport ? "Export Personalized PDF" : "Unlock Export After Purchase"}
            </button>
            <button className="button button-secondary" type="button" onClick={resetValues}>
              Reset Fields
            </button>
          </div>
          <p className={`editor-status ${canExport ? "editor-status--ready" : ""}`}>{status || supportMessage}</p>
        </div>

        <div className="editor-sidebar-card">
          <p className="eyebrow">How It Works</p>
          <ul className="feature-list">
            {template.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div className="editor-cta-links">
            <Link className="text-link" href={`/products/${product.slug}`}>
              View product details
            </Link>
            {!hasAccount ? (
              <Link className="text-link" href="/account">
                Sign in to unlock purchase-linked exports
              </Link>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="editor-stage">
        <div className={`editor-preview-card editor-preview-card--${template.kind}`}>
          {!canExport ? <div className="editor-lock-banner">Preview mode only until purchase is complete</div> : null}

          <div className="editor-preview-page">
            <div className="editor-preview-header">
              <p>{previewValues.subheadline}</p>
              <h3>{previewValues.headline}</h3>
            </div>

            {template.kind === "invitation" ? (
              <div className="editor-preview-layout">
                <PreviewField label="Date & time" value={previewValues.date} />
                <PreviewField label="Venue" value={previewValues.venue} />
                <p className="editor-preview-note">{previewValues.details}</p>
                <strong className="editor-preview-footer">{previewValues.footer}</strong>
              </div>
            ) : null}

            {template.kind === "menu" ? (
              <div className="editor-preview-layout editor-preview-layout--stacked">
                {[previewValues.line1, previewValues.line2, previewValues.line3, previewValues.line4].map((line, index) => (
                  <div className="editor-preview-row" key={`${line}-${index}`}>
                    <span>{index + 1}</span>
                    <strong>{line}</strong>
                  </div>
                ))}
                <p className="editor-preview-footer">{previewValues.footer}</p>
              </div>
            ) : null}

            {template.kind === "program" ? (
              <div className="editor-preview-layout editor-preview-layout--stacked">
                {[previewValues.line1, previewValues.line2, previewValues.line3, previewValues.line4].map((line, index) => (
                  <div className="editor-preview-row editor-preview-row--bullet" key={`${line}-${index}`}>
                    <span></span>
                    <strong>{line}</strong>
                  </div>
                ))}
                <p className="editor-preview-footer">{previewValues.footer}</p>
              </div>
            ) : null}

            {template.kind === "checklist" ? (
              <div className="editor-preview-layout editor-preview-layout--stacked">
                {checklistLines.map((line, index) => (
                  <div className="editor-preview-row editor-preview-row--checkbox" key={`${line}-${index}`}>
                    <span></span>
                    <strong>{line}</strong>
                  </div>
                ))}
                <p className="editor-preview-note">{previewValues.footer}</p>
              </div>
            ) : null}

            {template.kind === "generic" ? (
              <div className="editor-preview-layout editor-preview-layout--stacked">
                {genericLines.map((line, index) => (
                  <p className="editor-preview-note" key={`${line}-${index}`}>
                    {line}
                  </p>
                ))}
                <strong className="editor-preview-footer">{previewValues.footer}</strong>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
