import UrlEncoder from "@/components/url-encoder"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "URL Encoder & Decoder - Encode/Decode URLs Online | Formatters.net",
  description:
    "Free online URL encoder and decoder. Encode URLs for web safety or decode URL-encoded strings. Perfect for web development and API work.",
  keywords: [
    "url encoder",
    "url encoder online",
    "online url encoder",
    "url decoder",
    "url decoder online",
    "online url decoder",
    "url encode",
    "url decode",
    "percent encoding",
    "uri encoding",
    "web development",
  ],
  openGraph: {
    title: "URL Encoder & Decoder - Formatters.net",
    description: "Free online URL encoder and decoder. Encode URLs for web safety or decode URL-encoded strings.",
    url: "https://formatters.net/tools/url-encoder",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/url-encoder",
  },
}

export default function UrlEncoderPage() {
  return <UrlEncoder />
}
