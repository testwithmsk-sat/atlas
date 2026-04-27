"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField
} from "pdf-lib";
import { formatEditorFieldLabel } from "@/lib/pdf-editor";

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

function parseFieldDefinition(field) {
  const name = field.getName();
  const label = formatEditorFieldLabel(name);

  if (field instanceof PDFTextField) {
    return {
      id: name,
      name,
      label,
      type: "text",
      multiline: field.isMultiline(),
      value: field.getText() || ""
    };
  }

  if (field instanceof PDFCheckBox) {
    return {
      id: name,
      name,
      label,
      type: "checkbox",
      value: field.isChecked()
    };
  }

  if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
    const options = field.getOptions();
    const selected = field.getSelected();

    return {
      id: name,
      name,
      label,
      type: "select",
      options,
      value: selected?.[0] || options?.[0] || ""
    };
  }

  if (field instanceof PDFRadioGroup) {
    const options = field.getOptions();

    return {
      id: name,
      name,
      label,
      type: "radio",
      options,
      value: field.getSelected() || options?.[0] || ""
    };
  }

  return null;
}

function buildInitialValues(definitions) {
  return definitions.reduce((accumulator, field) => {
    accumulator[field.name] = field.value;
    return accumulator;
  }, {});
}

async function fillPdfBytes(originalBytes, definitions, values, flatten = false) {
  const pdfDoc = await PDFDocument.load(originalBytes);
  const form = pdfDoc.getForm();

  definitions.forEach((definition) => {
    const field = form.getFieldMaybe(definition.name);
    if (!field) return;

    const nextValue = values[definition.name];

    if (field instanceof PDFTextField) {
      field.setText(String(nextValue || ""));
      return;
    }

    if (field instanceof PDFCheckBox) {
      if (nextValue) field.check();
      else field.uncheck();
      return;
    }

    if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
      if (nextValue) field.select(String(nextValue));
      return;
    }

    if (field instanceof PDFRadioGroup) {
      if (nextValue) field.select(String(nextValue));
    }
  });

  form.updateFieldAppearances();
  if (flatten) form.flatten();
  return pdfDoc.save();
}

function FieldInput({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="editor-field editor-field--checkbox">
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="editor-field">
        <span>{field.label}</span>
        <select value={value} onChange={(event) => onChange(field.name, event.target.value)}>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <fieldset className="editor-field editor-fieldset">
        <span>{field.label}</span>
        <div className="editor-radio-list">
          {field.options.map((option) => (
            <label className="editor-radio-item" key={option}>
              <input
                type="radio"
                name={field.name}
                value={option}
                checked={value === option}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.multiline) {
    return (
      <label className="editor-field">
        <span>{field.label}</span>
        <textarea rows={4} value={value} onChange={(event) => onChange(field.name, event.target.value)} />
      </label>
    );
  }

  return (
    <label className="editor-field">
      <span>{field.label}</span>
      <input type="text" value={value} onChange={(event) => onChange(field.name, event.target.value)} />
    </label>
  );
}

export function PdfTemplateEditor({ product, canExport, hasAccount, supportMessage }) {
  const [sourceBytes, setSourceBytes] = useState(null);
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("Loading the editable PDF...");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");
  const editorFacts = useMemo(
    () => [product.category, product.subcategory, product.details?.format || product.productType].filter(Boolean),
    [product]
  );

  useEffect(() => {
    let active = true;

    async function loadSource() {
      try {
        const response = await fetch(`/api/editor/${product.slug}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("The source PDF could not be loaded.");
        }

        const bytes = new Uint8Array(await response.arrayBuffer());
        const pdfDoc = await PDFDocument.load(bytes);
        const definitions = pdfDoc
          .getForm()
          .getFields()
          .map((field) => parseFieldDefinition(field))
          .filter(Boolean);

        if (!active) return;

        setSourceBytes(bytes);
        setFields(definitions);
        setValues(buildInitialValues(definitions));
        setStatus(
          definitions.length
            ? "Update the real PDF fields on the left. The full document preview refreshes automatically."
            : "This PDF opened successfully, but no editable form fields were found."
        );
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || "The PDF editor could not be loaded.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadSource();

    return () => {
      active = false;
    };
  }, [product.slug]);

  useEffect(() => {
    if (!sourceBytes || fields.length === 0) return undefined;

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const previewBytes = await fillPdfBytes(sourceBytes, fields, values, false);
        if (!active) return;

        const blob = new Blob([previewBytes], { type: "application/pdf" });
        const nextUrl = URL.createObjectURL(blob);
        setPreviewUrl((currentUrl) => {
          if (currentUrl) URL.revokeObjectURL(currentUrl);
          return nextUrl;
        });
      } catch {
        if (active) {
          setError("The live PDF preview could not be refreshed.");
        }
      }
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [sourceBytes, fields, values]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const updateValue = (fieldName, nextValue) => {
    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue
    }));
  };

  const resetValues = () => {
    setValues(buildInitialValues(fields));
    setStatus("The PDF fields were reset to their original values.");
  };

  const handleExport = async () => {
    if (!canExport) {
      setStatus(supportMessage);
      return;
    }

    if (!sourceBytes || fields.length === 0) {
      setStatus("This PDF is not ready for export yet.");
      return;
    }

    setIsExporting(true);
    setStatus("");

    try {
      const exportBytes = await fillPdfBytes(sourceBytes, fields, values, true);
      downloadBytes(exportBytes, `${slugifyFileName(product.slug)}-personalized.pdf`);
      setStatus("Your personalized PDF has been created and downloaded.");
    } catch {
      setStatus("The personalized PDF could not be exported. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="editor-shell">
      <aside className="editor-sidebar">
        <div className="editor-sidebar-card">
          <p className="eyebrow">PDF Editor</p>
          <h2>{product.name}</h2>
          <p>
            This workspace loads the real PDF, shows the full document preview, and lets customers edit actual form
            fields before downloading the personalized version after purchase.
          </p>
          <div className="editor-meta-list">
            {editorFacts.map((fact) => (
              <span className="catalog-chip" key={fact}>
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="editor-sidebar-card">
          <p className="eyebrow">Editable Fields</p>
          {isLoading ? <p className="editor-status">Loading PDF fields...</p> : null}
          {error ? <p className="editor-status">{error}</p> : null}
          {!isLoading && !error && fields.length === 0 ? (
            <p className="editor-status">No editable form fields were found inside this PDF yet.</p>
          ) : null}
          {fields.length > 0 ? (
            <>
              <div className="editor-form-grid">
                {fields.map((field) => (
                  <FieldInput key={field.id} field={field} value={values[field.name]} onChange={updateValue} />
                ))}
              </div>
              <div className="editor-actions">
                <button className="button button-primary" type="button" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "Preparing PDF..." : canExport ? "Download Personalized PDF" : "Unlock Download After Purchase"}
                </button>
                <button className="button button-secondary" type="button" onClick={resetValues}>
                  Reset Fields
                </button>
              </div>
              <p className={`editor-status ${canExport ? "editor-status--ready" : ""}`}>{status || supportMessage}</p>
            </>
          ) : null}
        </div>

        <div className="editor-sidebar-card">
          <p className="eyebrow">How It Works</p>
          <ul className="feature-list">
            <li>The full PDF preview refreshes automatically when fields change.</li>
            <li>Customers can test edits before buying, but the final download stays locked until purchase.</li>
            <li>After purchase, the exported PDF is flattened so the personalized design is ready to use.</li>
          </ul>
          <div className="editor-cta-links">
            <Link className="text-link" href={`/products/${product.slug}`}>
              View product details
            </Link>
            {!hasAccount ? (
              <Link className="text-link" href="/account">
                Sign in to unlock purchase-linked downloads
              </Link>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="editor-stage">
        <div className="editor-preview-card">
          {!canExport ? <div className="editor-lock-banner">Preview editing is open. Download unlocks after purchase.</div> : null}
          {previewUrl ? (
            <iframe
              className="editor-pdf-frame"
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              title={`${product.name} PDF editor preview`}
            />
          ) : (
            <div className="editor-preview-placeholder">
              <strong>{isLoading ? "Loading full PDF preview..." : "Preparing full PDF preview..."}</strong>
              <span>{error || "Once the source PDF is ready, the live document will appear here."}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
