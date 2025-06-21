import JwtDecoder from "@/components/jwt-decoder"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JWT Decoder - Decode JWT Tokens Online | Formatters.net",
  description:
    "Free online JWT decoder. Decode JWT tokens to view header and payload data. Perfect for debugging authentication tokens and API development.",
  keywords: [
    "jwt decoder",
    "jwt token decoder",
    "json web token",
    "decode jwt",
    "jwt debugger",
    "token decoder",
    "authentication",
  ],
  openGraph: {
    title: "JWT Decoder - Decode JWT Tokens Online | Formatters.net",
    description: "Free online JWT decoder. Decode JWT tokens to view header and payload data securely.",
    url: "https://formatters.net/tools/jwt-decoder",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/jwt-decoder",
  },
}

export default function JwtDecoderPage() {
  return <JwtDecoder />
}
