import JsonToCsvConverter from "@/components/json-to-csv-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to CSV Converter - Convert JSON Arrays to CSV Format | Formatters.net",
  description:
    "Free online JSON to CSV converter. Transform JSON arrays into CSV format instantly. Perfect for data analysis, Excel imports, and database operations.",
  keywords: [
    "json to csv",
    "json csv converter",
    "json csv converter online",
    "online json csv converter",
    "convert json to csv",
    "json array to csv",
    "data conversion",
    "excel import",
    "csv generator",
  ],
  openGraph: {
    title: "JSON to CSV Converter - Formatters.net",
    description: "Free online JSON to CSV converter. Transform JSON arrays into CSV format instantly.",
    url: "https://formatters.net/tools/json-to-csv",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/json-to-csv",
  },
}

export default function JsonToCsvPage() {
  return <JsonToCsvConverter />
}
