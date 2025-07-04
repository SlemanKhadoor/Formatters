"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, RotateCcw, GitCompare, FileText, Zap, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import LayoutWithAds from "./layout-with-ads"
import { Header } from '@/components/Header'

interface DiffSegment {
  type: "added" | "removed" | "unchanged"
  text: string
}

interface DiffLine {
  type: "added" | "removed" | "modified" | "unchanged"
  leftContent: string
  rightContent: string
  leftLineNumber: number | null
  rightLineNumber: number | null
  leftSegments?: DiffSegment[]
  rightSegments?: DiffSegment[]
}

export default function DiffChecker() {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side")
  const [showWordDiff, setShowWordDiff] = useState(true)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const { toast } = useToast()

  // Word-level diff algorithm
  const getWordDiff = (oldText: string, newText: string): { left: DiffSegment[]; right: DiffSegment[] } => {
    if (!showWordDiff) {
      return {
        left: [{ type: "unchanged", text: oldText }],
        right: [{ type: "unchanged", text: newText }],
      }
    }

    // Split text into words while preserving whitespace
    const splitIntoWords = (text: string) => {
      const words: string[] = []
      const regex = /(\S+|\s+)/g
      let match
      while ((match = regex.exec(text)) !== null) {
        words.push(match[0])
      }
      return words
    }

    const oldWords = splitIntoWords(oldText)
    const newWords = splitIntoWords(newText)

    const left: DiffSegment[] = []
    const right: DiffSegment[] = []

    let i = 0,
      j = 0

    while (i < oldWords.length || j < newWords.length) {
      if (i >= oldWords.length) {
        // Only new words remain
        while (j < newWords.length) {
          right.push({ type: "added", text: newWords[j] })
          j++
        }
        break
      } else if (j >= newWords.length) {
        // Only old words remain
        while (i < oldWords.length) {
          left.push({ type: "removed", text: oldWords[i] })
          i++
        }
        break
      } else if (oldWords[i] === newWords[j]) {
        // Words match
        const word = oldWords[i]
        left.push({ type: "unchanged", text: word })
        right.push({ type: "unchanged", text: word })
        i++
        j++
      } else {
        // Words don't match, find the next matching sequence
        let foundMatch = false
        const maxLookAhead = Math.min(10, Math.max(oldWords.length - i, newWords.length - j))

        // Look for the next matching word sequence
        for (let lookAhead = 1; lookAhead <= maxLookAhead; lookAhead++) {
          // Check if we can find a match by advancing old words
          if (i + lookAhead < oldWords.length) {
            const nextOldWord = oldWords[i + lookAhead]
            const newIndex = newWords.findIndex((word, index) => index >= j && word === nextOldWord)
            if (newIndex !== -1 && newIndex - j <= lookAhead) {
              // Found a match, add the differing words
              for (let k = i; k < i + lookAhead; k++) {
                left.push({ type: "removed", text: oldWords[k] })
              }
              for (let k = j; k < newIndex; k++) {
                right.push({ type: "added", text: newWords[k] })
              }
              i += lookAhead
              j = newIndex
              foundMatch = true
              break
            }
          }

          // Check if we can find a match by advancing new words
          if (j + lookAhead < newWords.length) {
            const nextNewWord = newWords[j + lookAhead]
            const oldIndex = oldWords.findIndex((word, index) => index >= i && word === nextNewWord)
            if (oldIndex !== -1 && oldIndex - i <= lookAhead) {
              // Found a match, add the differing words
              for (let k = i; k < oldIndex; k++) {
                left.push({ type: "removed", text: oldWords[k] })
              }
              for (let k = j; k < j + lookAhead; k++) {
                right.push({ type: "added", text: newWords[k] })
              }
              i = oldIndex
              j += lookAhead
              foundMatch = true
              break
            }
          }
        }

        if (!foundMatch) {
          // No match found, treat as single word change
          left.push({ type: "removed", text: oldWords[i] })
          right.push({ type: "added", text: newWords[j] })
          i++
          j++
        }
      }
    }

    return { left, right }
  }

  // Calculate differences with word-level highlighting
  const diffResult = useMemo(() => {
    if (!leftText && !rightText) return []

    let leftLines = leftText.split("\n")
    let rightLines = rightText.split("\n")

    // Apply preprocessing options
    if (ignoreWhitespace) {
      leftLines = leftLines.map((line) => line.trim())
      rightLines = rightLines.map((line) => line.trim())
    }

    if (ignoreCase) {
      leftLines = leftLines.map((line) => line.toLowerCase())
      rightLines = rightLines.map((line) => line.toLowerCase())
    }

    const result: DiffLine[] = []
    const maxLines = Math.max(leftLines.length, rightLines.length)
    let leftIndex = 0
    let rightIndex = 0

    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[leftIndex] || ""
      const rightLine = rightLines[rightIndex] || ""

      if (leftIndex >= leftLines.length) {
        // Only right side has content (added)
        result.push({
          type: "added",
          leftContent: "",
          rightContent: rightLine,
          leftLineNumber: null,
          rightLineNumber: rightIndex + 1,
          leftSegments: [],
          rightSegments: [{ type: "added", text: rightLine }],
        })
        rightIndex++
      } else if (rightIndex >= rightLines.length) {
        // Only left side has content (removed)
        result.push({
          type: "removed",
          leftContent: leftLine,
          rightContent: "",
          leftLineNumber: leftIndex + 1,
          rightLineNumber: null,
          leftSegments: [{ type: "removed", text: leftLine }],
          rightSegments: [],
        })
        leftIndex++
      } else if (leftLine === rightLine) {
        // Lines are identical
        result.push({
          type: "unchanged",
          leftContent: leftLine,
          rightContent: rightLine,
          leftLineNumber: leftIndex + 1,
          rightLineNumber: rightIndex + 1,
          leftSegments: [{ type: "unchanged", text: leftLine }],
          rightSegments: [{ type: "unchanged", text: rightLine }],
        })
        leftIndex++
        rightIndex++
      } else {
        // Lines are different (modified) - calculate word-level diff
        const wordDiff = getWordDiff(leftLine, rightLine)
        result.push({
          type: "modified",
          leftContent: leftLine,
          rightContent: rightLine,
          leftLineNumber: leftIndex + 1,
          rightLineNumber: rightIndex + 1,
          leftSegments: wordDiff.left,
          rightSegments: wordDiff.right,
        })
        leftIndex++
        rightIndex++
      }
    }

    return result
  }, [leftText, rightText, showWordDiff, ignoreWhitespace, ignoreCase])

  // Calculate statistics
  const stats = useMemo(() => {
    const added = diffResult.filter((line) => line.type === "added").length
    const removed = diffResult.filter((line) => line.type === "removed").length
    const modified = diffResult.filter((line) => line.type === "modified").length
    const unchanged = diffResult.filter((line) => line.type === "unchanged").length

    return { added, removed, modified, unchanged, total: diffResult.length }
  }, [diffResult])

  const handleCopyDiff = async () => {
    const diffText = diffResult
      .map((line) => {
        const prefix =
          line.type === "added" ? "+ " : line.type === "removed" ? "- " : line.type === "modified" ? "~ " : "  "
        return `${prefix}${line.rightContent || line.leftContent}`
      })
      .join("\n")

    await navigator.clipboard.writeText(diffText)
    toast({
      title: "Copied!",
      description: "Diff result copied to clipboard",
    })
  }

  const handleDownloadDiff = () => {
    const diffText = diffResult
      .map((line) => {
        const prefix =
          line.type === "added" ? "+ " : line.type === "removed" ? "- " : line.type === "modified" ? "~ " : "  "
        return `${prefix}${line.rightContent || line.leftContent}`
      })
      .join("\n")

    const blob = new Blob([diffText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "diff-result.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Diff result downloaded successfully",
    })
  }

  const handleClear = () => {
    setLeftText("")
    setRightText("")
  }

  const handleLoadExample = () => {
    const exampleLeft = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const items = [
  { name: "Product 1", price: 29.99 },
  { name: "Product 2", price: 15.50 }
];

console.log("Total:", calculateTotal(items));`

    const exampleRight = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].price && items[i].quantity) {
      total += items[i].price * items[i].quantity;
    }
  }
  return total;
}

const items = [
  { name: "Product 1", price: 29.99, quantity: 2 },
  { name: "Product 2", price: 15.50, quantity: 1 },
  { name: "Product 3", price: 45.00, quantity: 1 }
];

console.log("Total:", calculateTotal(items));`

    setLeftText(exampleLeft)
    setRightText(exampleRight)
  }

  const getLineClassName = (type: DiffLine["type"]) => {
    switch (type) {
      case "added":
        return "bg-green-50 border-l-4 border-green-400"
      case "removed":
        return "bg-red-50 border-l-4 border-red-400"
      case "modified":
        return "bg-yellow-50 border-l-4 border-yellow-400"
      default:
        return "bg-gray-50"
    }
  }

  const getSegmentClassName = (type: DiffSegment["type"]) => {
    switch (type) {
      case "added":
        return "bg-green-200 text-green-900 px-1 rounded"
      case "removed":
        return "bg-red-200 text-red-900 px-1 rounded"
      default:
        return ""
    }
  }

  const renderSegments = (segments: DiffSegment[] | undefined) => {
    if (!segments) return null

    return segments.map((segment, index) => (
      <span key={index} className={getSegmentClassName(segment.type)}>
        {segment.text}
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Diff Checker'}
        icon={<GitCompare className="sm:h-5 sm:w-5 w-4 h-4 text-blue-600" />}
        statusBadge={
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1 text-xs" />
            {stats.total} lines compared
          </Badge>
        }
      />
      <div className="container mx-auto py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <div className="max-w-7xl mx-auto">
            {/* <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Advanced Diff Checker</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Compare text and code differences with advanced features like file upload, ignore options, and export
                functionality.
              </p>
            </div> */}
            <div className="container mx-auto px-4 py-8">
              <main>
                {/* Page Header */}
                <header className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Enhanced Text & Code Diff Checker</h1>
                  <p className="text-lg text-gray-500 mb-4">
                    Compare two pieces of text or code with word-level highlighting and advanced options
                  </p>
                  <p className="text-gray-500">
                    Perfect for comparing code versions, documents, or any text content with detailed word-by-word analysis.
                  </p>
                </header>

                {/* Advanced Options */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Comparison Options
                    </CardTitle>
                    <CardDescription>Customize how the comparison is performed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="word-diff" checked={showWordDiff} onCheckedChange={setShowWordDiff} />
                        <label htmlFor="word-diff" className="text-sm font-medium">
                          Word-level highlighting
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ignore-whitespace" checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
                        <label htmlFor="ignore-whitespace" className="text-sm font-medium">
                          Ignore whitespace
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ignore-case" checked={ignoreCase} onCheckedChange={setIgnoreCase} />
                        <label htmlFor="ignore-case" className="text-sm font-medium">
                          Ignore case
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleLoadExample}>
                      <FileText className="h-4 w-4 mr-2" />
                      Load Example
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyDiff} disabled={stats.total === 0}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Diff
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadDiff} disabled={stats.total === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Statistics */}
                {stats.total > 0 && (
                  <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center border-0 shadow-md">
                      <CardContent className="pt-6 pb-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">{stats.added}</div>
                        <div className="text-sm text-gray-600">Added</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center border-0 shadow-md">
                      <CardContent className="pt-6 pb-4">
                        <div className="text-2xl font-bold text-red-600 mb-1">{stats.removed}</div>
                        <div className="text-sm text-gray-600">Removed</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center border-0 shadow-md">
                      <CardContent className="pt-6 pb-4">
                        <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.modified}</div>
                        <div className="text-sm text-gray-600">Modified</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center border-0 shadow-md">
                      <CardContent className="pt-6 pb-4">
                        <div className="text-2xl font-bold text-gray-600 mb-1">{stats.unchanged}</div>
                        <div className="text-sm text-gray-600">Unchanged</div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Input Section */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  {/* Left Text */}
                  <section>
                    <Card>
                      <CardHeader>
                        <CardTitle>Original Text</CardTitle>
                        <CardDescription>Paste or type your original text/code here</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={leftText}
                          onChange={(e) => setLeftText(e.target.value)}
                          placeholder="Enter your original text here..."
                          className="min-h-[300px] font-mono text-sm"
                          aria-label="Original text input"
                        />
                      </CardContent>
                    </Card>
                  </section>

                  {/* Right Text */}
                  <section>
                    <Card>
                      <CardHeader>
                        <CardTitle>Modified Text</CardTitle>
                        <CardDescription>Paste or type your modified text/code here</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={rightText}
                          onChange={(e) => setRightText(e.target.value)}
                          placeholder="Enter your modified text here..."
                          className="min-h-[300px] font-mono text-sm"
                          aria-label="Modified text input"
                        />
                      </CardContent>
                    </Card>
                  </section>
                </div>

                {/* Diff Result */}
                {diffResult.length > 0 && (
                  <section>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Comparison Result</CardTitle>
                            <CardDescription>
                              {showWordDiff
                                ? "Word-level highlighting shows exact changes within modified lines"
                                : "Line-level comparison showing differences between the texts"}
                            </CardDescription>
                          </div>
                          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                            <TabsList>
                              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                              <TabsTrigger value="unified">Unified</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {viewMode === "side-by-side" ? (
                          <div className="grid grid-cols-2 gap-4">
                            {/* Left Side */}
                            <div className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b">Original</div>
                              <div className="overflow-y-auto">
                                {diffResult.map((line, index) => (
                                  <div
                                    key={`left-${index}`}
                                    className={`px-3 py-1 text-sm font-mono flex ${getLineClassName(line.type)}`}
                                  >
                                    <span className="w-8 text-gray-400 mr-3 flex-shrink-0">{line.leftLineNumber || ""}</span>
                                    <span className="text-gray-700">
                                      {line.leftSegments ? renderSegments(line.leftSegments) : line.leftContent || " "}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right Side */}
                            <div className="border rounded-lg overflow-hidden">
                              <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b">Modified</div>
                              <div className=" overflow-y-auto">
                                {diffResult.map((line, index) => (
                                  <div
                                    key={`right-${index}`}
                                    className={`px-3 py-1 text-sm font-mono flex ${getLineClassName(line.type)}`}
                                  >
                                    <span className="w-8 text-gray-400 mr-3 flex-shrink-0">{line.rightLineNumber || ""}</span>
                                    <span className="text-gray-700">
                                      {line.rightSegments ? renderSegments(line.rightSegments) : line.rightContent || " "}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Unified View */
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b">
                              Unified Diff
                            </div>
                            <div className=" overflow-y-auto">
                              {diffResult.map((line, index) => (
                                <div
                                  key={`unified-${index}`}
                                  className={`px-3 py-1 text-sm font-mono flex ${getLineClassName(line.type)}`}
                                >
                                  <span className="w-16 text-gray-400 mr-3 flex-shrink-0">
                                    {line.leftLineNumber || "-"},{line.rightLineNumber || "-"}
                                  </span>
                                  <span className="w-4 mr-2 flex-shrink-0">
                                    {line.type === "added"
                                      ? "+"
                                      : line.type === "removed"
                                        ? "-"
                                        : line.type === "modified"
                                          ? "~"
                                          : " "}
                                  </span>
                                  <span className="text-gray-700">
                                    {line.type === "modified" && showWordDiff
                                      ? renderSegments(line.rightSegments)
                                      : line.rightContent || line.leftContent || " "}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Tips and Information Section */}
                <section className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Use the Enhanced Diff Checker</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="usage" className="w-full">
                        <TabsList>
                          <TabsTrigger value="usage">Usage</TabsTrigger>
                          <TabsTrigger value="features">Features</TabsTrigger>
                          <TabsTrigger value="tips">Tips</TabsTrigger>
                        </TabsList>
                        <TabsContent value="usage" className="mt-4">
                          <div className="space-y-3 text-sm text-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">How to Compare Text:</h4>
                            <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                              <li>Paste your original text in the left panel</li>
                              <li>Paste your modified text in the right panel</li>
                              <li>Enable word-level highlighting to see exact word changes</li>
                              <li>Use comparison options to ignore whitespace or case</li>
                              <li>Use "Load Example" to see how it works</li>
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="features" className="mt-4">
                          <div className="space-y-3 text-sm text-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Enhanced Features:</h4>
                            <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                              <li>
                                <span className="text-green-600">Green highlighting</span> for added words
                              </li>
                              <li>
                                <span className="text-red-600">Red highlighting</span> for removed words
                              </li>
                              <li>
                                <span className="text-yellow-600">Yellow highlighting</span> for modified lines
                              </li>
                              <li>
                                <strong>Word-level highlighting</strong> shows exact word changes within lines
                              </li>
                              <li>Ignore whitespace and case options for flexible comparison</li>
                              <li>Side-by-side and unified diff views</li>
                              <li>Line numbers for easy reference</li>
                              <li>Statistics showing changes summary</li>
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="tips" className="mt-4">
                          <div className="space-y-3 text-sm text-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Pro Tips:</h4>
                            <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                              <li>Enable word-level highlighting for precise word change detection</li>
                              <li>Use ignore whitespace when comparing code with different formatting</li>
                              <li>Use ignore case for case-insensitive text comparison</li>
                              <li>Word-level highlighting is perfect for prose and documentation</li>
                              <li>Copy the diff result to share with others</li>
                              <li>Download the diff as a text file for records</li>
                              <li>Use unified view for a more compact comparison</li>
                              <li>Perfect for code reviews and document comparisons</li>
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </section>
              </main>
            </div>
          </div>
        </LayoutWithAds>
      </div>
    </div>
  )
}
