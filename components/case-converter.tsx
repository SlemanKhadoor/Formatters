"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, RotateCcw, Type, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"


export default function CaseConverter() {
  const [input, setInput] = useState("")
  const { toast } = useToast()

  const convertCase = useCallback((text: string, caseType: string): string => {
    if (!text) return ""

    switch (caseType) {
      case "camelCase":
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          })
          .replace(/\s+/g, "")

      case "PascalCase":
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, "")

      case "snake_case":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("_")

      case "kebab-case":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("-")

      case "SCREAMING_SNAKE_CASE":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toUpperCase())
          .join("_")

      case "SCREAMING-KEBAB-CASE":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toUpperCase())
          .join("-")

      case "lowercase":
        return text.toLowerCase()

      case "UPPERCASE":
        return text.toUpperCase()

      case "Title Case":
        return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

      case "Sentence case":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

      case "aLtErNaTiNg CaSe":
        return text
          .split("")
          .map((char, index) => (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
          .join("")

      case "InVeRsE CaSe":
        return text
          .split("")
          .map((char) => (char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()))
          .join("")

      case "dot.case":
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join(".")

      default:
        return text
    }
  }, [])

  const caseTypes = [
    { name: "camelCase", description: "First word lowercase, subsequent words capitalized" },
    { name: "PascalCase", description: "All words capitalized, no spaces" },
    { name: "snake_case", description: "All lowercase with underscores" },
    { name: "kebab-case", description: "All lowercase with hyphens" },
    { name: "SCREAMING_SNAKE_CASE", description: "All uppercase with underscores" },
    { name: "SCREAMING-KEBAB-CASE", description: "All uppercase with hyphens" },
    { name: "lowercase", description: "All characters in lowercase" },
    { name: "UPPERCASE", description: "All characters in uppercase" },
    { name: "Title Case", description: "First letter of each word capitalized" },
    { name: "Sentence case", description: "First letter capitalized, rest lowercase" },
    { name: "aLtErNaTiNg CaSe", description: "Alternating uppercase and lowercase" },
    { name: "InVeRsE CaSe", description: "Inverts the case of each character" },
    { name: "dot.case", description: "All lowercase with dots" },
  ]

  const handleCopy = async (text: string, caseName: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: `${caseName} text copied to clipboard`,
    })
  }

  const handleClear = () => {
    setInput("")
  }

  const handleLoadExample = () => {
    setInput("Hello World Example Text")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header formatterName={'Case Converter'} icon={<Type className="sm:h-5 sm:w-5 h-4 w-4 text-green-600" />} />
      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Case Converter</h1>
              <p className="text-lg text-gray-500 mb-4">
                Convert text between different case formats for programming and writing
              </p>
              <p className="text-gray-500">
                Transform your text into various case formats including camelCase, snake_case, kebab-case, and more.
                Perfect for programming, variable naming, and text formatting.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <section className="lg:col-span-1">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Text Input</CardTitle>
                    <CardDescription>Enter the text you want to convert</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleLoadExample}>
                        Load Example
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <RotateCcw className="h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your text here..."
                      className="min-h-[200px] resize-none"
                      aria-label="Text input for case conversion"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Output Section */}
              <section className="lg:col-span-2">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Converted Text</CardTitle>
                    <CardDescription>All case format variations of your text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {caseTypes.map((caseType) => {
                        const convertedText = convertCase(input, caseType.name)
                        return (
                          <div key={caseType.name} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-gray-400">{caseType.name}</h4>
                                <p className="text-sm text-gray-600">{caseType.description}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(convertedText, caseType.name)}
                                disabled={!input}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="bg-gray-100 rounded p-3 font-mono text-sm break-all">
                              {convertedText || (
                                <span className="text-gray-400 italic">
                                  Enter text to see {caseType.name} conversion
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Case Conversion Guide</CardTitle>
                </CardHeader>
                <CardContent >
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Programming Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          <strong>camelCase:</strong> JavaScript variables, Java methods
                        </li>
                        <li>
                          <strong>PascalCase:</strong> Class names, React components
                        </li>
                        <li>
                          <strong>snake_case:</strong> Python variables, database columns
                        </li>
                        <li>
                          <strong>kebab-case:</strong> CSS classes, URL slugs
                        </li>
                        <li>
                          <strong>SCREAMING_SNAKE_CASE:</strong> Constants, environment variables
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Writing Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          <strong>Title Case:</strong> Headings, book titles
                        </li>
                        <li>
                          <strong>Sentence case:</strong> Regular sentences
                        </li>
                        <li>
                          <strong>UPPERCASE:</strong> Emphasis, acronyms
                        </li>
                        <li>
                          <strong>lowercase:</strong> Casual text, tags
                        </li>
                        <li>
                          <strong>aLtErNaTiNg CaSe:</strong> Mocking text, emphasis
                        </li>
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
