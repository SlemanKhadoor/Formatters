import type { Metadata } from "next"
import JsonToHtmlConverter from "@/components/json-to-html-converter"
import LayoutWithAds from "@/components/layout-with-ads"

export const metadata: Metadata = {
  title: "JSON to HTML Table Converter | Formatters.net",
  description:
    "Convert JSON data to HTML table format quickly and easily. Perfect for displaying structured data in web pages.",
  keywords: "json to html, json to table, data converter, html table generator",
}

export default function JsonToHtmlPage() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">JSON to HTML Table Converter</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert JSON arrays to HTML table format. Perfect for displaying structured data in web pages.
            </p>
          </div>
          <JsonToHtmlConverter />
        </div>
      </LayoutWithAds>
    </div>
  )
}
