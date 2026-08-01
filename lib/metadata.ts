import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    description: siteConfig.description,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Frontend Developer`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    title: `${siteConfig.name} | Frontend Developer`,
  },
};