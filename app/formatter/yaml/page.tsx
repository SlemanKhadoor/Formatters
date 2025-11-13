import FormatterInterface from "@/components/formatter-interface"
import type { Metadata } from "next"

const formatter = {
  name: "YAML",
  description: "Format, validate and beautify YAML data with real-time syntax checking",
  placeholder: `person: {name: John, age:30, hobbies:[coding,reading,music],address:{street: "123 Main St", city: NY, zip:10001},active:true,friends:[{name:Alice,age:25},{name:Bob,age:28},{name:Charlie,age:32}],notes:"This is a sample YAML document that is intentionally written in a messy way to test the formatter. It should be reformatted into something more readable."}`,
  //   placeholder: `# YAML Configuration Example
  // app:
  //   name: "My Application"
  //   version: "1.0.0"
  //   debug: true

  // database:
  //   host: "localhost"
  //   port: 5432
  //   name: "myapp_db"
  //   credentials:
  //     username: "admin"
  //     password: "secret123"

  // features:
  //   - authentication
  //   - logging
  //   - metrics
  //   - caching

  // environments:
  //   development:
  //     debug: true
  //     log_level: "debug"
  //   production:
  //     debug: false
  //     log_level: "error"

  // # Docker Compose Example
  // services:
  //   web:
  //     image: "nginx:latest"
  //     ports:
  //       - "80:80"
  //     volumes:
  //       - "./html:/usr/share/nginx/html"

  //   api:
  //     build: "."
  //     ports:
  //       - "3000:3000"
  //     environment:
  //       NODE_ENV: "production"
  //       DATABASE_URL: "postgresql://user:pass@db:5432/myapp"
  //     depends_on:
  //       - db

  //   db:
  //     image: "postgres:13"
  //     environment:
  //       POSTGRES_DB: "myapp"
  //       POSTGRES_USER: "user"
  //       POSTGRES_PASSWORD: "pass"
  //     volumes:
  //       - "postgres_data:/var/lib/postgresql/data"

  // volumes:
  //   postgres_data:`,
  longDescription:
    "Format, validate, and beautify your YAML documents effortlessly with our professional YAML formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your YAML files are clean, readable, and well-structured. It detects syntax errors, highlights issues, and provides clear messages to help you quickly fix problems. Whether you are working on configuration files, Docker Compose setups, Kubernetes manifests, or CI/CD pipelines, the formatter ensures your YAML is organized and professional. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable results, no installation, setup, or plugins required. Ideal for developers, DevOps engineers, and YAML enthusiasts.",
  keywords: [
    "yaml formatter",
    "yaml validator",
    "yaml online format",
    "format yaml online",
    "YAML checker",
    "format yaml",
    "yaml formatter online",
    "online yaml formatter",
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
