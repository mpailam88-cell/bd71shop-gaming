"use client";
import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { CheckoutPage } from "@/components/pages/checkout";

export function CheckoutClient() {
  useMemo(() => { useRouter.setState({ page: "checkout", params: {} } as any); }, []);
  return <CheckoutPage />;
}
