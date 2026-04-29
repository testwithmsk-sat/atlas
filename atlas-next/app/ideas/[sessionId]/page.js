import { redirect } from "next/navigation";

export default async function IdeaSessionPage({ params }) {
  const { sessionId } = await params;
  redirect(`/workspace/${sessionId}`);
}
