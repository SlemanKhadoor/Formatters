"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Type, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"

export function LoremGenerator() {
  const [generatedText, setGeneratedText] = useState("")
  const [count, setCount] = useState(3)
  const [type, setType] = useState("paragraphs")
  const [startWithLorem, setStartWithLorem] = useState(true)
  const { toast } = useToast()

  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
    "at",
    "vero",
    "eos",
    "accusamus",
    "accusantium",
    "doloremque",
    "laudantium",
    "totam",
    "rem",
    "aperiam",
    "eaque",
    "ipsa",
    "quae",
    "ab",
    "illo",
    "inventore",
    "veritatis",
    "et",
    "quasi",
    "architecto",
    "beatae",
    "vitae",
    "dicta",
    "sunt",
    "explicabo",
    "nemo",
    "ipsam",
    "voluptatem",
    "quia",
    "voluptas",
    "aspernatur",
    "aut",
    "odit",
    "fugit",
    "sed",
    "quia",
    "consequuntur",
    "magni",
    "dolores",
    "ratione",
    "sequi",
    "nesciunt",
    "neque",
    "porro",
    "quisquam",
    "dolorem",
    "adipisci",
    "numquam",
    "eius",
    "modi",
    "tempora",
    "incidunt",
    "magnam",
    "quaerat",
    "voluptatem",
  ]

  const generateWords = (wordCount: number): string => {
    const words = []

    if (startWithLorem && wordCount > 0) {
      words.push("Lorem")
      if (wordCount > 1) words.push("ipsum")
      if (wordCount > 2) words.push("dolor")
      if (wordCount > 3) words.push("sit")
      if (wordCount > 4) words.push("amet")
    }

    while (words.length < wordCount) {
      const randomWord = loremWords[Math.floor(Math.random() * loremWords.length)]
      words.push(randomWord)
    }

    return words.join(" ")
  }

  const generateSentence = (): string => {
    const sentenceLength = Math.floor(Math.random() * 15) + 5 // 5-20 words
    const sentence = generateWords(sentenceLength)
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + "."
  }

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3 // 3-8 sentences
    const sentences = []

    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }

    return sentences.join(" ")
  }

  const generateText = () => {
    let result = ""

    switch (type) {
      case "words":
        result = generateWords(count)
        break
      case "sentences":
        const sentences = []
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence())
        }
        result = sentences.join(" ")
        break
      case "paragraphs":
        const paragraphs = []
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph())
        }
        result = paragraphs.join("\n\n")
        break
    }

    setGeneratedText(result)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      toast({
        title: "Copied!",
        description: "Lorem ipsum text copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
      })
    }
  }

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCharacterCount = (text: string) => {
    return text.length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Type className="h-6 w-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Lorem Ipsum Generator</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {getWordCount(generatedText)} words
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lorem Ipsum Generator</h1>
              <p className="text-lg text-gray-600 mb-4">
                Generate placeholder text for your design and development projects.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Settings */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Generator Settings
                    </CardTitle>
                    <CardDescription>Customize your Lorem Ipsum text</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="type">Text Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="words">Words</SelectItem>
                          <SelectItem value="sentences">Sentences</SelectItem>
                          <SelectItem value="paragraphs">Paragraphs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="count">
                        Number of {type}: {count}
                      </Label>
                      <Input
                        id="count"
                        type="range"
                        min="1"
                        max={type === "words" ? "100" : type === "sentences" ? "20" : "10"}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>{type === "words" ? "100" : type === "sentences" ? "20" : "10"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="start-lorem" checked={startWithLorem} onCheckedChange={setStartWithLorem} />
                      <Label htmlFor="start-lorem">Start with "Lorem ipsum"</Label>
                    </div>

                    <Button onClick={generateText} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Text
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Quick Generate</CardTitle>
                    <CardDescription>Common text lengths</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setType("paragraphs")
                        setCount(1)
                        generateText()
                      }}
                    >
                      1 Paragraph
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setType("paragraphs")
                        setCount(3)
                        generateText()
                      }}
                    >
                      3 Paragraphs
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setType("words")
                        setCount(50)
                        generateText()
                      }}
                    >
                      50 Words
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setType("sentences")
                        setCount(5)
                        generateText()
                      }}
                    >
                      5 Sentences
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Generated Text */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Text</CardTitle>
                        <CardDescription>
                          {generatedText && (
                            <>
                              {getWordCount(generatedText)} words, {getCharacterCount(generatedText)} characters
                            </>
                          )}
                        </CardDescription>
                      </div>
                      {generatedText && (
                        <Button onClick={copyToClipboard} variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generatedText}
                      readOnly
                      className="min-h-[400px] resize-none"
                      placeholder="Click 'Generate Text' to create Lorem Ipsum placeholder text..."
                    />
                  </CardContent>
                </Card>

                {/* About Lorem Ipsum */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>About Lorem Ipsum</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the
                      industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                      and scrambled it to make a type specimen book.
                    </p>
                    <p>
                      It is a long established fact that a reader will be distracted by the readable content of a page
                      when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                      distribution of letters, as opposed to using 'Content here, content here'.
                    </p>
                    <p>
                      <strong>Common uses:</strong> Web design mockups, print layouts, placeholder content, typography
                      testing, and content management system templates.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
