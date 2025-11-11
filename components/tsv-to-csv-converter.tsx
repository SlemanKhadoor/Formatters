"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, FileSpreadsheet, ArrowRight, ArrowLeft, Code, CheckCircle, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function TsvToCsvConverter() {
  const [tsvInput, setTsvInput] = useState("")
  const [csvOutput, setCsvOutput] = useState("")
  const [error, setError] = useState("")
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const [customDelimiter, setCustomDelimiter] = useState(",")

  const convertToCsv = () => {
    try {
      setError("")

      if (!tsvInput.trim()) {
        setError("Please enter TSV data")
        return
      }

      const lines = tsvInput.trim().split("\n")
      const csvLines: string[] = []

      for (const line of lines) {
        // Split by tabs
        const fields = line.split("\t")

        // Escape fields that contain the delimiter, quotes, or newlines
        const escapedFields = fields.map((field) => {
          // Remove any existing quotes and escape internal quotes
          const cleanField = field.replace(/"/g, '""')

          // Quote the field if it contains delimiter, quotes, or newlines
          if (
            cleanField.includes(customDelimiter) ||
            cleanField.includes('"') ||
            cleanField.includes("\n") ||
            cleanField.includes("\r")
          ) {
            return `"${cleanField}"`
          }

          return cleanField
        })

        csvLines.push(escapedFields.join(customDelimiter))
      }

      setCsvOutput(csvLines.join("\n"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error converting TSV to CSV")
      setCsvOutput("")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvOutput)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadCsv = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sampleTsv = `Name	Age	City	Country
John Doe	30	New York	USA
Jane Smith	25	London	UK
Bob Johnson	35	Toronto	Canada
Alice Brown	28	Sydney	Australia`

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        formatterName={'TSV to CSV Converter'}
        icon={<FileSpreadsheet className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
      // statusBadge={
      //   isValid ? (
      //     <Badge variant="secondary" className="bg-green-100 text-green-800">
      //       <CheckCircle className="h-3 w-3 mr-1" />
      //       Valid
      //     </Badge>
      //   ) : (
      //     <Badge variant="destructive">
      //       <AlertCircle className="h-3 w-3 mr-1" />
      //       Invalid
      //     </Badge>
      //   )
      // }
      />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">TSV to CSV Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Convert TSV data to clean and well-structured CSV format for easier data handling
              </p>
              <p className="text-gray-500">
                Transform your TSV data into clean, well-structured CSV format effortlessly with our professional TSV to CSV Converter. This tool is perfect for developers, data analysts, and anyone working with spreadsheets, databases, or APIs that require standardized CSV files. Simply paste or upload your TSV data, click convert, and instantly get a properly formatted CSV file ready for import or analysis. The converter automatically handles tabs, quotes, and escape characters, ensuring accuracy and consistency in your output. All processing happens locally in your browser, guaranteeing privacy, speed, and reliability. Whether you’re preparing data for Excel, Google Sheets, or backend systems, this tool streamlines your workflow, saves time, and delivers precise, clean CSV data with just one click.
              </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    TSV Input
                  </CardTitle>
                  <CardDescription>Enter your Tab-Separated Values data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your TSV data here..."
                    value={tsvInput}
                    onChange={(e) => setTsvInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="headers"
                        checked={includeHeaders}
                        onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
                      />
                      <label htmlFor="headers" className="text-sm">
                        First row contains headers
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <label htmlFor="delimiter" className="text-sm text-nowrap">
                        CSV Delimiter:
                      </label>
                      <select
                        id="delimiter"
                        value={customDelimiter}
                        onChange={(e) => setCustomDelimiter(e.target.value)}
                        className="px-2 min-w-32 py-1 border rounded text-sm w-fit"
                      >
                        <option value=",">Comma (,)</option>
                        <option value=";">Semicolon (;)</option>
                        <option value="|">Pipe (|)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={convertToCsv} className="flex-1 !text-nowrap !p-3">
                      <ArrowRight className="!h-3 !w-3" />
                      Convert to CSV
                    </Button>
                    <Button variant="outline" className="!text-nowrap !p-3" onClick={() => setTsvInput(sampleTsv)}>
                      Load Sample
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    CSV Output
                  </CardTitle>
                  <CardDescription>Generated CSV data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <Textarea
                    value={csvOutput}
                    readOnly
                    placeholder="CSV data will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {csvOutput && (
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy CSV
                      </Button>
                      <Button onClick={downloadCsv} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <section className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      Tab → {customDelimiter === "," ? "Comma" : customDelimiter === ";" ? "Semicolon" : "Pipe"}
                    </Badge>
                    <Badge variant="secondary">Auto Escaping</Badge>
                    <Badge variant="secondary">Quote Protection</Badge>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-4">
                    <li>• Converts tab characters to your chosen delimiter</li>
                    <li>• Automatically quotes fields containing special characters</li>
                    <li>• Escapes internal quotes by doubling them</li>
                    <li>• Preserves data integrity during conversion</li>
                    <li>• Handles multi-line fields properly</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
