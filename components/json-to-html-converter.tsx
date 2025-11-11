"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, FileCode, FileText, Table } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function JsonToHtmlConverter() {
  const [jsonInput, setJsonInput] = useState("")
  const [htmlOutput, setHtmlOutput] = useState("")
  const [error, setError] = useState("")
  const [includeStyles, setIncludeStyles] = useState(true)
  const [responsive, setResponsive] = useState(true)

  const convertToHtml = () => {
    try {
      setError("")

      if (!jsonInput.trim()) {
        setError("Please enter JSON data")
        return
      }

      const data = JSON.parse(jsonInput)

      if (!Array.isArray(data)) {
        setError("JSON must be an array of objects")
        return
      }

      if (data.length === 0) {
        setError("JSON array cannot be empty")
        return
      }

      // Get all unique keys from all objects
      const allKeys = new Set<string>()
      data.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((key) => allKeys.add(key))
        }
      })

      const keys = Array.from(allKeys)

      let html = ""

      if (includeStyles) {
        html += `<style>
.json-table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
  font-family: Arial, sans-serif;
}

.json-table th,
.json-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.json-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.json-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.json-table tr:hover {
  background-color: #f5f5f5;
}

${responsive
            ? `
@media screen and (max-width: 600px) {
  .json-table {
    font-size: 14px;
  }
  
  .json-table th,
  .json-table td {
    padding: 8px;
  }
}
`
            : ""
          }
</style>

`
      }

      html += `<table class="json-table">
  <thead>
    <tr>
${keys.map((key) => `      <th>${escapeHtml(key)}</th>`).join("\n")}
    </tr>
  </thead>
  <tbody>
${data
          .map(
            (item) => `    <tr>
${keys.map((key) => `      <td>${escapeHtml(String(item[key] || ""))}</td>`).join("\n")}
    </tr>`,
          )
          .join("\n")}
  </tbody>
</table>`

      setHtmlOutput(html)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format")
      setHtmlOutput("")
    }
  }

  const escapeHtml = (text: string): string => {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadHtml = () => {
    const blob = new Blob([htmlOutput], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sampleJson = `[
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        formatterName={'JSON to HTML Converter'}
        icon={<FileCode className="sm:h-5 sm:w-5 h-4 w-4 text-orange-600" />}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JSON to HTML Converter</h1>
              <p className="text-lg text-gray-600 mb-4">
                Generate HTML structure from JSON data for web display and visualization
              </p>
              <p className="text-gray-500">
                Transform your JSON data into clean, well-structured HTML quickly and efficiently with our professional JSON to HTML Converter. This powerful tool is perfect for developers working on web interfaces, dashboards, or data visualization projects that require converting JSON into readable and visually formatted HTML. Simply paste your JSON, click convert, and instantly generate elegant HTML tables, lists, or blocks that represent your data clearly. The converter automatically handles nested objects, arrays, and complex data types, ensuring the output is well-organized, semantic, and easy to integrate into your website or application. All processing happens locally in your browser, guaranteeing privacy, speed, and reliability. Whether you’re building admin panels, reports, or dynamic content sections, this tool streamlines your workflow, saves time, and delivers ready-to-use HTML effortlessly.
              </p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    JSON Input
                  </CardTitle>
                  <CardDescription>Enter your JSON array data (must be an array of objects)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste your JSON array here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="styles"
                        checked={includeStyles}
                        onCheckedChange={(checked) => setIncludeStyles(checked as boolean)}
                      />
                      <label htmlFor="styles" className="text-sm">
                        Include CSS styles
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="responsive"
                        checked={responsive}
                        onCheckedChange={(checked) => setResponsive(checked as boolean)}
                      />
                      <label htmlFor="responsive" className="text-sm">
                        Responsive design
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-row flex-col">
                    <Button onClick={convertToHtml} >
                      <Table className="h-4 w-4 mr-2" />
                      Convert to HTML
                    </Button>
                    <Button variant="outline" onClick={() => setJsonInput(sampleJson)}>
                      Load Sample
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="h-5 w-5" />
                    HTML Output
                  </CardTitle>
                  <CardDescription>Generated HTML table code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    placeholder="HTML table will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                  />
                  {htmlOutput && (
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy HTML
                      </Button>
                      <Button onClick={downloadHtml} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {htmlOutput && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your HTML table will look</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="border rounded-md p-4 bg-white dark:bg-gray-900"
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Usage Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Array Required</Badge>
                  <Badge variant="secondary">Object Structure</Badge>
                  <Badge variant="secondary">CSS Included</Badge>
                  <Badge variant="secondary">Responsive</Badge>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-4">
                  <li>• Input must be a valid JSON array of objects</li>
                  <li>• All objects will be converted to table rows</li>
                  <li>• Missing properties will show as empty cells</li>
                  <li>• CSS styles make the table look professional</li>
                  <li>• Responsive option adds mobile-friendly styles</li>
                </ul>
              </CardContent>
            </Card>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
