import { createSupabaseServerClient } from "@/lib/supabase-server";
import AICreatorClient from "@/components/ai-creator-client";

export const metadata = {
  title: "AI Product Creator | The Digital Atlas",
  description: "Describe your goal and get a personalised digital product bundle instantly.",
  alternates: { canonical: "/creator" }
};

export default async function CreatorPage() {
  const supabase = await createSupabaseServerClient();

  const session = supabase
    ? (await supabase.auth.getSession()).data.session
    : null;

  const { data: savedProducts } = session && supabase
    ? await supabase
        .from("digital_products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: null };

  return (
    <AICreatorClient
      userId={session?.user?.id ?? null}
      initialProducts={savedProducts ?? []}
    />
  );
}
