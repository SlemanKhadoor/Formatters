import JsonToXmlConverter from "@/components/json-to-xml-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to XML Converter - Convert JSON to XML Format | Formatters.net",
  description:
    "Free online JSON to XML converter. Transform JSON data into XML format instantly. Perfect for data interchange, APIs, and system integration.",
  keywords: [
    "json to xml",
    "json xml converter",
    "convert json to xml",
    "data conversion",
    "xml generator",
    "api conversion",
  ],
  openGraph: {
    title: "JSON to XML Converter - Formatters.net",
    description: "Free online JSON to XML converter. Transform JSON data into XML format instantly.",
    url: "https://formatters.net/tools/json-to-xml",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/json-to-xml",
  },
}

export default function JsonToXmlPage() {
  return <JsonToXmlConverter />
}
