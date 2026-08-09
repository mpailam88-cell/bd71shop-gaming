import type { Metadata } from "next";
import { AboutSSR } from "./about-ssr-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "${siteName} is Bangladesh's trusted source for premium pet food and supplies since 2021. Genuine products, fair prices, fast delivery.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description: "Bangladesh's trusted source for premium pet food and supplies since 2021.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutSSR />;
}
