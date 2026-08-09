import type { Metadata } from "next";
import { ContactSSR } from "./contact-ssr-client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ${siteName}. Call, email, or visit our store. We're here to help with any questions about pet products, orders, or pet care.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with ${siteName}. Call, email, or visit our store.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactSSR />;
}
