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
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">TSV to CSV Converter</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert Tab-Separated Values (TSV) to Comma-Separated Values (CSV) format.
            </p>
          </div>
          <TsvToCsvConverter />
        </div>
      </LayoutWithAds>
    </div>
  )
}
