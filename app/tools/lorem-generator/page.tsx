import type { Metadata } from "next"
import { LoremGenerator } from "@/components/lorem-generator"

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Generate Placeholder Text Online",
  description:
    "Generate Lorem Ipsum placeholder text for design and development. Customize paragraphs, words, sentences, and choose from different text types.",
  keywords: ["lorem ipsum", "placeholder text", "dummy text", "lorem generator", "filler text", "design text"],
}

export default function LoremGeneratorPage() {
  return (
    <LoremGenerator />
  )
}
