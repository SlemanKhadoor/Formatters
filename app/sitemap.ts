import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://formatters.net"

  // Formatters
  const formatters = [
    "json",
    "javascript",
    "html",
    "css",
    "python",
    "xml",
    "sql",
    "markdown",
    "yaml",
    "typescript",
    "php",
    "go",
    "rust",
    "swift",
    "kotlin",
    "cpp",
  ]

  // Tools
  const tools = [
    "diff-checker",
    "base64",
    "url-encoder",
    "hash-generator",
    "jwt-decoder",
    "jwt-generator",
    "regex-tester",
    "json-to-csv",
    "json-to-xml",
    "json-to-yaml",
    "json-to-typescript",
    "json-to-html",
    "xml-to-json",
    "csv-to-json",
    "yaml-to-json",
    "tsv-to-csv",
    "uuid-generator",
    "qr-generator",
    "password-generator",
    "color-converter",
    "word-counter",
    "case-converter",
    "timestamp-converter",
    "lorem-generator",
    "minifier",
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...formatters.map((formatter) => ({
      url: `${baseUrl}/formatter/${formatter}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]
}
