import JsonToHtmlConverter from "@/components/json-to-html-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to HTML Table Converter | Formatters.net",
  description:
    "Convert JSON data to HTML table format quickly and easily. Perfect for displaying structured data in web pages.",
  keywords: "json to html, json to table, data converter, html table generator",
}

export default function JsonToHtmlPage() {
  return (
    <JsonToHtmlConverter />
  )
}
