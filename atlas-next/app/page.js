import { redirect } from "next/navigation";

export const metadata = {
  title: "The Digital Atlas — AI Product Creator",
  description:
    "Describe your goal and get a focused digital product instantly — free starter sample first, premium editable bundle when you're ready.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  redirect("/creator");
}
