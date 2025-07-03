"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Code, Zap, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormatterProps {
  type: string
  formatter: {
    name: string
    description: string
    placeholder: string
    longDescription: string
    keywords: string[]
  }
}

export default function EnhancedFormatterInterface({ type, formatter }: FormatterProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [indentationType, setIndentationType] = useState<"2-spaces" | "4-spaces" | "tabs">("2-spaces")
  const [formatMode, setFormatMode] = useState<"beautify" | "minify">("beautify")

  // Enhanced validation and formatting logic
  const formatCode = useCallback(
    async (code: string | undefined) => {
      // Add null/undefined checks
      if (!code || typeof code !== "string" || !code.trim()) {
        setOutput("")
        setIsValid(true)
        setError("")
        setIsProcessing(false)
        return
      }

      setIsProcessing(true)

      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 100))

      try {
        let formatted = ""

        // Get indentation string based on user preference
        const getIndent = () => {
          switch (indentationType) {
            case "2-spaces":
              return "  "
            case "4-spaces":
              return "    "
            case "tabs":
              return "\t"
            default:
              return "  "
          }
        }

        const indent = getIndent()

        switch (type) {
          case "json":
            try {
              const trimmed = code.trim()
              if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
                throw new Error("JSON must start with '{' or '['")
              }

              const parsed = JSON.parse(code)

              if (formatMode === "minify") {
                formatted = JSON.stringify(parsed)
              } else {
                // Use custom indentation
                formatted = JSON.stringify(
                  parsed,
                  null,
                  indentationType === "tabs" ? "\t" : indentationType === "4-spaces" ? 4 : 2,
                )
              }

              if (typeof parsed === "string") {
                throw new Error("Root level strings are not valid JSON objects")
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                const match = err.message.match(/position (\d+)/)
                const position = match ? Number.parseInt(match[1]) : null
                const validationError = `JSON Syntax Error${position ? ` at position ${position}` : ""}: ${err.message}`
                throw new Error(validationError)
              } else {
                const validationError = `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`
                throw new Error(validationError)
              }
            }
            break

          case "javascript":
          case "typescript":
            try {
              // Enhanced JavaScript validation
              const lines = code.split("\n")
              let braceCount = 0
              let parenCount = 0
              let bracketCount = 0

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
                parenCount += (line.match(/$$/g) || []).length - (line.match(/$$/g) || []).length
                bracketCount += (line.match(/\[/g) || []).length - (line.match(/\]/g) || []).length

                if (line.includes("function") && line.includes("(") && !line.includes(")")) {
                  throw new Error(`Line ${i + 1}: Incomplete function declaration`)
                }
              }

              if (braceCount !== 0) {
                throw new Error(`Mismatched braces: ${braceCount > 0 ? "missing closing" : "extra closing"} brace(s)`)
              }
              if (parenCount !== 0) {
                throw new Error(
                  `Mismatched parentheses: ${parenCount > 0 ? "missing closing" : "extra closing"} parenthesis`,
                )
              }
              if (bracketCount !== 0) {
                throw new Error(
                  `Mismatched brackets: ${bracketCount > 0 ? "missing closing" : "extra closing"} bracket(s)`,
                )
              }

              if (formatMode === "minify") {
                // Minify JavaScript - remove unnecessary whitespace and newlines
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove line comments
                  .replace(/\s+/g, " ") // Replace multiple spaces with single space
                  .replace(/;\s*}/g, ";}") // Remove space before closing brace
                  .replace(/{\s*/g, "{") // Remove space after opening brace
                  .replace(/\s*}/g, "}") // Remove space before closing brace
                  .replace(/;\s*/g, ";") // Remove space after semicolon
                  .trim()
              } else {
                // Enhanced JavaScript formatting with custom indentation
                let indentLevel = 0
                formatted = code
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/\{(?!\s*$)/g, " {\n")
                  .replace(/\}(?!\s*$)/g, "\n}\n")
                  .replace(/,(?![^(]*\))(?!\s*$)/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (trimmed.endsWith("{")) indentLevel++

                    return result
                  })
                  .filter((line) => line.trim())
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "JavaScript syntax error"
              throw new Error(validationError)
            }
            break

          case "html":
            try {
              // Enhanced HTML validation
              const parser = new DOMParser()
              const doc = parser.parseFromString(code, "text/html")
              const errors = doc.getElementsByTagName("parsererror")

              if (errors.length > 0) {
                throw new Error("Invalid HTML structure detected")
              }

              if (formatMode === "minify") {
                // Minify HTML - remove unnecessary whitespace
                formatted = code
                  .replace(/>\s+</g, "><") // Remove whitespace between tags
                  .replace(/\s+/g, " ") // Replace multiple spaces with single space
                  .replace(/\s*=\s*/g, "=") // Remove spaces around equals
                  .trim()
              } else {
                // Enhanced HTML formatting with custom indentation
                let indentLevel = 0
                formatted = code
                  .replace(/></g, ">\n<")
                  .replace(/^\s+|\s+$/g, "")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.includes("<!")
                    ) {
                      indentLevel++
                    }

                    return result
                  })
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "HTML syntax error"
              throw new Error(validationError)
            }
            break

          case "css":
            try {
              // Enhanced CSS validation
              const braceMatches = code.match(/[{}]/g) || []
              let braceCount = 0

              for (const brace of braceMatches) {
                braceCount += brace === "{" ? 1 : -1
                if (braceCount < 0) {
                  throw new Error("Unexpected closing brace '}' in CSS")
                }
              }

              if (braceCount !== 0) {
                throw new Error(`Mismatched braces in CSS: ${braceCount} unclosed brace(s)`)
              }

              if (formatMode === "minify") {
                // Minify CSS
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                  .replace(/\s+/g, " ") // Replace multiple spaces
                  .replace(/;\s*}/g, ";}") // Remove space before closing brace
                  .replace(/{\s*/g, "{") // Remove space after opening brace
                  .replace(/\s*}/g, "}") // Remove space before closing brace
                  .replace(/;\s*/g, ";") // Remove space after semicolon
                  .replace(/:\s*/g, ":") // Remove space after colon
                  .trim()
              } else {
                // Enhanced CSS formatting with custom indentation
                formatted = code
                  .replace(/\{/g, " {\n")
                  .replace(/\}/g, "\n}\n")
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/,(?![^{]*})/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.endsWith("{") || trimmed.endsWith("}")) {
                      return trimmed
                    } else if (trimmed.includes(":")) {
                      return indent + trimmed
                    }
                    return trimmed
                  })
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "CSS syntax error"
              throw new Error(validationError)
            }
            break

          case "python":
            try {
              const lines = code.split("\n")
              let indentLevel = 0

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                const trimmed = line.trim()

                if (!trimmed || trimmed.startsWith("#")) continue

                if (trimmed.includes("def ") && !trimmed.endsWith(":")) {
                  throw new Error(`Line ${i + 1}: Function definition must end with ':'`)
                }
              }

              if (formatMode === "minify") {
                // Python minification is limited due to indentation significance
                formatted = lines
                  .map((line) => line.trim())
                  .filter((line) => line && !line.startsWith("#"))
                  .join("\n")
              } else {
                // Enhanced Python formatting with custom indentation
                indentLevel = 0
                formatted = lines
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.endsWith(":")) {
                      const result = indent.repeat(indentLevel) + trimmed
                      indentLevel++
                      return result
                    } else if (
                      trimmed.startsWith("else:") ||
                      trimmed.startsWith("elif ") ||
                      trimmed.startsWith("except") ||
                      trimmed.startsWith("finally:")
                    ) {
                      indentLevel = Math.max(0, indentLevel - 1)
                      const result = indent.repeat(indentLevel) + trimmed
                      indentLevel++
                      return result
                    } else {
                      return indent.repeat(indentLevel) + trimmed
                    }
                  })
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "Python syntax error"
              throw new Error(validationError)
            }
            break

          case "xml":
            try {
              // Enhanced XML validation
              const parser = new DOMParser()
              const xmlDoc = parser.parseFromString(code, "application/xml")
              const parseError = xmlDoc.getElementsByTagName("parsererror")

              if (parseError.length > 0) {
                const errorText = parseError[0].textContent || "Unknown XML parsing error"
                throw new Error(`XML Parse Error: ${errorText}`)
              }

              // Check for proper XML declaration
              if (code.trim().startsWith("<?xml") && !code.includes("?>")) {
                throw new Error("Incomplete XML declaration")
              }

              // Enhanced XML formatting
              if (formatMode === "minify") {
                formatted = code.replace(/>\s+</g, "><").trim()
              } else {
                let indentLevel = 0
                formatted = code
                  .replace(/></g, ">\n<")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.startsWith("<?")
                    ) {
                      indentLevel++
                    }

                    return result
                  })
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "XML syntax error"
              throw new Error(validationError)
            }
            break

          case "sql":
            try {
              // Enhanced SQL validation
              const keywords = [
                "SELECT",
                "FROM",
                "WHERE",
                "INSERT",
                "UPDATE",
                "DELETE",
                "CREATE",
                "DROP",
                "ALTER",
                "JOIN",
              ]
              const upperCode = code.toUpperCase()

              const hasKeyword = keywords.some((keyword) => upperCode.includes(keyword))
              if (!hasKeyword) {
                throw new Error("No valid SQL keywords found")
              }

              // More comprehensive SQL validation
              if (upperCode.includes("SELECT") && !upperCode.includes("FROM") && !upperCode.includes("DUAL")) {
                throw new Error("SELECT statement missing FROM clause")
              }

              // Check for balanced parentheses
              let parenCount = 0
              for (const char of code) {
                if (char === "(") parenCount++
                if (char === ")") parenCount--
                if (parenCount < 0) {
                  throw new Error("Unexpected closing parenthesis in SQL")
                }
              }
              if (parenCount !== 0) {
                throw new Error(`Mismatched parentheses: ${parenCount} unclosed parenthesis`)
              }

              // Enhanced SQL formatting
              if (formatMode === "minify") {
                formatted = code.replace(/\s+/g, " ").trim()
              } else {
                formatted = code
                  .replace(/\bSELECT\b/gi, "\nSELECT")
                  .replace(/\bFROM\b/gi, "\nFROM")
                  .replace(/\bWHERE\b/gi, "\nWHERE")
                  .replace(/\bAND\b/gi, "\n  AND")
                  .replace(/\bOR\b/gi, "\n  OR")
                  .replace(/\bJOIN\b/gi, "\nJOIN")
                  .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN")
                  .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN")
                  .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN")
                  .replace(/\bORDER BY\b/gi, "\nORDER BY")
                  .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
                  .replace(/\bHAVING\b/gi, "\nHAVING")
                  .replace(/\bLIMIT\b/gi, "\nLIMIT")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "SQL syntax error"
              throw new Error(validationError)
            }
            break

          case "markdown":
            try {
              // Enhanced Markdown validation
              const lines = code.split("\n")

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]

                // Check for unmatched brackets in links
                const openBrackets = (line.match(/\[/g) || []).length
                const closeBrackets = (line.match(/\]/g) || []).length
                const openParens = (line.match(/\(/g) || []).length
                const closeParens = (line.match(/\)/g) || []).length

                if (openBrackets !== closeBrackets) {
                  throw new Error(`Line ${i + 1}: Unmatched square brackets`)
                }

                if (openParens !== closeParens) {
                  throw new Error(`Line ${i + 1}: Unmatched parentheses`)
                }

                // Check for proper heading syntax
                if (line.trim().startsWith("#")) {
                  const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
                  if (!headingMatch) {
                    throw new Error(`Line ${i + 1}: Invalid heading syntax`)
                  }
                }
              }

              // Enhanced Markdown formatting
              formatted = code
                .split("\n")
                .map((line) => line.trim())
                .join("\n")
                .replace(/\n{3,}/g, "\n\n")
                .replace(/^(#{1,6})\s*/gm, (match, hashes) => `${hashes} `)

              if (formatMode === "minify") {
                formatted = formatted.replace(/\s+/g, " ").trim()
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "Markdown syntax error"
              throw new Error(validationError)
            }
            break

          case "yaml":
            try {
              if (formatMode === "minify") {
                formatted = code.replace(/\s+/g, " ").trim()
              } else {
                const yamlIndent = indentationType === "4-spaces" ? "    " : "  "
                formatted = code
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    const originalIndentLevel = Math.max(0, (line.length - line.trimStart().length) / 2)
                    return yamlIndent.repeat(originalIndentLevel) + trimmed
                  })
                  .filter((line) => line.trim())
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "YAML syntax error"
              throw new Error(validationError)
            }
            break

          case "php":
            try {
              if (!code.includes("<?php")) {
                throw new Error("PHP code must start with <?php tag")
              }

              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              } else {
                let indentLevel = 0
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("<?php")) return trimmed
                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (trimmed.endsWith("{")) indentLevel++

                    return result
                  })
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "PHP syntax error"
              throw new Error(validationError)
            }
            break

          case "go":
          case "rust":
          case "swift":
          case "kotlin":
          case "cpp":
            try {
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              } else {
                let indentLevel = 0
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (trimmed.endsWith("{")) indentLevel++

                    return result
                  })
                  .filter((line) => line.trim())
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : `${type} syntax error`
              throw new Error(validationError)
            }
            break

          default:
            formatted = code
        }

        setOutput(formatted)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid format")
        setOutput("")
      } finally {
        setIsProcessing(false)
      }
    },
    [type, indentationType, formatMode],
  )

  // Secure file upload handler - client-side only
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      // Security: Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      // Security: Validate file type based on formatter
      const allowedTypes: Record<string, string[]> = {
        json: [".json", ".txt"],
        javascript: [".js", ".jsx", ".ts", ".tsx", ".txt"],
        html: [".html", ".htm", ".txt"],
        css: [".css", ".scss", ".less", ".txt"],
        python: [".py", ".txt"],
        xml: [".xml", ".txt"],
        sql: [".sql", ".txt"],
        markdown: [".md", ".markdown", ".txt"],
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      const validTypes = allowedTypes[type] || [".txt"]

      if (!validTypes.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Please select a ${validTypes.join(", ")} file`,
          variant: "destructive",
        })
        return
      }

      // Security: Use FileReader for client-side reading only
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string

        // Security: Sanitize content (remove potential script tags, etc.)
        const sanitizedContent = content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/javascript:/gi, "")
          .replace(/on\w+\s*=/gi, "")

        setInput(sanitizedContent)
        setUploadedFileName(file.name)
        formatCode(sanitizedContent)

        toast({
          title: "File uploaded",
          description: `${file.name} loaded successfully`,
        })
      }

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read the file",
          variant: "destructive",
        })
      }

      // Security: Read as text only, never as executable
      reader.readAsText(file)
    },
    [type, toast, formatCode],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    formatCode(value)
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "Formatted code copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `formatted.${type}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "Formatted code downloaded successfully",
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
    if (formatter?.placeholder) {
      setInput(formatter.placeholder)
      formatCode(formatter.placeholder)
    }
  }

  // Load example on mount - with safety checks
  useEffect(() => {
    if (!input && formatter?.placeholder) {
      handleLoadExample()
    }
  }, [formatter])

  // Safety check for formatter prop
  if (!formatter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Loading Formatter...</h1>
          <p className="text-gray-600">Please wait while we load the formatter interface.</p>
        </div>
      </div>
    )
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
                <Code className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatter.name} Formatter</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isProcessing ? (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                  Processing
                </Badge>
              ) : isValid ? (
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

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{formatter.name} Formatter</h1>
          <p className="text-lg text-gray-600 mb-4">{formatter.description}</p>
          <p className="text-gray-500">{formatter.longDescription}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <section>
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Input</CardTitle>
                    <CardDescription>
                      {uploadedFileName
                        ? `File: ${uploadedFileName}`
                        : `Paste or type your ${formatter.name.toLowerCase()} code here`}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept={
                          type === "json"
                            ? ".json,.txt"
                            : type === "javascript"
                              ? ".js,.jsx,.ts,.tsx,.txt"
                              : type === "html"
                                ? ".html,.htm,.txt"
                                : type === "css"
                                  ? ".css,.scss,.less,.txt"
                                  : type === "python"
                                    ? ".py,.txt"
                                    : type === "xml"
                                      ? ".xml,.txt"
                                      : type === "sql"
                                        ? ".sql,.txt"
                                        : type === "markdown"
                                          ? ".md,.markdown,.txt"
                                          : ".txt"
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleLoadExample}>
                        Load Example
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={indentationType}
                        onChange={(e) => setIndentationType(e.target.value as any)}
                        className="px-3 py-1 text-sm border rounded-md bg-white"
                      >
                        <option value="2-spaces">2 Spaces</option>
                        <option value="4-spaces">4 Spaces</option>
                        <option value="tabs">Tabs</option>
                      </select>
                      <select
                        value={formatMode}
                        onChange={(e) => setFormatMode(e.target.value as any)}
                        className="px-3 py-1 text-sm border rounded-md bg-white"
                      >
                        <option value="beautify">Beautify</option>
                        <option value="minify">Minify</option>
                      </select>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={`Enter your ${formatter.name.toLowerCase()} code here...`}
                  className="min-h-[400px] font-mono text-sm"
                  aria-label={`${formatter.name} code input`}
                />
                {error && (
                  <div
                    className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
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
          <section>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Output</CardTitle>
                    <CardDescription>Formatted {formatter.name.toLowerCase()} code</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output || !isValid}>
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output || !isValid}>
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Formatted code will appear here..."
                  className="min-h-[400px] font-mono text-sm bg-gray-50"
                  aria-label={`Formatted ${formatter.name} code output`}
                />
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Tips and Information Section */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Tips & Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatting" className="w-full">
                <TabsList>
                  <TabsTrigger value="formatting">Formatting</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                  <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
                </TabsList>
                <TabsContent value="formatting" className="mt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">How {formatter.name} Formatting Works:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Paste your {formatter.name.toLowerCase()} code and see it formatted instantly</li>
                      <li>The formatter automatically detects and fixes common formatting issues</li>
                      <li>Proper indentation and spacing are applied according to best practices</li>
                      <li>Use the "Load Example" button to see how the formatter works</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="validation" className="mt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Validation Features:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Real-time syntax validation as you type</li>
                      <li>Detailed error messages help you identify and fix issues</li>
                      <li>The status badge shows whether your code is valid</li>
                      <li>Line-by-line error reporting for precise debugging</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="shortcuts" className="mt-4">
                  <div className="space-y-3 text-sm text-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Keyboard Shortcuts & Features:</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Copy formatted code with the copy button</li>
                      <li>Download formatted code as a file</li>
                      <li>Clear input with the reset button</li>
                      <li>Load example code to test the formatter</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
