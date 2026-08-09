"use client";
import { useMemo } from "react";
import { useRouter } from "@/lib/store";
import { AccountPage } from "@/components/pages/account";

export function AccountClient() {
  useMemo(() => { useRouter.setState({ page: "account", params: {} } as any); }, []);
  return <AccountPage />;
}
