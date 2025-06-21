import RegexTester from "@/components/regex-tester"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Regular Expression Tester - Test & Debug Regex Online | Formatters.net",
  description:
    "Free online regular expression tester and debugger. Test regex patterns with real-time matching, capture groups, and detailed explanations. Perfect for developers and data validation.",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex debugger",
    "regex validator",
    "pattern matching",
    "regex online",
    "regex tool",
  ],
  openGraph: {
    title: "Regular Expression Tester - Formatters.net",
    description: "Free online regular expression tester and debugger with real-time matching and explanations.",
    url: "https://formatters.net/tools/regex-tester",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/regex-tester",
  },
}

export default function RegexTesterPage() {
  return <RegexTester />
}
