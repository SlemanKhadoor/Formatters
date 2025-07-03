"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function JsonToTypescriptConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const getTypeName = (key: string): string => {
    return capitalizeFirst(key.replace(/[^a-zA-Z0-9]/g, ""))
  }

  const getTypeFromValue = useCallback((value: any, key = "Root"): string => {
    if (value === null) return "null"
    if (typeof value === "boolean") return "boolean"
    if (typeof value === "number") return "number"
    if (typeof value === "string") return "string"

    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"
      const firstItem = value[0]
      const itemType = getTypeFromValue(firstItem, key.replace(/s$/, ""))
      return `${itemType}[]`
    }

    if (typeof value === "object") {
      return getTypeName(key)
    }

    return "any"
  }, [])

  const generateInterface = useCallback(
    (obj: any, name = "Root", interfaces: Set<string> = new Set()): string => {
      if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        return ""
      }

      const interfaceName = getTypeName(name)
      if (interfaces.has(interfaceName)) {
        return ""
      }

      interfaces.add(interfaceName)

      let result = `interface ${interfaceName} {\n`

      for (const [key, value] of Object.entries(obj)) {
        const type = getTypeFromValue(value, key)
        result += `  ${key}: ${type}\n`

        // Generate nested interfaces
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          const nestedInterface = generateInterface(value, key, interfaces)
          if (nestedInterface) {
            result = nestedInterface + "\n" + result
          }
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
          const nestedInterface = generateInterface(value[0], key.replace(/s$/, ""), interfaces)
          if (nestedInterface) {
            result = nestedInterface + "\n" + result
          }
        }
      }

      result += "}"
      return result
    },
    [getTypeFromValue],
  )

  const jsonToTypescript = useCallback(
    (obj: any): string => {
      const interfaces = new Set<string>()
      return generateInterface(obj, "Root", interfaces)
    },
    [generateInterface],
  )

  const handleConvert = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setOutput("")
        setIsValid(true)
        setError("")
        return
      }

      try {
        const parsed = JSON.parse(code)
        const typescript = jsonToTypescript(parsed)
        setOutput(typescript)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid JSON or conversion error")
        setOutput("")
      }
    },
    [jsonToTypescript],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    handleConvert(value)
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "TypeScript interfaces copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/typescript" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "interfaces.ts"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "TypeScript file downloaded successfully",
      })
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setIsValid(true)
    setError("")
  }

  const handleLoadExample = () => {
    const example = `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profile": {
      "age": 30,
      "bio": "Software developer",
      "location": {
        "city": "New York",
        "country": "USA"
      }
    },
    "posts": [
      {
        "id": 1,
        "title": "Hello World",
        "content": "This is my first post",
        "published": true,
        "tags": ["intro", "hello"]
      }
    ]
  }
}`
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'JSON to TS Converter'}
        icon={<Code className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
        statusBadge={
          isValid ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid
            </Badge>
          )
        } />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON to TypeScript Converter</h1>
              <p className="text-lg text-gray-500 mb-4">
                Generate TypeScript interfaces and types from JSON data for better type safety
              </p>
              <p className="text-gray-500">
                Transform your JSON data into TypeScript interfaces automatically. Perfect for API development, type
                definitions, and ensuring type safety in your applications.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">JSON Input</CardTitle>
                        <CardDescription>Paste your JSON data here</CardDescription>
                      </div>

                      <div className="flex flex-wrap gap-2">
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
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={input}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Enter your JSON data here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="JSON input"
                    />
                    {error && (
                      <div
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex-shrink-0"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 inline mr-2" />
                        <strong>Error:</strong> {error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Output Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex items-start justify-between flex-col">
                      <div>
                        <CardTitle className="mb-2">TypeScript Output</CardTitle>
                        <CardDescription>Generated TypeScript interfaces</CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                          <Download className="h-4 w-4" />
                          Download .ts
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="TypeScript interfaces will appear here..."
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label="TypeScript output"
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>How to Use JSON to TypeScript Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Generates TypeScript interfaces from JSON objects</li>
                        <li>Handles nested objects and arrays</li>
                        <li>Automatically infers types from values</li>
                        <li>Creates separate interfaces for nested objects</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Perfect for:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>API response type definitions</li>
                        <li>Configuration object types</li>
                        <li>Database model interfaces</li>
                        <li>Type-safe development</li>
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
