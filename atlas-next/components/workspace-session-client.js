"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { GeneratedBundleAddToCartButton } from "@/components/generated-bundle-add-to-cart";

export function WorkspaceSessionClient({
  session,
  sampleAssets = [],
  bundleAssets = [],
  paidBundleOffer,
  hasPaidAccess = false,
  entryMode = "workspace"
}) {
  const router = useRouter();
  const [loadingOptionId, setLoadingOptionId] = useState("");
  const [error, setError] = useState("");
  const previewAsset = sampleAssets.find((asset) => asset.format === "PNG");
  const samplePdfAsset = sampleAssets.find((asset) => asset.format === "PDF");
  const isIdeasEntry = entryMode === "ideas";

  const chooseOption = (optionId) => {
    setError("");
    setLoadingOptionId(optionId);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch(`/api/generate/${session.sessionId}/sample`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ optionId })
          });

          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload?.error || "The app could not narrow the request into a sample direction.");
          }

          router.refresh();
        } catch (requestError) {
          setError(requestError instanceof Error ? requestError.message : "The app could not narrow the request into a sample direction.");
        } finally {
          setLoadingOptionId("");
        }
      })();
    });
  };

  return (
    <div className="stack">
      <section className="section-block intent-results-hero">
        <div className="page-intro">
          <p className="eyebrow eyebrow--electric">{isIdeasEntry ? "Planning details behind the recommendation" : "AI generation workspace"}</p>
          <h1>{session.normalizedIntent.recommendedTitle}</h1>
          <p>{session.normalizedIntent.intentSummary}</p>
        </div>

        <div className="intent-results-grid">
          <article className="summary-card intent-results-summary">
            <p className="eyebrow">Recommended direction</p>
            <h2>{session.templateFamily.replace(/_/g, " ")}</h2>
            <p>{session.normalizedIntent.recommendedDescription}</p>
            <div className="checkout-microcopy">
              <span>{session.normalizedIntent.useCaseType}</span>
              <span>{session.normalizedIntent.audienceProfile}</span>
              <span>{session.normalizedIntent.styleDirection}</span>
            </div>
            <div className="summary-actions">
              {samplePdfAsset ? (
                <a className="button button-primary" href={`/api/assets/${samplePdfAsset.id}/download`}>
                  Download Free Sample
                </a>
              ) : null}
              {isIdeasEntry ? (
                <Link className="button button-secondary" href={`/workspace/${session.sessionId}`}>
                  Open planning workspace
                </Link>
              ) : (
                <Link className="button button-secondary" href="/">
                  Start Another Idea
                </Link>
              )}
            </div>
          </article>

          <article className="info-card intent-results-notes">
            <p className="eyebrow">Suggested deliverables</p>
            <ul className="feature-list compact-detail-list">
              {session.normalizedIntent.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {session.sampleStatus === "needs_selection" ? (
        <section className="section-block">
          <article className="info-card">
            <p className="eyebrow eyebrow--electric">Narrow the direction</p>
            <h2>The request is promising, but the generator needs one cleaner lane before it creates files.</h2>
            <p>Choose the option that feels closest to the actual outcome you want and the app will generate a starter sample immediately.</p>
            <div className="guide-stack">
              {session.suggestedOptions.map((option) => (
                <article className="catalog-card" key={option.id}>
                  <p className="eyebrow">{option.templateFamily.replace(/_/g, " ")}</p>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <ul className="feature-list compact-detail-list">
                    <li>{option.rationale}</li>
                    <li>{option.outputFormats.join(" + ")} bundle formats</li>
                  </ul>
                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => chooseOption(option.id)}
                    disabled={Boolean(loadingOptionId)}
                  >
                    {loadingOptionId === option.id ? "Generating..." : "Generate This Direction"}
                  </button>
                </article>
              ))}
            </div>
            {error ? <p className="status-note">{error}</p> : null}
          </article>
        </section>
      ) : null}

      {previewAsset ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Free sample preview</p>
              <h2>See the first clear output before you commit to the full bundle.</h2>
            </div>
          </div>
          <article className="catalog-card">
            <img
              src={`/api/assets/${previewAsset.id}/download?disposition=inline`}
              alt={`${session.normalizedIntent.recommendedTitle} preview`}
              style={{ width: "100%", borderRadius: "22px", border: "1px solid rgba(23, 33, 47, 0.08)" }}
            />
            <div className="hero-actions">
              {samplePdfAsset ? (
                <a className="button button-primary" href={`/api/assets/${samplePdfAsset.id}/download`}>
                  Download Starter PDF
                </a>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}

      <section className="section-block intent-results-grid-two">
        <article className="info-card">
          <p className="eyebrow">Why this fit works</p>
          <ul className="feature-list compact-detail-list">
            {session.normalizedIntent.whyItFits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="summary-card">
          <p className="eyebrow">Paid full bundle</p>
          <h2>{paidBundleOffer.bundleName}</h2>
          <p>{paidBundleOffer.description}</p>
          <div className="summary-lines">
            <div>
              <span>Price</span>
              <strong>{paidBundleOffer.priceLabel}</strong>
            </div>
            <div>
              <span>Formats</span>
              <strong>{paidBundleOffer.includedFormats.join(" + ")}</strong>
            </div>
          </div>
          <div className="summary-actions">
            <GeneratedBundleAddToCartButton
              sessionId={session.sessionId}
              bundleName={paidBundleOffer.bundleName}
              priceLabel={paidBundleOffer.priceLabel}
              includedFormats={paidBundleOffer.includedFormats}
              deliverables={session.normalizedIntent.deliverables}
              image={previewAsset ? `/api/assets/${previewAsset.id}/download?disposition=inline` : ""}
            />
            <Link className="button button-secondary" href="/cart">
              Go To Cart
            </Link>
          </div>
          <p className="status-note">The full bundle keeps the same direction but unlocks the editable and printable master files for this session.</p>
        </article>
      </section>

      {hasPaidAccess && bundleAssets.length ? (
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--electric">Unlocked downloads</p>
              <h2>Your paid bundle files are ready.</h2>
            </div>
          </div>
          <div className="account-list">
            {bundleAssets.map((asset) => (
              <div className="account-entry" key={asset.id}>
                <div>
                  <strong>{asset.fileName}</strong>
                  <p>{asset.format} full-bundle asset</p>
                </div>
                <div className="account-entry-actions">
                  <a className="text-link" href={`/api/assets/${asset.id}/download`}>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
