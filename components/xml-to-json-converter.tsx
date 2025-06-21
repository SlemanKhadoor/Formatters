"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, FileCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"

export default function XmlToJsonConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const xmlToJson = useCallback((xml: string): any => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")

      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror")
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure")
      }

      // Convert XML to JSON
      function xmlToObj(node: Element): any {
        // Create an object to store the result
        const obj: any = {}

        // Process attributes
        if (node.attributes && node.attributes.length > 0) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            obj[`@${attr.nodeName}`] = attr.nodeValue
          }
        }

        // Process child nodes
        let hasChildren = false
        let textContent = ""

        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i]

          if (child.nodeType === 1) {
            // Element node
            hasChildren = true
            const childElement = child as Element
            const childName = childElement.nodeName

            const childObj = xmlToObj(childElement)

            if (obj[childName]) {
              // If this property already exists, convert it to an array
              if (!Array.isArray(obj[childName])) {
                obj[childName] = [obj[childName]]
              }
              obj[childName].push(childObj)
            } else {
              obj[childName] = childObj
            }
          } else if (child.nodeType === 3) {
            // Text node
            const text = child.nodeValue?.trim()
            if (text) {
              textContent += text
            }
          }
        }

        // If the node has no children but has text content, return the text
        if (!hasChildren && textContent) {
          return textContent
        }

        // If the node has text content and attributes or other properties
        if (textContent && Object.keys(obj).length > 0) {
          obj["#text"] = textContent
        }

        return obj
      }

      // Start with the root element
      const rootElement = xmlDoc.documentElement
      const result: any = {}
      result[rootElement.nodeName] = xmlToObj(rootElement)

      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "XML parsing error")
    }
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
        const jsonObj = xmlToJson(code)
        const jsonStr = JSON.stringify(jsonObj, null, 2)
        setOutput(jsonStr)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid XML or conversion error")
        setOutput("")
      }
    },
    [xmlToJson],
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
        description: "JSON data copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "converted.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "JSON file downloaded successfully",
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
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="1">
    <name>John Doe</name>
    <email>john@example.com</email>
    <profile>
      <age>30</age>
      <city>New York</city>
    </profile>
    <roles>
      <role>admin</role>
      <role>editor</role>
    </roles>
  </user>
  <user id="2">
    <name>Jane Smith</name>
    <email>jane@example.com</email>
    <profile>
      <age>25</age>
      <city>Los Angeles</city>
    </profile>
    <roles>
      <role>user</role>
    </roles>
  </user>
</users>`
    setInput(example)
    handleConvert(example)
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
                <FileCode className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">XML to JSON Converter</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isValid ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">XML to JSON Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Convert XML data to JSON format for API development and data integration
              </p>
              <p className="text-gray-500">
                Transform your XML data into well-structured JSON. Perfect for APIs, data migration, and system
                integration projects.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">XML Input</CardTitle>
                        <CardDescription>Paste your XML data here</CardDescription>
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
                      placeholder="Enter your XML data here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="XML input"
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="mb-2">JSON Output</CardTitle>
                        <CardDescription>Generated JSON data ready for download</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                          <Download className="h-4 w-4" />
                          Download JSON
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="JSON output will appear here..."
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label="JSON output"
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>How to Use XML to JSON Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Converts any valid XML to well-structured JSON</li>
                        <li>Preserves XML attributes as properties with @ prefix</li>
                        <li>Handles nested elements and arrays</li>
                        <li>Preserves text content with proper formatting</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Use Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>API data transformation</li>
                        <li>Legacy system integration</li>
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
