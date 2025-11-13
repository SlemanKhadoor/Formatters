"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, RotateCcw, AlertCircle, FileSpreadsheet, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"

export default function CsvToJsonConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const csvToJson = useCallback((csv: string): any[] => {
    try {
      // Split the CSV into lines
      const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "")

      if (lines.length === 0) {
        throw new Error("CSV is empty")
      }

      // Parse the header row
      const headers = parseCSVLine(lines[0])

      if (headers.length === 0) {
        throw new Error("Invalid CSV header")
      }

      // Parse the data rows
      const result = []
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i])

        // Skip empty lines
        if (values.length === 0) continue

        // Create an object for this row
        const obj: Record<string, string | number> = {}

        // Map values to headers
        for (let j = 0; j < headers.length; j++) {
          if (j < values.length) {
            // Try to convert to number if possible
            const value = values[j]
            if (value === "") {
              obj[headers[j]] = ""
            } else if (!isNaN(Number(value)) && value.trim() !== "") {
              obj[headers[j]] = Number(value)
            } else {
              obj[headers[j]] = value
            }
          } else {
            obj[headers[j]] = ""
          }
        }

        result.push(obj)
      }

      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "CSV parsing error")
    }
  }, [])

  // Helper function to parse a CSV line respecting quotes
  function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        // Handle quotes
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          // Double quotes inside quotes - add a single quote
          current += '"'
          i++
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(current)
        current = ""
      } else {
        // Add character to current field
        current += char
      }
    }

    // Add the last field
    result.push(current)

    return result
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
        const jsonArray = csvToJson(code)
        const jsonStr = JSON.stringify(jsonArray, null, 2)
        setOutput(jsonStr)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid CSV or conversion error")
        setOutput("")
      }
    },
    [csvToJson],
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
    const example = `id,name,email,age,city
1,John Doe,john@example.com,30,New York
2,Jane Smith,jane@example.com,25,Los Angeles
3,Bob Johnson,bob@example.com,35,Chicago
4,Alice Brown,alice@example.com,28,San Francisco
5,"Williams, Sarah",sarah@example.com,32,"Austin, TX"`
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'CSV to JSON Converter'}
        icon={<FileSpreadsheet className="sm:h-5 sm:w-5 h-4 w-4 text-green-600" />}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">CSV to JSON Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Convert CSV data to JSON format for data analysis and API development
              </p>
              <p className="text-gray-500">
                Transform your CSV data into well-structured JSON arrays quickly and efficiently with our professional CSV to JSON Converter. This powerful tool is ideal for developers, data analysts, and content creators who need to convert tabular CSV data into JSON for APIs, data analysis, or database operations. Simply paste your CSV data, click convert, and instantly receive clean, organized JSON arrays that are easy to read, integrate, and process in your projects. The converter automatically handles headers, nested values, and complex structures, ensuring accurate and reliable results every time. All processing happens locally in your browser, maintaining privacy, speed, and security. Whether you are preparing data for web applications, databases, or analytical tools, this converter streamlines your workflow, reduces errors, and ensures your data is properly structured, consistent, and ready for use efficiently and effortlessly.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">CSV Input</CardTitle>
                        <CardDescription>Paste your CSV data here</CardDescription>
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
                      placeholder="Enter your CSV data here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="CSV input"
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
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
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
                  <CardTitle>How to Use CSV to JSON Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Converts CSV data to JSON arrays with proper object structure</li>
                        <li>Automatically detects headers from the first row</li>
                        <li>Handles quoted values and commas within fields</li>
                        <li>Converts numeric values to numbers in JSON</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Cases:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Data analysis and visualization</li>
                        <li>API development and testing</li>
                        <li>Database import operations</li>
                        <li>Converting spreadsheet data for web applications</li>
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
