"use client";
import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { CartPage } from "@/components/pages/cart";

export function CartClient() {
  useMemo(() => { useRouter.setState({ page: "cart", params: {} } as any); }, []);
  return <CartPage />;
}
