"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Clock, BarChart3, Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function WordCounter() {
  const [text, setText] = useState("")
  const { toast } = useToast()

  const stats = useMemo(() => {
    if (!text) {
      return {
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0,
        mostCommonWords: [],
      }
    }

    // Character counts
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length

    // Word count
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length

    // Sentence count (basic - counts periods, exclamation marks, question marks)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length

    // Paragraph count (split by double line breaks)
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200)

    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150)

    // Most common words
    const wordFrequency: Record<string, number> = {}
    const cleanWords = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2) // Filter out short words

    cleanWords.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1
    })

    const mostCommonWords = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      mostCommonWords,
    }
  }, [text])

  const handleCopy = async (content: string, label: string) => {
    await navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  const handleClear = () => {
    setText("")
  }

  const handleLoadExample = () => {
    const example = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`
    setText(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Word Counter'}
        icon={<FileText className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
        statusBadge={
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <BarChart3 className="h-3 w-3 mr-1" />
            {stats.words} words
          </Badge>
        } />

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Word Counter & Text Statistics</h1>
              <p className="text-lg text-gray-500 mb-4">
                Count words, characters, and get comprehensive text statistics
              </p>
              <p className="text-gray-500">
                Analyze your text with detailed statistics including reading time, most common words, and more. Perfect
                for writers, students, and content creators.
              </p>
            </header>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Text Input Section */}
              <section className="lg:col-span-2">
                <Card className="border-0 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between flex-col sm:flex-row">
                      <div>
                        <CardTitle className="mb-2">Text Input</CardTitle>
                        <CardDescription>Paste or type your text here for analysis</CardDescription>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleLoadExample}>
                          Load Example
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClear}>
                          <RotateCcw className="h-4 w-4" />
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter your text here to get word count and statistics..."
                      className="min-h-[500px] font-mono text-sm resize-none"
                      aria-label="Text input for analysis"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Statistics Section */}
              <section className="space-y-6">
                {/* Basic Stats */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Text Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.words.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Words</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.characters.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Characters</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {stats.charactersNoSpaces.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">No Spaces</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{stats.sentences.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Sentences</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{stats.paragraphs.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Paragraphs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reading Time */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" />
                      Reading Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Reading (200 WPM)</span>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleCopy(`${stats.readingTime} minutes`, "Reading time")}
                      >
                        {stats.readingTime} min
                        <Copy className="h-3 w-3 ml-1" />
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Speaking (150 WPM)</span>
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleCopy(`${stats.speakingTime} minutes`, "Speaking time")}
                      >
                        {stats.speakingTime} min
                        <Copy className="h-3 w-3 ml-1" />
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Most Common Words */}
                {stats.mostCommonWords.length > 0 && (
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Most Common Words</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stats.mostCommonWords.map(({ word, count }, index) => (
                          <div key={word} className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {index + 1}. {word}
                            </span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleCopy(text, "Text")}
                      disabled={!text}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        handleCopy(
                          `Words: ${stats.words}, Characters: ${stats.characters}, Reading time: ${stats.readingTime} min`,
                          "Statistics",
                        )
                      }
                      disabled={!text}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Copy Stats
                    </Button>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>How to Use Word Counter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Real-time word and character counting</li>
                        <li>Reading and speaking time estimates</li>
                        <li>Most common words analysis</li>
                        <li>Paragraph and sentence counting</li>
                        <li>Copy statistics and text easily</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Academic writing and essays</li>
                        <li>Blog posts and articles</li>
                        <li>Social media content</li>
                        <li>Email and business writing</li>
                        <li>Content creation and editing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
