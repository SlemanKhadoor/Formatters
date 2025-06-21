import CaseConverter from "@/components/case-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Case Converter - Convert Text Case Online | Formatters.net",
  description:
    "Free online case converter. Convert text between camelCase, snake_case, kebab-case, PascalCase, and more. Perfect for programming and text formatting.",
  keywords: [
    "case converter",
    "camelCase",
    "snake_case",
    "kebab-case",
    "PascalCase",
    "text converter",
    "programming case",
  ],
  openGraph: {
    title: "Case Converter - Formatters.net",
    description: "Free online case converter. Convert text between camelCase, snake_case, kebab-case, and more.",
    url: "https://formatters.net/tools/case-converter",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/case-converter",
  },
}

export default function CaseConverterPage() {
  return <CaseConverter />
}
