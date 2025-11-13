import HashGenerator from "@/components/hash-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hash Generator - MD5, SHA-1, SHA-256 Hash Generator | Formatters.net",
  description:
    "Free online hash generator. Generate MD5, SHA-1, and SHA-256 hashes from text. Secure client-side hashing for passwords, data integrity, and security.",
  keywords: [
    "hash generator",
    "hash generator online",
    "online hash generator",
    "md5 hash",
    "md5 hash online",
    "sha1 hash",
    "sha256 hash",
    "password hash",
    "data integrity",
    "cryptographic hash",
  ],
  openGraph: {
    title: "Hash Generator - MD5, SHA-1, SHA-256 | Formatters.net",
    description: "Free online hash generator. Generate MD5, SHA-1, and SHA-256 hashes from text securely.",
    url: "https://formatters.net/tools/hash-generator",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/hash-generator",
  },
}

export default function HashGeneratorPage() {
  return <HashGenerator />
}
