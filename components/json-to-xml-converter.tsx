"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, RotateCcw, CheckCircle, AlertCircle, FileCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"


export default function JsonToXmlConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const jsonToXml = useCallback((obj: any, rootName = "root"): string => {
    const convertValue = (value: any, key: string): string => {
      if (value === null) {
        return `<${key} />`
      }

      if (typeof value === "object") {
        if (Array.isArray(value)) {
          return value.map((item) => convertValue(item, key)).join("")
        } else {
          const content = Object.entries(value)
            .map(([k, v]) => convertValue(v, k))
            .join("")
          return `<${key}>${content}</${key}>`
        }
      }

      return `<${key}>${String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</${key}>`
    }

    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${obj.map((item) => convertValue(item, "item")).join("\n")}\n</${rootName}>`
      } else {
        const content = Object.entries(obj)
          .map(([key, value]) => convertValue(value, key))
          .join("\n")
        return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${content}\n</${rootName}>`
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${String(obj)}</${rootName}>`
  }, [])

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
        const xml = jsonToXml(parsed)
        setOutput(xml)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid JSON or conversion error")
        setOutput("")
      }
    },
    [jsonToXml],
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
        description: "XML data copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "converted.xml"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "XML file downloaded successfully",
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
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "profile": {
        "age": 30,
        "city": "New York"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "profile": {
        "age": 25,
        "city": "Los Angeles"
      }
    }
  ]
}`
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'JSON to XML Converter'}
        icon={<FileCode className="sm:h-5 sm:w-5 h-4 w-4 text-red-600" />}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON to XML Converter</h1>
              <p className="text-lg text-gray-500 mb-4">
                Convert JSON data to XML format for system integration and data interchange
              </p>
              <p className="text-gray-500">
                Transform your JSON data into well-formed XML. Perfect for APIs, data migration, and system integration
                projects.
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
                        <CardTitle className="mb-2">XML Output</CardTitle>
                        <CardDescription>Generated XML data ready for download</CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                          <Download className="h-4 w-4" />
                          Download XML
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="XML output will appear here..."
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label="XML output"
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>How to Use JSON to XML Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Converts any valid JSON to well-formed XML</li>
                        <li>Handles nested objects and arrays</li>
                        <li>Proper XML escaping for special characters</li>
                        <li>Includes XML declaration header</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>API data transformation</li>
                        <li>System integration projects</li>
                        <li>Data migration between formats</li>
                        <li>Configuration file conversion</li>
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
