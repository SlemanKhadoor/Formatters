import PasswordGenerator from "@/components/password-generator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Generator - Generate Secure Passwords Online | Formatters.net",
  description:
    "Free online password generator. Create strong, secure passwords with custom rules, length, and character sets. Includes password strength meter and security tips.",
  keywords: [
    "password generator",
    "online password generator",
    "password generator online",
    "secure password",
    "strong password",
    "random password",
    "random password generator",
    "random password online",
    "password creator",
    "password security",
  ],
  openGraph: {
    title: "Password Generator - Formatters.net",
    description: "Free online password generator. Create strong, secure passwords with custom rules and length.",
    url: "https://formatters.net/tools/password-generator",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/password-generator",
  },
}

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />
}
