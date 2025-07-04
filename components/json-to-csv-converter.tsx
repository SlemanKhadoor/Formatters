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

export default function JsonToCsvConverter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const jsonToCsv = useCallback((jsonData: any): string => {
    if (!Array.isArray(jsonData)) {
      throw new Error("CSV conversion requires an array of objects")
    }

    if (jsonData.length === 0) return ""

    // Get all unique keys from all objects
    const allKeys = new Set<string>()
    jsonData.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((key) => allKeys.add(key))
      }
    })

    const headers = Array.from(allKeys)
    const csvRows = [headers.join(",")]

    for (const row of jsonData) {
      const values = headers.map((header) => {
        const value = row?.[header] ?? ""
        if (typeof value === "string") {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      })
      csvRows.push(values.join(","))
    }

    return csvRows.join("\n")
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
        const csv = jsonToCsv(parsed)
        setOutput(csv)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid JSON or conversion error")
        setOutput("")
      }
    },
    [jsonToCsv],
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
        description: "CSV data copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "converted.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "CSV file downloaded successfully",
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
    const example = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "New York"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "city": "Los Angeles"
  },
  {
    "id": 3,
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 35,
    "city": "Chicago"
  }
]`
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'JSON to CSV Converter'}
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
      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON to CSV Converter</h1>
              <p className="text-lg text-gray-500 mb-4">
                Convert JSON arrays to CSV format for Excel, databases, and data analysis
              </p>
              <p className="text-gray-500">
                Transform your JSON data into CSV format instantly. Perfect for importing into Excel, databases, or any
                application that accepts CSV files.
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
                        <CardDescription>Paste your JSON array here (must be an array of objects)</CardDescription>
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
                      placeholder="Enter your JSON array here..."
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
                        <CardTitle className="mb-2">CSV Output</CardTitle>
                        <CardDescription>Generated CSV data ready for download</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
                          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                            <Download className="h-4 w-4" />
                            Download CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder="CSV output will appear here..."
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label="CSV output"
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>How to Use JSON to CSV Converter</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Requirements:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Input must be a valid JSON array</li>
                        <li>Array should contain objects with similar structure</li>
                        <li>All unique keys from all objects will become CSV columns</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Features:</h4>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Automatic header detection from object keys</li>
                        <li>Proper CSV escaping for special characters</li>
                        <li>Handles missing properties gracefully</li>
                        <li>Ready for Excel and database imports</li>
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
