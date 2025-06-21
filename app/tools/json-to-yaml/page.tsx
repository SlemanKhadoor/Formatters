import JsonToYamlConverter from "@/components/json-to-yaml-converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JSON to YAML Converter - Convert JSON to YAML Format | Formatters.net",
  description:
    "Free online JSON to YAML converter. Transform JSON data into YAML format instantly. Perfect for configuration files, Docker, Kubernetes, and CI/CD.",
  keywords: [
    "json to yaml",
    "json yaml converter",
    "convert json to yaml",
    "yaml generator",
    "configuration files",
    "docker compose",
    "kubernetes yaml",
  ],
  openGraph: {
    title: "JSON to YAML Converter - Formatters.net",
    description: "Free online JSON to YAML converter. Transform JSON data into YAML format instantly.",
    url: "https://formatters.net/tools/json-to-yaml",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/json-to-yaml",
  },
}

export default function JsonToYamlPage() {
  return <JsonToYamlConverter />
}
