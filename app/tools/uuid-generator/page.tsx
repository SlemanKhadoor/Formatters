import LayoutWithAds from "@/components/layout-with-ads"
import UuidGenerator from "@/components/uuid-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "UUID Generator - Create Random UUIDs Instantly | Formatters.net",
  description:
    "Free online UUID generator. Create random UUIDv4 values instantly for development, testing, databases, and unique identifiers.",
  keywords: [
    "uuid generator",
    "uuid generator online",
    "online uuid v4 generator",
    "online uuid generator",
    "uuid v4 generator",
    "generate uuid",
    "random uuid",
    "random uuid generator",
    "unique identifier generator",
    "developer tools",
  ],
  openGraph: {
    title: "UUID Generator - Formatters.net",
    description:
      "Free online UUID generator. Create random UUIDv4 values instantly.",
    url: "https://formatters.net/tools/uuid-generator",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/uuid-generator",
  },
}

export default function UuidGeneratorPage() {
  return (
    <UuidGenerator />
  )
}
