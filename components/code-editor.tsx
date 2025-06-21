"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language: string
  placeholder?: string
  readOnly?: boolean
  className?: string
  "aria-label"?: string
}

// Language-specific syntax highlighting patterns
const getSyntaxPatterns = (language: string) => {
  const patterns: { [key: string]: Array<{ pattern: RegExp; className: string }> } = {
    javascript: [
      { pattern: /\/\/.*$/gm, className: "text-gray-500 italic" }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-gray-500 italic" }, // Block comments
      {
        pattern: /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|default)\b/g,
        className: "text-blue-600 font-semibold",
      }, // Keywords
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" }, // Strings
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" }, // Strings
      { pattern: /`([^`\\]|\\.)*`/g, className: "text-green-600" }, // Template literals
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
      { pattern: /\b(true|false|null|undefined)\b/g, className: "text-purple-600" }, // Literals
    ],
    typescript: [
      { pattern: /\/\/.*$/gm, className: "text-gray-500 italic" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-gray-500 italic" },
      {
        pattern:
          /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|default|interface|type|enum|public|private|protected)\b/g,
        className: "text-blue-600 font-semibold",
      },
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" },
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" },
      { pattern: /`([^`\\]|\\.)*`/g, className: "text-green-600" },
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" },
      { pattern: /\b(true|false|null|undefined)\b/g, className: "text-purple-600" },
      { pattern: /:\s*\w+/g, className: "text-cyan-600" }, // Type annotations
    ],
    html: [
      { pattern: /<!--[\s\S]*?-->/g, className: "text-gray-500 italic" }, // Comments
      { pattern: /<\/?[\w\s="/.':;#-/?]+>/g, className: "text-blue-600" }, // Tags
      { pattern: /\w+(?==)/g, className: "text-red-600" }, // Attributes
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" }, // Attribute values
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" }, // Attribute values
    ],
    css: [
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-gray-500 italic" }, // Comments
      { pattern: /[.#]?[a-zA-Z][a-zA-Z0-9_-]*(?=\s*\{)/g, className: "text-blue-600 font-semibold" }, // Selectors
      { pattern: /[a-zA-Z-]+(?=\s*:)/g, className: "text-red-600" }, // Properties
      { pattern: /:([^;{}]+)/g, className: "text-green-600" }, // Values
      {
        pattern:
          /\b\d+\.?\d*(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?\b/g,
        className: "text-orange-600",
      }, // Numbers and units
    ],
    python: [
      { pattern: /#.*$/gm, className: "text-gray-500 italic" }, // Comments
      {
        pattern:
          /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|and|or|not|in|is)\b/g,
        className: "text-blue-600 font-semibold",
      }, // Keywords
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" }, // Strings
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" }, // Strings
      { pattern: /"""[\s\S]*?"""/g, className: "text-green-600" }, // Triple quotes
      { pattern: /'''[\s\S]*?'''/g, className: "text-green-600" }, // Triple quotes
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
      { pattern: /\b(True|False|None)\b/g, className: "text-purple-600" }, // Literals
    ],
    json: [
      { pattern: /"([^"\\]|\\.)*"(?=\s*:)/g, className: "text-blue-600" }, // Keys
      { pattern: /"([^"\\]|\\.)*"(?!\s*:)/g, className: "text-green-600" }, // String values
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
      { pattern: /\b(true|false|null)\b/g, className: "text-purple-600" }, // Literals
    ],
    xml: [
      { pattern: /<!--[\s\S]*?-->/g, className: "text-gray-500 italic" }, // Comments
      { pattern: /<\?[\s\S]*?\?>/g, className: "text-purple-600" }, // Processing instructions
      { pattern: /<\/?[\w\s="/.':;#-/?]+>/g, className: "text-blue-600" }, // Tags
      { pattern: /\w+(?==)/g, className: "text-red-600" }, // Attributes
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" }, // Attribute values
    ],
    sql: [
      { pattern: /--.*$/gm, className: "text-gray-500 italic" }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-gray-500 italic" }, // Block comments
      {
        pattern:
          /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|JOIN|INNER|LEFT|RIGHT|OUTER|ON|GROUP|ORDER|BY|HAVING|LIMIT|OFFSET|UNION|DISTINCT|AS|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL)\b/gi,
        className: "text-blue-600 font-semibold",
      }, // Keywords
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" }, // Strings
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
    ],
    php: [
      { pattern: /\/\/.*$/gm, className: "text-gray-500 italic" }, // Comments
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-gray-500 italic" }, // Block comments
      { pattern: /<\?php|\?>/g, className: "text-purple-600 font-semibold" }, // PHP tags
      {
        pattern:
          /\b(function|class|if|else|elseif|for|foreach|while|return|public|private|protected|static|const|var|echo|print|include|require|namespace|use)\b/g,
        className: "text-blue-600 font-semibold",
      }, // Keywords
      { pattern: /"([^"\\]|\\.)*"/g, className: "text-green-600" }, // Strings
      { pattern: /'([^'\\]|\\.)*'/g, className: "text-green-600" }, // Strings
      { pattern: /\$\w+/g, className: "text-red-600" }, // Variables
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
    ],
    markdown: [
      { pattern: /^#{1,6}\s+.+$/gm, className: "text-blue-600 font-bold" }, // Headers
      { pattern: /\*\*([^*]+)\*\*/g, className: "font-bold" }, // Bold
      { pattern: /\*([^*]+)\*/g, className: "italic" }, // Italic
      { pattern: /`([^`]+)`/g, className: "bg-gray-100 text-red-600 px-1 rounded" }, // Inline code
      { pattern: /\[([^\]]+)\]$$([^)]+)$$/g, className: "text-blue-600 underline" }, // Links
    ],
    yaml: [
      { pattern: /#.*$/gm, className: "text-gray-500 italic" }, // Comments
      { pattern: /^[\w-]+(?=:)/gm, className: "text-blue-600 font-semibold" }, // Keys
      { pattern: /:\s*(.+)$/gm, className: "text-green-600" }, // Values
      { pattern: /\b\d+\.?\d*\b/g, className: "text-orange-600" }, // Numbers
      { pattern: /\b(true|false|null|yes|no|on|off)\b/gi, className: "text-purple-600" }, // Literals
    ],
  }

  return patterns[language] || []
}

const highlightSyntax = (code: string, language: string): string => {
  const patterns = getSyntaxPatterns(language)
  let highlightedCode = code

  // Escape HTML entities first
  highlightedCode = highlightedCode
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

  // Apply syntax highlighting patterns
  patterns.forEach(({ pattern, className }) => {
    highlightedCode = highlightedCode.replace(pattern, (match) => {
      return `<span class="${className}">${match}</span>`
    })
  })

  return highlightedCode
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  readOnly = false,
  className,
  "aria-label": ariaLabel,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const lines = value.split("\n")
  const lineCount = lines.length

  // Sync scroll between textarea and highlight layer
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange && !readOnly) {
      onChange(e.target.value)
    }
  }

  // Update highlighting when value changes
  useEffect(() => {
    if (highlightRef.current) {
      const highlightedCode = highlightSyntax(value, language)
      highlightRef.current.innerHTML = highlightedCode
    }
  }, [value, language])

  return (
    <div ref={containerRef} className={cn("relative border rounded-md bg-white overflow-hidden", className)}>
      <div className="flex">
        {/* Line numbers */}
        <div className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-2 py-2 text-xs text-gray-500 font-mono select-none">
          {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
            <div key={i + 1} className="leading-5 text-right min-w-[2rem]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code editor area */}
        <div className="flex-1 relative">
          {/* Syntax highlighting layer */}
          <div
            ref={highlightRef}
            className="absolute inset-0 p-2 font-mono text-sm leading-5 pointer-events-none overflow-auto whitespace-pre-wrap break-words text-gray-900"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
            }}
            aria-hidden="true"
          />

          {/* Actual textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onScroll={handleScroll}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-label={ariaLabel}
            className={cn(
              "w-full h-full p-2 font-mono text-sm leading-5 border-none outline-none resize-none",
              "placeholder:text-gray-400",
              readOnly ? "cursor-default bg-gray-50" : "cursor-text bg-white",
              // Make text color transparent but keep caret visible
              "text-transparent caret-gray-900 selection:bg-blue-200",
            )}
            style={{
              minHeight: "400px",
              background: readOnly ? "#f9fafb" : "white",
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  )
}
