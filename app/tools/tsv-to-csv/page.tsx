import type { Metadata } from "next"
import TsvToCsvConverter from "@/components/tsv-to-csv-converter"
import LayoutWithAds from "@/components/layout-with-ads"

export const metadata: Metadata = {
  title: "TSV to CSV Converter | Formatters.net",
  description: "Convert Tab-Separated Values (TSV) to Comma-Separated Values (CSV) format quickly and easily.",
  keywords: "tsv to csv, tab separated values, comma separated values, data converter",
}

export default function TsvToCsvPage() {
  return (
    <TsvToCsvConverter />
  )
}
