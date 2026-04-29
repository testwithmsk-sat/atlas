import { permanentRedirect } from "next/navigation";

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const nextSearch = new URLSearchParams({
    source: "category",
    useCaseType: category.replace(/-/g, " "),
    prompt: `I need a generated digital bundle for ${category.replace(/-/g, " ")}.`
  });

  permanentRedirect(`/?${nextSearch.toString()}`);
}
