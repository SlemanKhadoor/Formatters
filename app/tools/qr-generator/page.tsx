import type { Metadata } from "next"
import QrGenerator from "@/components/qr-generator"

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Online",
  description:
    "Generate QR codes online for text, URLs, emails, phone numbers, and more. Free QR code generator with customizable size and error correction.",
  keywords: ["qr code generator","qr code generator online","online qr code generator", "qr generator", "create qr code", "qr code maker", "generate qr code online"],
  openGraph: {
    title: "QR Code Generator - Formatters.net",
    description: "Generate QR codes online for text, URLs, emails, phone numbers, and more. Free QR code generator.",
    url: "https://formatters.net/tools/qr-generator",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/qr-generator",
  },
}

export default function QrGeneratorPage() {
  return <QrGenerator />
}
