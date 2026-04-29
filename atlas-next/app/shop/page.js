import { permanentRedirect } from "next/navigation";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q : "";
  const nextSearch = new URLSearchParams({
    source: "shop"
  });

  if (query) {
    nextSearch.set("prompt", query);
  }

  permanentRedirect(`/?${nextSearch.toString()}`);
}
