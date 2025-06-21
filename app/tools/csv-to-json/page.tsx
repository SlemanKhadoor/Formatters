import type { Metadata } from "next"
import CsvToJsonConverter from "@/components/csv-to-json-converter"

export const metadata: Metadata = {
  title: "CSV to JSON Converter - Convert CSV to JSON Format | Formatters.net",
  description:
    "Free online CSV to JSON converter. Transform CSV data into JSON format instantly. Perfect for data analysis, API development, and database operations.",
  keywords: [
    "csv to json",
    "csv json converter",
    "convert csv to json",
    "data conversion",
    "json generator",
    "csv parser",
  ],
  openGraph: {
    title: "CSV to JSON Converter - Formatters.net",
    description: "Free online CSV to JSON converter. Transform CSV data into JSON format instantly.",
    url: "https://formatters.net/tools/csv-to-json",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/csv-to-json",
  },
}

export default function CsvToJsonPage() {
  return <CsvToJsonConverter />
}
