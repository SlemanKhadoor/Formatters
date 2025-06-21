import FormatterInterface from "@/components/formatter-interface"
import type { Metadata } from "next"

const formatter = {
  name: "YAML",
  description: "Format and validate YAML data with proper indentation and structure",
  placeholder: `# YAML Configuration Example
app:
  name: "My Application"
  version: "1.0.0"
  debug: true
  
database:
  host: "localhost"
  port: 5432
  name: "myapp_db"
  credentials:
    username: "admin"
    password: "secret123"

features:
  - authentication
  - logging
  - metrics
  - caching

environments:
  development:
    debug: true
    log_level: "debug"
  production:
    debug: false
    log_level: "error"

# Docker Compose Example
services:
  web:
    image: "nginx:latest"
    ports:
      - "80:80"
    volumes:
      - "./html:/usr/share/nginx/html"
  
  api:
    build: "."
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: "production"
      DATABASE_URL: "postgresql://user:pass@db:5432/myapp"
    depends_on:
      - db
  
  db:
    image: "postgres:13"
    environment:
      POSTGRES_DB: "myapp"
      POSTGRES_USER: "user"
      POSTGRES_PASSWORD: "pass"
    volumes:
      - "postgres_data:/var/lib/postgresql/data"

volumes:
  postgres_data:`,
  longDescription:
    "Format and validate YAML documents with proper indentation and structure. Perfect for configuration files, Docker Compose, Kubernetes manifests, and CI/CD pipelines.",
  keywords: [
    "yaml formatter",
    "yaml validator",
    "format yaml",
    "yaml beautifier",
    "docker compose yaml",
    "kubernetes yaml",
    "yaml configuration",
  ],
}

export default function YamlFormatterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${formatter.name} Formatter`,
    description: formatter.longDescription,
    url: `https://formatters.net/formatter/yaml`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [`${formatter.name} Formatting`, "Syntax Validation", "Error Detection", "Real-time Processing"],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FormatterInterface type="yaml" formatter={formatter} />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${formatter.name} Formatter - Format & Validate ${formatter.name} Code Online`,
    description: formatter.longDescription,
    keywords: formatter.keywords,
    openGraph: {
      title: `${formatter.name} Formatter - Formatters.net`,
      description: formatter.longDescription,
      url: `https://formatters.net/formatter/yaml`,
      type: "website",
      images: [
        {
          url: `/og-yaml.png`,
          width: 1200,
          height: 630,
          alt: `${formatter.name} Formatter`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${formatter.name} Formatter - Formatters.net`,
      description: formatter.longDescription,
      images: [`/og-yaml.png`],
    },
    alternates: {
      canonical: `https://formatters.net/formatter/yaml`,
    },
  }
}
