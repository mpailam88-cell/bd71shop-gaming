import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage page="privacy" />;
}
