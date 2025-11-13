import LayoutWithAds from "@/components/layout-with-ads"
import DiffChecker from "@/components/diff-checker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diff Checker - Compare Text Differences Online | Formatters.net",
  description:
    "Free online diff checker tool. Compare two text blocks side-by-side to highlight changes and differences instantly.",
  keywords: [
    "diff checker",
    "text compare",
    "compare text",
    "compare strings",
    "compare text online",
    "online diff",
    "diff tool",
    "diffchecker",
    "online diff tool",
    "difference checker",
    "string compare",
    "text diff viewer",
    "developer tools",
  ],
  openGraph: {
    title: "Diff Checker - Formatters.net",
    description:
      "Free online diff checker tool. Compare two text blocks side-by-side and highlight differences instantly.",
    url: "https://formatters.net/diff-checker",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/diff-checker",
  },
}

export default function DiffCheckerPage() {
  return (
    <DiffChecker />
  )
}
