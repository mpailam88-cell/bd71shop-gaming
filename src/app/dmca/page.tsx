import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/legal";

export const revalidate = false;

export const metadata: Metadata = {
  title: "Dmca",
  description: "DMCA policy",
  alternates: { canonical: "/dmca" },
};

export default function Page() {
  return <LegalPage page="dmca" />;
}
