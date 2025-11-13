"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Search, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

interface Match {
  match: string
  index: number
  groups: string[]
  namedGroups: Record<string, string>
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  })
  const [testString, setTestString] = useState("")
  const [replacement, setReplacement] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Create regex from pattern and flags
  const regex = useMemo(() => {
    if (!pattern) return null

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case "global":
              return "g"
            case "ignoreCase":
              return "i"
            case "multiline":
              return "m"
            case "dotAll":
              return "s"
            case "unicode":
              return "u"
            case "sticky":
              return "y"
            default:
              return ""
          }
        })
        .join("")

      const regexObj = new RegExp(pattern, flagString)
      setIsValid(true)
      setError("")
      return regexObj
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid regular expression")
      return null
    }
  }, [pattern, flags])

  // Find all matches
  const matches = useMemo(() => {
    if (!regex || !testString) return []

    const results: Match[] = []
    let match

    if (flags.global) {
      while ((match = regex.exec(testString)) !== null) {
        results.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || {},
        })

        // Prevent infinite loop
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      match = regex.exec(testString)
      if (match) {
        results.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || {},
        })
      }
    }

    return results
  }, [regex, testString, flags.global])

  // Highlight matches in test string
  const highlightedText = useMemo(() => {
    if (!testString || matches.length === 0) return testString

    let result = ""
    let lastIndex = 0

    matches.forEach((match, i) => {
      // Add text before match
      result += testString.slice(lastIndex, match.index)
      // Add highlighted match
      result += `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${match.match}</mark>`
      lastIndex = match.index + match.match.length
    })

    // Add remaining text
    result += testString.slice(lastIndex)

    return result
  }, [testString, matches])

  // Perform replacement
  const replacementResult = useMemo(() => {
    if (!regex || !testString || !replacement) return ""

    try {
      return testString.replace(regex, replacement)
    } catch (err) {
      return `Error: ${err instanceof Error ? err.message : "Replacement failed"}`
    }
  }, [regex, testString, replacement])

  const handleFlagChange = (flag: keyof typeof flags, checked: boolean) => {
    setFlags((prev) => ({ ...prev, [flag]: checked }))
  }

  const handleCopy = async (content: string, type: string) => {
    if (content) {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    }
  }

  const handleDownload = () => {
    const content = `Regular Expression Test Results

Pattern: ${pattern}
Flags: ${Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join(", ")}

Test String:
${testString}

Matches Found: ${matches.length}
${matches
        .map(
          (match, i) =>
            `Match ${i + 1}: "${match.match}" at position ${match.index}${match.groups.length > 0 ? `\nGroups: ${match.groups.join(", ")}` : ""
            }`,
        )
        .join("\n")}

${replacement ? `Replacement Result:\n${replacementResult}` : ""}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "regex-test-results.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Regex test results downloaded successfully",
    })
  }

  const handleClear = () => {
    setPattern("")
    setTestString("")
    setReplacement("")
    setFlags({
      global: true,
      ignoreCase: false,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false,
    })
  }

  const handleLoadExample = () => {
    setPattern("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b")
    setTestString(`Contact us at:
support@example.com
sales@company.org
invalid-email
admin@test.co.uk
user123@domain.net`)
    setReplacement("[EMAIL]")
    setFlags({
      global: true,
      ignoreCase: true,
      multiline: false,
      dotAll: false,
      unicode: false,
      sticky: false,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Regex Tester'}
        icon={<Search className="sm:h-5 sm:w-5 h-4 w-4 text-green-600" />}
        statusBadge={
          <>
            {isValid ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px]">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="destructive" className="!text-[10px]">
                <AlertCircle className="h-3 w-3 mr-1" />
                Invalid
              </Badge>
            )}
            <Badge variant="outline" className="bg-blue-100 !ms-1 text-blue-800 text-[10px] ">
              <Zap className="h-3 w-3 mr-1" />
              {matches.length} matches
            </Badge>
          </>
        }
      />

      {/* <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 ml-0">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="!px-1">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Search className="h-6 w-6 text-orange-600" />
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-gray-100">Regular Expression Tester</h1>
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
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Zap className="h-3 w-3 mr-1 text-xs" />
                {matches.length} matches
              </Badge>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Regular Expression Tester</h1>
              <p className="text-lg text-gray-600 mb-4">
                Test and debug regular expressions with real-time matching and detailed results
              </p>
              <p className="text-gray-500">
                Perfect for pattern matching, data validation, and advanced text processing, this powerful and intuitive Regular Expression (Regex) tester allows you to write, test, debug, and optimize your patterns instantly. It provides real-time feedback with visual highlighting, making it easy to identify matches, groups, and errors efficiently. Ideal for developers, data analysts, and QA testers, it helps validate input formats, extract data efficiently, and clean or transform text effortlessly. The tool supports multiple regex flags, advanced options, and cross-language compatibility, ensuring accurate results across different environments. Whether you’re optimizing search queries or validating user input, this interactive Regex tester simplifies complex expressions with clarity and precision.
              </p>
            </header>

            {/* Controls */}
            <div className="mb-6">
              <div className="flex flex-row sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" size="sm" onClick={handleLoadExample} className="w-full sm:w-auto">
                    Load Example
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClear} className="w-full sm:w-auto">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(pattern, "Pattern")}
                    disabled={!pattern}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Pattern
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!pattern || !testString}
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Results
                  </Button>
                </div>
              </div>
            </div>

            {/* Pattern Input */}
            <section className="mb-6">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>Regular Expression Pattern</CardTitle>
                  <CardDescription>Enter your regex pattern and configure flags</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-mono">/</span>
                    <Input
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="Enter your regex pattern here..."
                      className="flex-1 font-mono"
                      aria-label="Regular expression pattern"
                    />
                    <span className="text-lg font-mono">/</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {Object.entries(flags)
                        .filter(([_, enabled]) => enabled)
                        .map(([flag]) => {
                          switch (flag) {
                            case "global":
                              return "g"
                            case "ignoreCase":
                              return "i"
                            case "multiline":
                              return "m"
                            case "dotAll":
                              return "s"
                            case "unicode":
                              return "u"
                            case "sticky":
                              return "y"
                            default:
                              return ""
                          }
                        })
                        .join("")}
                    </span>
                  </div>

                  {error && (
                    <div
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
                      role="alert"
                    >
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      <strong>Error:</strong> {error}
                    </div>
                  )}

                  {/* Flags */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="global"
                        checked={flags.global}
                        onCheckedChange={(checked) => handleFlagChange("global", checked as boolean)}
                      />
                      <label htmlFor="global" className="text-sm font-medium">
                        Global (g)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ignoreCase"
                        checked={flags.ignoreCase}
                        onCheckedChange={(checked) => handleFlagChange("ignoreCase", checked as boolean)}
                      />
                      <label htmlFor="ignoreCase" className="text-sm font-medium">
                        Ignore Case (i)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multiline"
                        checked={flags.multiline}
                        onCheckedChange={(checked) => handleFlagChange("multiline", checked as boolean)}
                      />
                      <label htmlFor="multiline" className="text-sm font-medium">
                        Multiline (m)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dotAll"
                        checked={flags.dotAll}
                        onCheckedChange={(checked) => handleFlagChange("dotAll", checked as boolean)}
                      />
                      <label htmlFor="dotAll" className="text-sm font-medium">
                        Dot All (s)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unicode"
                        checked={flags.unicode}
                        onCheckedChange={(checked) => handleFlagChange("unicode", checked as boolean)}
                      />
                      <label htmlFor="unicode" className="text-sm font-medium">
                        Unicode (u)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sticky"
                        checked={flags.sticky}
                        onCheckedChange={(checked) => handleFlagChange("sticky", checked as boolean)}
                      />
                      <label htmlFor="sticky" className="text-sm font-medium">
                        Sticky (y)
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Test String Input */}
              <section>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <CardTitle>Test String</CardTitle>
                    <CardDescription>Enter the text you want to test against your regex pattern</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      placeholder="Enter your test string here..."
                      className="min-h-[300px] font-mono text-sm resize-none"
                      aria-label="Test string input"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Highlighted Results */}
              <section>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <CardTitle>Highlighted Matches</CardTitle>
                    <CardDescription>Visual representation of matches in your test string</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="min-h-[300px] p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: highlightedText || "No matches found" }}
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Results and Tools */}
            <section>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>Results & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="matches" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger className="text-xs" value="matches">Matches ({matches.length})</TabsTrigger>
                      <TabsTrigger className="text-xs" value="replace">Replace</TabsTrigger>
                      <TabsTrigger className="text-xs" value="reference">Reference</TabsTrigger>
                    </TabsList>

                    <TabsContent value="matches" className="mt-4">
                      <div className="space-y-4">
                        {matches.length > 0 ? (
                          matches.map((match, index) => (
                            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">Match {index + 1}</h4>
                                <Badge variant="outline">Position {match.index}</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Full Match:</strong>{" "}
                                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{match.match}</code>
                                </div>
                                {match.groups.length > 0 && (
                                  <div>
                                    <strong>Groups:</strong>
                                    <ul className="list-disc list-inside ml-4">
                                      {match.groups.map((group, i) => (
                                        <li key={i}>
                                          Group {i + 1}:{" "}
                                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                                            {group || "(empty)"}
                                          </code>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {Object.keys(match.namedGroups).length > 0 && (
                                  <div>
                                    <strong>Named Groups:</strong>
                                    <ul className="list-disc list-inside ml-4">
                                      {Object.entries(match.namedGroups).map(([name, value]) => (
                                        <li key={name}>
                                          {name}:{" "}
                                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{value}</code>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No matches found. Try adjusting your pattern or test string.
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="replace" className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Replacement String</label>
                          <Input
                            value={replacement}
                            onChange={(e) => setReplacement(e.target.value)}
                            placeholder="Enter replacement string (use $1, $2 for groups)"
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Result</label>
                          <Textarea
                            value={replacementResult}
                            readOnly
                            className="min-h-[200px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                            placeholder="Replacement result will appear here..."
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(replacementResult, "Replacement result")}
                          disabled={!replacementResult}
                          className="w-full sm:w-auto"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Result
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="reference" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Common Patterns</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <strong>Email:</strong>
                              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                                [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{"{2,}"}
                              </code>
                            </div>
                            <div>
                              <strong>Phone (US):</strong>
                              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                                ^$$?([0-9]{"{3}"})$$?[-. ]?([0-9]{"{3}"})[-.●]?([0-9]{"{4}"})$
                              </code>
                            </div>
                            <div>
                              <strong>URL:</strong>
                              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                                https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{"{1,256}"}
                              </code>
                            </div>
                            <div>
                              <strong>IP Address:</strong>
                              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 text-xs">
                                ^(?:[0-9]{"{1,3}"}\.){"{3}"}[0-9]{"{1,3}"}$
                              </code>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Special Characters</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            <div>
                              <code>.</code> - Any character
                            </div>
                            <div>
                              <code>*</code> - 0 or more
                            </div>
                            <div>
                              <code>+</code> - 1 or more
                            </div>
                            <div>
                              <code>?</code> - 0 or 1
                            </div>
                            <div>
                              <code>^</code> - Start of string
                            </div>
                            <div>
                              <code>$</code> - End of string
                            </div>
                            <div>
                              <code>\d</code> - Digit
                            </div>
                            <div>
                              <code>\w</code> - Word character
                            </div>
                            <div>
                              <code>\s</code> - Whitespace
                            </div>
                            <div>
                              <code>[abc]</code> - Character class
                            </div>
                            <div>
                              <code>(abc)</code> - Capture group
                            </div>
                            <div>
                              <code>(?:abc)</code> - Non-capture group
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
