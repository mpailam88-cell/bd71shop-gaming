"use client";
import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { ContactPage } from "@/components/pages/contact";

export function ContactSSR() {
  // Use direct setState — we're already on the right URL
  useMemo(() => { useRouter.setState({ page: "contact", params: {} } as any); }, []);
  return <ContactPage />;
}
