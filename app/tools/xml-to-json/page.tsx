import type { Metadata } from "next"
import XmlToJsonConverter from "@/components/xml-to-json-converter"

export const metadata: Metadata = {
  title: "XML to JSON Converter - Convert XML to JSON Format | Formatters.net",
  description:
    "Free online XML to JSON converter. Transform XML data into JSON format instantly. Perfect for API development, data migration, and system integration.",
  keywords: [
    "xml to json",
    "xml json converter",
    "xml json converter online",
    "online xml json converter",
    "convert xml to json",
    "data conversion",
    "json generator",
    "api conversion",
  ],
  openGraph: {
    title: "XML to JSON Converter - Formatters.net",
    description: "Free online XML to JSON converter. Transform XML data into JSON format instantly.",
    url: "https://formatters.net/tools/xml-to-json",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/xml-to-json",
  },
}

export default function XmlToJsonPage() {
  return <XmlToJsonConverter />
}
