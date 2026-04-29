import { notFound } from "next/navigation";
import { WorkspaceSessionClient } from "@/components/workspace-session-client";
import { getBundleAssets, getSampleAssets, listGeneratedAssetsForSession } from "@/lib/ai/assets";
import { getPaidBundleOffer } from "@/lib/ai/matcher";
import { customerHasPaidBundleAccess } from "@/lib/ai/orders";
import { getGenerationSession } from "@/lib/ai/sessions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }) {
  const { sessionId } = await params;

  return {
    title: `Workspace ${sessionId}`,
    description: "AI-generated workspace for The Digital Atlas",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function WorkspacePage({ params }) {
  const { sessionId } = await params;
  const session = await getGenerationSession(sessionId);

  if (!session) {
    notFound();
  }

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
    />
  );
}
