import ComprehensiveTest from "@/components/comprehensive-test"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comprehensive Functionality Test - Formatters.net",
  description: "Test all formatters, converters, and utilities to ensure they work correctly",
  robots: {
    index: false,
    follow: false,
  },
}

export default function TestPage() {
  return <ComprehensiveTest />
}
