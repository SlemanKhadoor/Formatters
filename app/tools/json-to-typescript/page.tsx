import JsonToTypescriptConverter from "@/components/json-to-typescript-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to TypeScript Converter - Generate TypeScript Interfaces | Formatters.net",
  description:
    "Free online JSON to TypeScript converter. Generate TypeScript interfaces and types from JSON data instantly. Perfect for API development and type safety.",
  keywords: [
    "json to typescript",
    "typescript interface generator",
    "json typescript converter",
    "generate typescript types",
    "api types",
    "typescript interfaces",
  ],
  openGraph: {
    title: "JSON to TypeScript Converter - Formatters.net",
    description: "Free online JSON to TypeScript converter. Generate TypeScript interfaces from JSON data instantly.",
    url: "https://formatters.net/tools/json-to-typescript",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/json-to-typescript",
  },
}

export default function JsonToTypescriptPage() {
  return <JsonToTypescriptConverter />
}
