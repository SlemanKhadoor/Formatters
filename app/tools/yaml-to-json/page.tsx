import type { Metadata } from "next"
import YamlToJsonConverter from "@/components/yaml-to-json-converter"

export const metadata: Metadata = {
  title: "YAML to JSON Converter - Convert YAML to JSON Format | Formatters.net",
  description:
    "Free online YAML to JSON converter. Transform YAML data into JSON format instantly. Perfect for configuration files, API development, and DevOps tools.",
  keywords: [
    "yaml to json",
    "yml to json",
    "yaml json converter",
    "convert yaml to json",
    "data conversion",
    "json generator",
  ],
  openGraph: {
    title: "YAML to JSON Converter - Formatters.net",
    description: "Free online YAML to JSON converter. Transform YAML data into JSON format instantly.",
    url: "https://formatters.net/tools/yaml-to-json",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/yaml-to-json",
  },
}

export default function YamlToJsonPage() {
  return <YamlToJsonConverter />
}
