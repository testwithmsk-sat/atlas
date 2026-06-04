import { notFound } from "next/navigation";
import { WorkspaceSessionClient } from "@/components/workspace-session-client";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getOrRecoverSession } from "@/lib/ai/session-recovery";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  return {
    title: "Workspace — The Digital Atlas",
    description: "Your AI-generated digital product workspace.",
    robots: { index: false, follow: false }
  };
}

export default async function WorkspacePage({ params, searchParams }) {
  const { sessionId } = await params;
  const sp = await searchParams;
  const token = typeof sp?.t === "string" ? sp.t : "";

  const session = await getOrRecoverSession(sessionId, token);
  if (!session) notFound();

  const assets = await listGeneratedAssetsForSession(sessionId);
  const supabase = await createSupabaseServerClient();
  const userResult = supabase ? await supabase.auth.getUser() : null;
  const email = userResult?.data?.user?.email || "";
  const hasPaidAccess = email ? await customerHasPaidBundleAccess(sessionId, email) : false;

  return (
    <WorkspaceSessionClient
      session={session}
      sampleAssets={getSampleAssets(assets)}
      bundleAssets={hasPaidAccess ? getBundleAssets(assets) : []}
      paidBundleOffer={getPaidBundleOffer(session.templateFamily)}
      hasPaidAccess={hasPaidAccess}
      sessionToken={token}
    />
  );
}
