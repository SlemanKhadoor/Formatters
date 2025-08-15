import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Formatters.net - Complete Developer Toolkit with 35+ Tools",
    template: "%s | Formatters.net",
  },
  description:
    "Complete developer toolkit with 35+ professional tools: 16 code formatters with syntax highlighting and line numbers (JSON, JavaScript, TypeScript, Python, PHP, Go, Rust, Swift, Kotlin, C/C++), 9 data converters (JSON to CSV/XML/YAML), 13 utilities (UUID generator, QR generator, password generator, color converter), and 3 text processing tools. All free, secure, and client-side.",
  keywords: [
    // Code Formatters
    "code formatter",
    "syntax highlighting",
    "line numbers",
    "json formatter",
    "javascript beautifier",
    "typescript formatter",
    "html formatter",
    "css formatter",
    "python formatter",
    "php formatter",
    "go formatter",
    "rust formatter",
    "swift formatter",
    "kotlin formatter",
    "cpp formatter",
    "c++ formatter",
    "xml formatter",
    "sql formatter",
    "markdown formatter",
    "yaml formatter",
    "code beautifier",
    "syntax validator",
    "code editor",
    "ide online",

    // Data Converters
    "json to csv converter",
    "json to xml converter",
    "json to yaml converter",
    "json to typescript converter",
    "json to html converter",
    "xml to json converter",
    "csv to json converter",
    "yaml to json converter",
    "tsv to csv converter",
    "data converter",
    "format converter",

    // Developer Utilities
    "uuid generator",
    "guid generator",
    "qr code generator",
    "password generator",
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "timestamp converter",
    "unix timestamp",
    "lorem ipsum generator",
    "base64 encoder",
    "base64 decoder",
    "url encoder",
    "url decoder",
    "hash generator",
    "md5 hash",
    "sha256 hash",
    "jwt decoder",
    "jwt generator",
    "jwt token decoder",
    "regex tester",
    "minifier",
    "css minifier",
    "js minifier",
    "html minifier",

    // Text Processing Tools
    "word counter",
    "character counter",
    "case converter",
    "camelcase",
    "snake case",
    "kebab case",
    "pascal case",
    "diff checker",
    "text comparison",
    "code comparison",
    "file comparison",
    "text statistics",
    "reading time calculator",

    // General
    "developer tools",
    "online tools",
    "web development tools",
    "programming tools",
    "code tools",
    "text tools",
    "utility tools",
    "free tools",
    "client side tools",
    "secure tools",
    "privacy tools",
    "offline tools",
  ],
  authors: [{ name: "Formatters.net" }],
  creator: "Formatters.net",
  publisher: "Formatters.net",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://formatters.net",
    siteName: "Formatters.net",
    title: "Formatters.net - Complete Developer Toolkit with 35+ Tools",
    description:
      "Complete developer toolkit with 35+ professional tools: 16 code formatters with syntax highlighting, 9 data converters, 13 utilities, and 3 text processing tools. All free, secure, and client-side.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Formatters.net - Complete Developer Toolkit with 35+ Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Formatters.net - Complete Developer Toolkit with 35+ Tools",
    description:
      "Complete developer toolkit with 35+ professional tools: 16 code formatters with syntax highlighting, 9 data converters, 13 utilities, and 3 text processing tools. All free, secure, and client-side.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://formatters.net",
  },
  generator: 'v0.dev'
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Formatters.net",
  description:
    "Complete developer toolkit with 35+ professional tools including code formatters with syntax highlighting, data converters, utilities, and text processing tools",
  url: "https://formatters.net",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    // Code Formatters
    "JSON Formatter with Syntax Highlighting",
    "JavaScript Beautifier with Line Numbers",
    "TypeScript Formatter",
    "HTML Formatter",
    "CSS Formatter",
    "Python Formatter",
    "PHP Formatter",
    "Go Formatter",
    "Rust Formatter",
    "Swift Formatter",
    "Kotlin Formatter",
    "C/C++ Formatter",
    "XML Formatter",
    "SQL Formatter",
    "Markdown Formatter",
    "YAML Formatter",

    // Data Converters
    "JSON to CSV Converter",
    "JSON to XML Converter",
    "JSON to YAML Converter",
    "JSON to TypeScript Converter",
    "JSON to HTML Table Converter",
    "XML to JSON Converter",
    "CSV to JSON Converter",
    "YAML to JSON Converter",
    "TSV to CSV Converter",

    // Developer Utilities
    "UUID/GUID Generator",
    "QR Code Generator",
    "Password Generator",
    "Color Converter",
    "Timestamp Converter",
    "Base64 Encoder/Decoder",
    "URL Encoder/Decoder",
    "Hash Generator (MD5, SHA-1, SHA-256)",
    "JWT Decoder",
    "JWT Generator",
    "Regular Expression Tester",
    "Lorem Ipsum Generator",
    "CSS/JS/HTML Minifier",

    // Text Processing Tools
    "Word Counter",
    "Character Counter",
    "Case Converter",
    "Advanced Diff Checker",
    "Text Comparison Tool",
    "Code Comparison",

    // Additional Features
    "Syntax Validation",
    "Dark Mode Support",
    "Mobile Responsive",
    "Offline Capable",
    "Client-Side Processing",
    "Privacy Focused",
    "No Data Collection",
    "File Upload Support",
    "Export Functionality",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="canonical" href="https://formatters.net" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Formatters.net" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
