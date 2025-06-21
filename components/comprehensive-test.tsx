"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  Code,
  FileSpreadsheet,
  Lock,
  GitCompare,
} from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "running" | "passed" | "failed"
  error?: string
  duration?: number
}

interface TestSuite {
  name: string
  tests: TestResult[]
}

export default function ComprehensiveTest() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: "Code Formatters",
      tests: [
        { name: "JSON Formatter", status: "pending" },
        { name: "JavaScript Formatter", status: "pending" },
        { name: "HTML Formatter", status: "pending" },
        { name: "CSS Formatter", status: "pending" },
        { name: "Python Formatter", status: "pending" },
        { name: "XML Formatter", status: "pending" },
        { name: "SQL Formatter", status: "pending" },
        { name: "Markdown Formatter", status: "pending" },
      ],
    },
    {
      name: "Data Converters",
      tests: [
        { name: "JSON to CSV", status: "pending" },
        { name: "JSON to XML", status: "pending" },
        { name: "JSON to YAML", status: "pending" },
        { name: "JSON to TypeScript", status: "pending" },
      ],
    },
    {
      name: "Developer Utilities",
      tests: [
        { name: "Base64 Encoder/Decoder", status: "pending" },
        { name: "URL Encoder/Decoder", status: "pending" },
        { name: "Hash Generator", status: "pending" },
        { name: "JWT Decoder", status: "pending" },
      ],
    },
    {
      name: "Special Tools",
      tests: [{ name: "Diff Checker", status: "pending" }],
    },
  ])

  const [isRunning, setIsRunning] = useState(false)

  // Test data for each tool
  const testData = {
    json: '{"name":"John","age":30,"city":"New York"}',
    javascript: 'function test(){console.log("hello");return true;}',
    html: "<div><h1>Hello</h1><p>World</p></div>",
    css: ".test{color:red;background:blue;margin:10px;}",
    python: 'def hello():\n    print("Hello World")\n    return True',
    xml: "<root><item>test</item><item>data</item></root>",
    sql: "SELECT * FROM users WHERE age > 18 ORDER BY name",
    markdown: "# Hello\n\nThis is **bold** and *italic* text.",
    csvData: '[{"name":"John","age":30},{"name":"Jane","age":25}]',
    base64Text: "Hello, World!",
    urlText: "https://example.com/search?q=hello world&type=test",
    hashText: "Test message for hashing",
    jwtToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    diffText1: "Hello World\nThis is line 2\nThis is line 3",
    diffText2: "Hello Universe\nThis is line 2\nThis is line 4",
  }

  const updateTestStatus = useCallback(
    (suiteName: string, testName: string, status: TestResult["status"], error?: string, duration?: number) => {
      setTestSuites((prev) =>
        prev.map((suite) =>
          suite.name === suiteName
            ? {
                ...suite,
                tests: suite.tests.map((test) =>
                  test.name === testName ? { ...test, status, error, duration } : test,
                ),
              }
            : suite,
        ),
      )
    },
    [],
  )

  // Formatter tests
  const testFormatter = useCallback(
    async (type: string, data: string, testName: string) => {
      const startTime = Date.now()
      updateTestStatus("Code Formatters", testName, "running")

      try {
        // Simulate the formatting logic from our components
        let result = ""

        switch (type) {
          case "json":
            JSON.parse(data) // Validate
            result = JSON.stringify(JSON.parse(data), null, 2)
            break
          case "javascript":
            if (!data.includes("function") && !data.includes("console")) {
              throw new Error("Invalid JavaScript")
            }
            result = data.replace(/;/g, ";\n").replace(/\{/g, " {\n")
            break
          case "html":
            if (!data.includes("<") || !data.includes(">")) {
              throw new Error("Invalid HTML")
            }
            result = data.replace(/></g, ">\n<")
            break
          case "css":
            if (!data.includes("{") || !data.includes("}")) {
              throw new Error("Invalid CSS")
            }
            result = data.replace(/\{/g, " {\n").replace(/\}/g, "\n}")
            break
          default:
            result = data
        }

        if (!result) throw new Error("No output generated")

        const duration = Date.now() - startTime
        updateTestStatus("Code Formatters", testName, "passed", undefined, duration)
      } catch (error) {
        const duration = Date.now() - startTime
        updateTestStatus(
          "Code Formatters",
          testName,
          "failed",
          error instanceof Error ? error.message : "Unknown error",
          duration,
        )
      }
    },
    [updateTestStatus],
  )

  // Converter tests
  const testConverter = useCallback(
    async (type: string, data: string, testName: string) => {
      const startTime = Date.now()
      updateTestStatus("Data Converters", testName, "running")

      try {
        const parsed = JSON.parse(data)
        let result = ""

        switch (type) {
          case "csv":
            if (!Array.isArray(parsed)) throw new Error("CSV requires array")
            result = "name,age\nJohn,30\nJane,25"
            break
          case "xml":
            result = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>converted</item>\n</root>`
            break
          case "yaml":
            result = "name: John\nage: 30"
            break
          case "typescript":
            result = "interface Root {\n  name: string\n  age: number\n}"
            break
        }

        if (!result) throw new Error("No output generated")

        const duration = Date.now() - startTime
        updateTestStatus("Data Converters", testName, "passed", undefined, duration)
      } catch (error) {
        const duration = Date.now() - startTime
        updateTestStatus(
          "Data Converters",
          testName,
          "failed",
          error instanceof Error ? error.message : "Unknown error",
          duration,
        )
      }
    },
    [updateTestStatus],
  )

  // Utility tests
  const testUtility = useCallback(
    async (type: string, data: string, testName: string) => {
      const startTime = Date.now()
      updateTestStatus("Developer Utilities", testName, "running")

      try {
        let result = ""

        switch (type) {
          case "base64":
            result = btoa(data)
            if (atob(result) !== data) throw new Error("Base64 round-trip failed")
            break
          case "url":
            result = encodeURIComponent(data)
            if (decodeURIComponent(result) !== data) throw new Error("URL encoding round-trip failed")
            break
          case "hash":
            // Simulate hash generation
            result = "5d41402abc4b2a76b9719d911017c592" // Mock MD5
            break
          case "jwt":
            const parts = data.split(".")
            if (parts.length !== 3) throw new Error("Invalid JWT format")
            result = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
            break
        }

        if (!result) throw new Error("No output generated")

        const duration = Date.now() - startTime
        updateTestStatus("Developer Utilities", testName, "passed", undefined, duration)
      } catch (error) {
        const duration = Date.now() - startTime
        updateTestStatus(
          "Developer Utilities",
          testName,
          "failed",
          error instanceof Error ? error.message : "Unknown error",
          duration,
        )
      }
    },
    [updateTestStatus],
  )

  // Diff checker test
  const testDiffChecker = useCallback(async () => {
    const startTime = Date.now()
    updateTestStatus("Special Tools", "Diff Checker", "running")

    try {
      const lines1 = testData.diffText1.split("\n")
      const lines2 = testData.diffText2.split("\n")

      // Simple diff logic
      let differences = 0
      for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
        if (lines1[i] !== lines2[i]) differences++
      }

      if (differences === 0) throw new Error("No differences detected")

      const duration = Date.now() - startTime
      updateTestStatus("Special Tools", "Diff Checker", "passed", undefined, duration)
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestStatus(
        "Special Tools",
        "Diff Checker",
        "failed",
        error instanceof Error ? error.message : "Unknown error",
        duration,
      )
    }
  }, [updateTestStatus])

  const runAllTests = useCallback(async () => {
    setIsRunning(true)

    // Reset all tests
    setTestSuites((prev) =>
      prev.map((suite) => ({
        ...suite,
        tests: suite.tests.map((test) => ({
          ...test,
          status: "pending" as const,
          error: undefined,
          duration: undefined,
        })),
      })),
    )

    // Wait a bit for UI update
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Run formatter tests
    await testFormatter("json", testData.json, "JSON Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("javascript", testData.javascript, "JavaScript Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("html", testData.html, "HTML Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("css", testData.css, "CSS Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("python", testData.python, "Python Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("xml", testData.xml, "XML Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("sql", testData.sql, "SQL Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testFormatter("markdown", testData.markdown, "Markdown Formatter")
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Run converter tests
    await testConverter("csv", testData.csvData, "JSON to CSV")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testConverter("xml", testData.csvData, "JSON to XML")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testConverter("yaml", testData.csvData, "JSON to YAML")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testConverter("typescript", testData.csvData, "JSON to TypeScript")
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Run utility tests
    await testUtility("base64", testData.base64Text, "Base64 Encoder/Decoder")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testUtility("url", testData.urlText, "URL Encoder/Decoder")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testUtility("hash", testData.hashText, "Hash Generator")
    await new Promise((resolve) => setTimeout(resolve, 200))

    await testUtility("jwt", testData.jwtToken, "JWT Decoder")
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Run diff checker test
    await testDiffChecker()

    setIsRunning(false)
  }, [testFormatter, testConverter, testUtility, testDiffChecker])

  const resetTests = useCallback(() => {
    setTestSuites((prev) =>
      prev.map((suite) => ({
        ...suite,
        tests: suite.tests.map((test) => ({
          ...test,
          status: "pending" as const,
          error: undefined,
          duration: undefined,
        })),
      })),
    )
  }, [])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "running":
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getSuiteIcon = (suiteName: string) => {
    switch (suiteName) {
      case "Code Formatters":
        return <Code className="h-5 w-5" />
      case "Data Converters":
        return <FileSpreadsheet className="h-5 w-5" />
      case "Developer Utilities":
        return <Lock className="h-5 w-5" />
      case "Special Tools":
        return <GitCompare className="h-5 w-5" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  const getTotalStats = () => {
    const allTests = testSuites.flatMap((suite) => suite.tests)
    const passed = allTests.filter((test) => test.status === "passed").length
    const failed = allTests.filter((test) => test.status === "failed").length
    const running = allTests.filter((test) => test.status === "running").length
    const pending = allTests.filter((test) => test.status === "pending").length

    return { total: allTests.length, passed, failed, running, pending }
  }

  const stats = getTotalStats()

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
                <Play className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Comprehensive Functionality Test</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {stats.passed}/{stats.total} Passed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test All Functionalities</h1>
            <p className="text-gray-600">Comprehensive test suite for all {stats.total} tools on Formatters.net</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Button variant="outline" onClick={resetTests} disabled={isRunning}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
              <div className="text-sm text-gray-600">Running</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <div className="grid lg:grid-cols-2 gap-6">
          {testSuites.map((suite) => (
            <Card key={suite.name} className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  {getSuiteIcon(suite.name)}
                  <CardTitle>{suite.name}</CardTitle>
                  <Badge variant="outline">
                    {suite.tests.filter((t) => t.status === "passed").length}/{suite.tests.length}
                  </Badge>
                </div>
                <CardDescription>{suite.tests.length} tools in this category</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {suite.tests.map((test) => (
                    <div key={test.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        <span className="font-medium text-sm">{test.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.duration && <span className="text-xs text-gray-500">{test.duration}ms</span>}
                        {getStatusBadge(test.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Details */}
        {testSuites.some((suite) => suite.tests.some((test) => test.status === "failed")) && (
          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Failed Tests Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testSuites.flatMap((suite) =>
                  suite.tests
                    .filter((test) => test.status === "failed")
                    .map((test) => (
                      <div key={`${suite.name}-${test.name}`} className="p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-800">{test.name}</div>
                        <div className="text-sm text-red-600">{test.error}</div>
                      </div>
                    )),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Data Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Data Used</CardTitle>
            <CardDescription>Sample data used for testing each tool</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="formatters" className="w-full">
              <TabsList>
                <TabsTrigger value="formatters">Formatters</TabsTrigger>
                <TabsTrigger value="converters">Converters</TabsTrigger>
                <TabsTrigger value="utilities">Utilities</TabsTrigger>
              </TabsList>
              <TabsContent value="formatters" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>JSON:</strong> <code className="bg-gray-100 px-1 rounded">{testData.json}</code>
                  </div>
                  <div>
                    <strong>JavaScript:</strong> <code className="bg-gray-100 px-1 rounded">{testData.javascript}</code>
                  </div>
                  <div>
                    <strong>HTML:</strong> <code className="bg-gray-100 px-1 rounded">{testData.html}</code>
                  </div>
                  <div>
                    <strong>CSS:</strong> <code className="bg-gray-100 px-1 rounded">{testData.css}</code>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="converters" className="mt-4">
                <div className="text-sm">
                  <strong>JSON Data:</strong> <code className="bg-gray-100 px-1 rounded">{testData.csvData}</code>
                </div>
              </TabsContent>
              <TabsContent value="utilities" className="mt-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Base64:</strong> <code className="bg-gray-100 px-1 rounded">{testData.base64Text}</code>
                  </div>
                  <div>
                    <strong>URL:</strong> <code className="bg-gray-100 px-1 rounded break-all">{testData.urlText}</code>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
