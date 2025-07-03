"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function YamlToJsonConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const yamlToJson = useCallback((yaml: string): any => {
    try {
      // Basic YAML parser (simplified for common cases)
      const lines = yaml.split("\n")
      const result: any = {}
      let currentObj = result
      const stack: any[] = [result]
      const currentIndent = 0
      let lastIndentLevel = 0

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line.trim() || line.trim().startsWith("#")) continue

        // Calculate indentation level
        const indent = line.search(/\S|$/)
        const indentLevel = Math.floor(indent / 2)

        // Handle indentation changes
        if (indentLevel > lastIndentLevel) {
          stack.push(currentObj)
        } else if (indentLevel < lastIndentLevel) {
          for (let j = 0; j < lastIndentLevel - indentLevel; j++) {
            stack.pop()
          }
        }

        currentObj = stack[stack.length - 1]
        lastIndentLevel = indentLevel

        // Parse the line
        const trimmedLine = line.trim()

        // Handle array items
        if (trimmedLine.startsWith("- ")) {
          const value = trimmedLine.substring(2).trim()

          // Check if this is a complex array item or simple value
          if (value.includes(":")) {
            // Complex object in array
            const key = value.split(":")[0].trim()
            const val = value.split(":").slice(1).join(":").trim()

            if (!currentObj.items) currentObj.items = []
            const newItem: any = {}
            newItem[key] = parseValue(val)
            currentObj.items.push(newItem)
            currentObj = newItem
          } else {
            // Simple value in array
            if (!currentObj.items) currentObj.items = []
            currentObj.items.push(parseValue(value))
          }
        }
        // Handle key-value pairs
        else if (trimmedLine.includes(":")) {
          const key = trimmedLine.split(":")[0].trim()
          const value = trimmedLine.split(":").slice(1).join(":").trim()

          if (value) {
            // Simple key-value
            currentObj[key] = parseValue(value)
          } else {
            // Key with nested values
            currentObj[key] = {}
            currentObj = currentObj[key]
          }
        }
      }

      // Convert the internal representation to proper JSON
      function cleanupResult(obj: any): any {
        if (Array.isArray(obj)) {
          return obj.map(cleanupResult)
        }

        if (typeof obj === "object" && obj !== null) {
          const result: any = {}

          // Handle special case for arrays
          if (obj.items && Array.isArray(obj.items)) {
            return obj.items.map(cleanupResult)
          }

          for (const key in obj) {
            result[key] = cleanupResult(obj[key])
          }

          return result
        }

        return obj
      }

      return cleanupResult(result)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "YAML parsing error")
    }
  }, [])

  // Helper function to parse YAML values
  function parseValue(value: string): any {
    if (!value) return null

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.substring(1, value.length - 1)
    }

    // Handle booleans
    if (value.toLowerCase() === "true") return true
    if (value.toLowerCase() === "false") return false

    // Handle null
    if (value.toLowerCase() === "null" || value === "~") return null

    // Handle numbers
    if (!isNaN(Number(value))) return Number(value)

    // Handle arrays inline
    if (value.startsWith("[") && value.endsWith("]")) {
      return value
        .substring(1, value.length - 1)
        .split(",")
        .map((item) => parseValue(item.trim()))
    }

    return value
  }

  const handleConvert = useCallback(
    (code: string) => {
      if (!code.trim()) {
        setOutput("")
        setIsValid(true)
        setError("")
        return
      }

      try {
        const jsonObj = yamlToJson(code)
        const jsonStr = JSON.stringify(jsonObj, null, 2)
        setOutput(jsonStr)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid YAML or conversion error")
        setOutput("")
      }
    },
    [yamlToJson],
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
    const example = `# Sample YAML configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
data:
  database:
    host: localhost
    port: 5432
    name: myapp
  features:
    - auth
    - logging
    - metrics
  debug: true
  environments:
    - name: production
      url: https://example.com
      replicas: 3
    - name: staging
      url: https://staging.example.com
      replicas: 1`
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'JSON to CSV Converter'}
        icon={<FileText className="sm:h-5 sm:w-5 h-4 w-4 text-purple-600" />}
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
        }
      />

      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">YAML to JSON Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Convert YAML data to JSON format for configuration files and API development
              </p>
              <p className="text-gray-500">
                Transform your YAML data into well-structured JSON. Perfect for configuration files, API development,
                and DevOps tools.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">YAML Input</CardTitle>
                        <CardDescription>Paste your YAML data here</CardDescription>
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
                      placeholder="Enter your YAML data here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="YAML input"
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
                        <CardTitle className="mb-2">JSON Output</CardTitle>
                        <CardDescription>Generated JSON data ready for download</CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
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
                  <CardTitle>How to Use YAML to JSON Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Converts YAML data to well-structured JSON</li>
                        <li>Handles nested objects and arrays</li>
                        <li>Preserves data types (strings, numbers, booleans)</li>
                        <li>Supports comments in YAML input</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Converting configuration files</li>
                        <li>API development and testing</li>
                        <li>DevOps and infrastructure as code</li>
                        <li>Data migration between formats</li>
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
