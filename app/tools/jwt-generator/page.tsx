import JwtGenerator from "@/components/jwt-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JWT Generator - Create JWT Tokens Online | Formatters.net",
  description:
    "Free online JWT generator. Create and sign JWT tokens with custom headers and payloads. Perfect for API development, authentication testing, and token generation.",
  keywords: [
    "jwt generator",
    "jwt token generator",
    "json web token generator",
    "create jwt",
    "jwt maker",
    "token generator",
    "authentication",
  ],
  openGraph: {
    title: "JWT Generator - Create JWT Tokens Online | Formatters.net",
    description: "Free online JWT generator. Create and sign JWT tokens with custom headers and payloads securely.",
    url: "https://formatters.net/tools/jwt-generator",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/jwt-generator",
  },
}

export default function JwtGeneratorPage() {
  return <JwtGenerator />
}
