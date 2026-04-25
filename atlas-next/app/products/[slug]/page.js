import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata() {
  return {
    title: "Product unavailable | The Digital Atlas",
    description: "Product pages are currently unavailable because the storefront is empty."
  };
}

export default function ProductPage() {
  notFound();
}
