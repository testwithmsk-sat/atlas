import Link from "next/link";
import { notFound } from "next/navigation";
import { PdfTemplateEditor } from "@/components/pdf-template-editor";
import { getAllProducts, getProductBySlug, getProductsBySlugs } from "@/lib/catalog";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { customerHasEditorAccess, supportsOnlineEditor } from "@/lib/pdf-editor";
import { getPurchasedProductSlugs } from "@/lib/orders";

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.filter((product) => supportsOnlineEditor(product)).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !supportsOnlineEditor(product)) {
    return {
      title: "Editor unavailable | The Digital Atlas"
    };
  }

  return {
    title: `Edit ${product.name} Online`,
    description: `Customize ${product.name} inside The Digital Atlas editor, preview changes live, and unlock PDF export after purchase.`
  };
}

export default async function EditorPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !supportsOnlineEditor(product)) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const sessionResult = supabase ? await supabase.auth.getUser() : null;
  const email = sessionResult?.data?.user?.email || "";
  const purchasedProductSlugs = email ? await getPurchasedProductSlugs(email) : [];
  const purchasedProducts = purchasedProductSlugs.length ? await getProductsBySlugs(purchasedProductSlugs) : [];
  const canExport = customerHasEditorAccess(product, purchasedProducts);

  const supportMessage = !email
    ? "Sign in and purchase this product to unlock PDF export."
    : canExport
      ? "Export is unlocked for this account."
      : "Complete checkout for this product or a bundle that includes it to unlock PDF export.";

  return (
    <section className="section-block">
      <div className="page-intro editor-page-intro">
        <p className="eyebrow">Template Studio</p>
        <h1>Edit online, then export after purchase.</h1>
        <p>
          This workspace gives customers a Canva-style starting point for text edits directly inside the website. They
          can test the layout live here and only download the personalized PDF after purchase.
        </p>
        <div className="hero-actions">
          <Link className="button button-secondary" href={`/products/${product.slug}`}>
            Back To Product
          </Link>
          <Link className="button button-secondary" href="/account">
            Account & Purchases
          </Link>
        </div>
      </div>

      <PdfTemplateEditor
        product={product}
        canExport={canExport}
        hasAccount={Boolean(email)}
        supportMessage={supportMessage}
      />
    </section>
  );
}
