import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer",
  alternates: { canonical: "/disclaimer" },
};

export default function Page() {
  return <LegalPage page="disclaimer" />;
}
