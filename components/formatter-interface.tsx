"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Code, Zap, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "@/components/layout-with-ads"
import CodeEditor from "@/components/code-editor"
import { Header } from "@/components/Header"

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

export default function FormatterInterface({ type, formatter }: FormatterProps) {
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
      // Add comprehensive null/undefined checks
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
                formatted = JSON.stringify(
                  parsed,
                  null,
                  indentationType === "tabs" ? "\t" : indentationType === "4-spaces" ? 4 : 2,
                )
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
            try {
              new Function(code); // Will throw SyntaxError if invalid JS

              if (formatMode === "minify") {
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
              if (err instanceof SyntaxError) {
                throw new Error(`JavaScript Syntax Error: ${err.message}`)
              } else {
                throw new Error(`Invalid JavaScript: ${err instanceof Error ? err.message : "Unknown error"}`)
              }
            }
            break;
          case "typescript":
            try {
              const ts = require("typescript");

              const sourceFile = ts.createSourceFile(
                "temp.ts",
                code,
                ts.ScriptTarget.Latest,
      /*setParentNodes*/ true,
                ts.ScriptKind.TS
              );

              const diagnostics = sourceFile.parseDiagnostics || [];
              if (diagnostics.length > 0) {
                const firstError = diagnostics[0];
                const message = ts.flattenDiagnosticMessageText(firstError.messageText, "\n");
                throw new Error(`TypeScript Syntax Error: ${message}`);
              }

              // If valid, proceed to formatting
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\s+/g, " ")
                  .replace(/;\s*}/g, ";}")
                  .replace(/{\s*/g, "{")
                  .replace(/\s*}/g, "}")
                  .replace(/;\s*/g, ";")
                  .trim();
              } else {
                let indentLevel = 0;
                formatted = code
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/\{(?!\s*$)/g, " {\n")
                  .replace(/\}(?!\s*$)/g, "\n}\n")
                  .replace(/,(?![^(]*\))(?!\s*$)/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;

                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              throw new Error(
                err instanceof Error ? err.message : "TypeScript syntax error"
              );
            }
            break;

          case "html":
            try {
              const openTags: string[] = [];
              const voidTags = new Set([
                "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"
              ]);
              const tagRegex = /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g;
              let match: RegExpExecArray | null;

              // Validate HTML tags
              while ((match = tagRegex.exec(code)) !== null) {
                const tagName = match[1].toLowerCase();
                const fullTag = match[0];

                // Skip DOCTYPE and comments
                if (fullTag.startsWith("<!") || voidTags.has(tagName)) continue;

                if (fullTag.startsWith("</")) {
                  // closing tag
                  if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
                    throw new Error(`HTML syntax error: unmatched closing tag </${tagName}>`);
                  }
                  openTags.pop();
                } else {
                  // opening tag
                  openTags.push(tagName);
                }
              }

              if (openTags.length > 0) {
                throw new Error(`HTML syntax error: unclosed tag <${openTags[openTags.length - 1]}>`);
              }

              // Formatting
              if (formatMode === "minify") {
                formatted = code
                  .replace(/>\s+</g, "><")
                  .replace(/\s+/g, " ")
                  .replace(/\s*=\s*/g, "=")
                  .trim();
              } else {
                let indentLevel = 0;
                const indent = "  ";
                formatted = code
                  .replace(/></g, ">\n<")
                  .split("\n")
                  .map(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.includes("<!")
                    ) {
                      indentLevel++;
                    }

                    return result;
                  })
                  .filter(line => line)
                  .join("\n");
              }
            } catch (err: unknown) {
              const validationError = err instanceof Error ? err.message : "HTML syntax error";
              throw new Error(validationError);
            }
            break;


          case "css":
            try {
              if (formatMode === "minify") {
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
              if (formatMode === "minify") {
                formatted = code
                  .split("\n")
                  .map((line) => line.trim())
                  .filter((line) => line && !line.startsWith("#"))
                  .join("\n")
              } else {
                let indentLevel = 0
                formatted = code
                  .split("\n")
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
              if (!code.trim().startsWith("<")) {
                throw new SyntaxError("XML must start with a root tag");
              }

              // Check for matching opening/closing tags (basic)
              const tagStack = [];
              const tagRegex = /<\/?([a-zA-Z_][\w:\-\.]*)(\s[^>]*)?>/g;
              let match;

              while ((match = tagRegex.exec(code)) !== null) {
                const fullTag = match[0];
                const tagName = match[1];

                if (fullTag.startsWith("</")) {
                  // closing tag
                  const last = tagStack.pop();
                  if (last !== tagName) {
                    throw new SyntaxError(`Mismatched closing tag: expected </${last}> but found </${tagName}>`);
                  }
                } else if (!fullTag.endsWith("/>") && !fullTag.startsWith("<?")) {
                  // opening tag (ignore self-closing <.../> and <?xml ...?>)
                  tagStack.push(tagName);
                }
              }

              if (tagStack.length > 0) {
                throw new SyntaxError(`Unclosed tag(s): ${tagStack.join(", ")}`);
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code.replace(/>\s+</g, "><").trim();
              }
              // --- Pretty Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/></g, ">\n<")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.startsWith("<?")
                    ) {
                      indentLevel++;
                    }

                    return result;
                  })
                  .filter((line) => line)
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`XML Syntax Error: ${err.message}`);
              } else {
                throw new Error(`Invalid XML: ${err instanceof Error ? err.message : "Unknown error"}`);
              }
            }
            break;

          case "sql":
            try {
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
              // --- Basic Syntax Checks ---
              if (!code.includes("<?php")) {
                throw new SyntaxError("Missing '<?php' opening tag");
              }

              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\s+/g, " ") // Collapse spaces
                  .trim();
              }
              // --- Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("<?php")) return trimmed;
                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;
                    return result;
                  })
                  .filter((line) => line)
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`PHP Syntax Error: ${err.message}`);
              } else {
                throw new Error(`Invalid PHP code: ${err instanceof Error ? err.message : "Unknown error"}`);
              }
            }
            break;


          case "go":
            try {
              // Simple syntax check for braces, parentheses, and main function
              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              if (!/package\s+\w+/.test(code)) {
                throw new SyntaxError("Missing package declaration");
              }

              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\s+/g, " ") // Collapse spaces
                  .trim();
              } else {
                let indentLevel = 0;

                formatted = code
                  .replace(/(package\s+\w+)/g, "$1\n")
                  .replace(/(import\s*\(.*?\))/g, (m) =>
                    m.replace(/\s+/g, "\n").replace(/\(\n+/, "(\n").replace(/\n+\)/, "\n)")
                  )
                  .replace(/(import\s+"[^"]+")/g, "$1\n")
                  .replace(/}\s*func/g, "}\n\nfunc")
                  .replace(/}\s*type/g, "}\n\ntype")
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, "\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;

                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`Go Syntax Error: ${err.message}`);
              } else {
                throw new Error(
                  `Invalid Go code: ${err instanceof Error ? err.message : "Unknown error"}`
                );
              }
            }
            break;
          case "cpp":
            try {
              // --- Basic Syntax Check ---
              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              const openBrackets = (code.match(/\[/g) || []).length;
              const closeBrackets = (code.match(/\]/g) || []).length;
              if (openBrackets !== closeBrackets) {
                throw new SyntaxError("Mismatched square brackets");
              }

              if (!/#include\s+<.*?>/.test(code) && !/int\s+main\s*\(/.test(code)) {
                throw new SyntaxError("Missing #include or main() function");
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\s+/g, " ") // Collapse multiple spaces
                  .replace(/\s*([{}();,])\s*/g, "$1") // Remove spaces around symbols
                  .trim();
              }
              // --- Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/;/g, ";\n") // Break after semicolons
                  .replace(/{/g, "{\n") // Break after {
                  .replace(/}/g, "\n}") // Break before }
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;
                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`C++ Syntax Error: ${err.message}`);
              } else {
                throw new Error(
                  `Invalid C++ code: ${err instanceof Error ? err.message : "Unknown error"}`
                );
              }
            }
            break;

          case "rust":
          case "swift":
          case "kotlin":
            // case "cpp":
            try {
              // Basic syntax validation
              const stack: string[] = [];
              const pairs: Record<string, string> = { "{": "}", "(": ")", "[": "]" };

              for (let i = 0; i < code.length; i++) {
                const char = code[i];
                if (pairs[char]) {
                  stack.push(char);
                } else if (Object.values(pairs).includes(char)) {
                  const last = stack.pop();
                  if (!last || pairs[last] !== char) {
                    throw new Error(`Syntax error: unexpected '${char}' at position ${i}`);
                  }
                }
              }
              if (stack.length > 0) {
                throw new Error(`Syntax error: unclosed '${stack[stack.length - 1]}'`);
              }

              // Formatting
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              } else {
                let indentLevel = 0
                const indent = "    ";
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .replace(/\)\s*(?=fun|class|let|fn|impl)/g, ")\n")
                  .replace(/\}\s*(?=fun|class|let|fn|impl)/g, "}\n")
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
              const validationError =
                err instanceof Error ? err.message : `${type} syntax error`;
              throw new Error(validationError);
            }
            break;


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

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (content) {
          setInput(content)
          setUploadedFileName(file.name)
          formatCode(content)

          toast({
            title: "File uploaded",
            description: `${file.name} loaded successfully`,
          })
        }
      }

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read the file",
          variant: "destructive",
        })
      }

      reader.readAsText(file)
    },
    [toast, formatCode],
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
      <Header formatterName={formatter.name + ' Formatter'}
        icon={<Code className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
        statusBadge={
          isProcessing ? (
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
          )
        } />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds>
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{formatter.name} Formatter</h1>
            <p className="text-base sm:text-lg text-gray-500 mb-4">{formatter.description}</p>
            <p className="text-sm sm:text-base text-gray-500">{formatter.longDescription}</p>
          </header>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <section>
              <Card>
                <CardHeader className="pb-4">
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-lg">Input</CardTitle>
                      <CardDescription className="text-sm">
                        {uploadedFileName
                          ? `File: ${uploadedFileName}`
                          : `Paste or type your ${formatter.name.toLowerCase()} code here`}
                      </CardDescription>
                    </div>

                    {/* Mobile-first responsive controls */}
                    <div className="space-y-3">
                      {/* First row: Upload and Example buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".txt,.js,.jsx,.ts,.tsx,.html,.htm,.css,.json,.py,.xml,.sql,.md,.markdown"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Upload
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLoadExample}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          Load Example
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClear} className="flex-1 sm:flex-none">
                          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Second row: Dropdowns */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* First select with custom arrow */}
                        <div className="relative flex-1">
                          <select
                            value={indentationType}
                            onChange={(e) => setIndentationType(e.target.value as any)}
                            className="w-full appearance-none px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md bg-white dark:bg-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="2-spaces">2 Spaces</option>
                            <option value="4-spaces">4 Spaces</option>
                            <option value="tabs">Tabs</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Second select with custom arrow */}
                        <div className="relative flex-1">
                          <select
                            value={formatMode}
                            onChange={(e) => setFormatMode(e.target.value as any)}
                            className="w-full appearance-none px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md bg-white dark:bg-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="beautify">Beautify</option>
                            <option value="minify">Minify</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeEditor
                    value={input}
                    onChange={handleInputChange}
                    language={type}
                    placeholder={`Enter your ${formatter.name.toLowerCase()} code here...`}
                    aria-label={`${formatter.name} code input`}
                  />
                  {error && (
                    <div
                      className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs sm:text-sm"
                      role="alert"
                    >
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
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
                  <div className="flex flex-col items-start sm:items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Output</CardTitle>
                      <CardDescription className="text-sm">
                        Formatted {formatter.name.toLowerCase()} code
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 w-full sm:w-auto flex-wrap justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!output || !isValid}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!output || !isValid}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeEditor
                    value={output}
                    language={type}
                    placeholder="Formatted code will appear here..."
                    readOnly
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
                <CardTitle className="text-lg sm:text-xl">Tips & Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="formatting" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="formatting" className="text-xs sm:text-sm">
                      Formatting
                    </TabsTrigger>
                    <TabsTrigger value="validation" className="text-xs sm:text-sm">
                      Validation
                    </TabsTrigger>
                    <TabsTrigger value="shortcuts" className="text-xs sm:text-sm">
                      Shortcuts
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="formatting" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        How {formatter.name} Formatting Works:
                      </h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Paste your {formatter.name.toLowerCase()} code and see it formatted instantly</li>
                        <li>The formatter automatically detects and fixes common formatting issues</li>
                        <li>Proper indentation and spacing are applied according to best practices</li>
                        <li>Use the "Load Example" button to see how the formatter works</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="validation" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Validation Features:</h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Real-time syntax validation as you type</li>
                        <li>Detailed error messages help you identify and fix issues</li>
                        <li>The status badge shows whether your code is valid</li>
                        <li>Line-by-line error reporting for precise debugging</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="shortcuts" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        Keyboard Shortcuts & Features:
                      </h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
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
        </LayoutWithAds>
      </div>
    </div>
  )
}
