import WordCounter from "@/components/word-counter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Word Counter - Count Words, Characters & Text Statistics | Formatters.net",
  description:
    "Free online word counter tool. Count words, characters, paragraphs, and sentences. Get reading time estimates and text statistics for writing and content creation.",
  keywords: [
    "word counter",
    "online word counter",
    "word counter online",
    "article words count",
    "character counter",
    "text counter",
    "word count",
    "character count",
    "text statistics",
    "reading time",
  ],
  openGraph: {
    title: "Word Counter - Formatters.net",
    description:
      "Free online word counter. Count words, characters, and get text statistics with reading time estimates.",
    url: "https://formatters.net/tools/word-counter",
    type: "website",
  },
  alternates: {
    canonical: "https://formatters.net/tools/word-counter",
  },
}

export default function WordCounterPage() {
  return <WordCounter />
}
