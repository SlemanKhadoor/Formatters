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

export default function JsonToYamlConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const jsonToYaml = useCallback((obj: any, indent = 0): string => {
    const spaces = "  ".repeat(indent)

    if (obj === null) return "null"
    if (typeof obj === "boolean") return obj.toString()
    if (typeof obj === "number") return obj.toString()
    if (typeof obj === "string") {
      // Check if string needs quotes
      if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.trim() !== obj) {
        return `"${obj.replace(/"/g, '\\"')}"`
      }
      return obj
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]"
      return obj.map((item) => `${spaces}- ${jsonToYaml(item, indent + 1).replace(/^\s+/, "")}`).join("\n")
    }

    if (typeof obj === "object") {
      const entries = Object.entries(obj)
      if (entries.length === 0) return "{}"

      return entries
        .map(([key, value]) => {
          const yamlValue = jsonToYaml(value, indent + 1)
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return `${spaces}${key}:\n${yamlValue}`
          } else if (Array.isArray(value) && value.length > 0) {
            return `${spaces}${key}:\n${yamlValue}`
          } else {
            return `${spaces}${key}: ${yamlValue}`
          }
        })
        .join("\n")
    }

    return String(obj)
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
        const yaml = jsonToYaml(parsed)
        setOutput(yaml)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid JSON or conversion error")
        setOutput("")
      }
    },
    [jsonToYaml],
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
        description: "YAML data copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "application/x-yaml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "converted.yaml"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "YAML file downloaded successfully",
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
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "app-config",
    "namespace": "default"
  },
  "data": {
    "database": {
      "host": "localhost",
      "port": 5432,
      "name": "myapp"
    },
    "features": ["auth", "logging", "metrics"],
    "debug": true
  }
}`
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
                <FileText className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">JSON to YAML Converter</h1>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON to YAML Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Convert JSON data to YAML format for configuration files and DevOps tools
              </p>
              <p className="text-gray-500">
                Transform your JSON data into clean, readable YAML. Perfect for Docker Compose, Kubernetes, CI/CD
                pipelines, and configuration files.
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
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="mb-2">YAML Output</CardTitle>
                        <CardDescription>Generated YAML data ready for download</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                          <Download className="h-4 w-4" />
                          Download YAML
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="YAML output will appear here..."
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label="YAML output"
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>How to Use JSON to YAML Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Converts any valid JSON to clean YAML</li>
                        <li>Proper indentation and formatting</li>
                        <li>Handles nested objects and arrays</li>
                        <li>Smart string quoting when needed</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Perfect for:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Docker Compose files</li>
                        <li>Kubernetes manifests</li>
                        <li>CI/CD pipeline configurations</li>
                        <li>Application config files</li>
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
