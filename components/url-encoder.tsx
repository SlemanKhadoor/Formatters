"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function UrlEncoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const encodeUrl = useCallback((text: string): string => {
    try {
      return encodeURIComponent(text)
    } catch (err) {
      throw new Error("Failed to encode URL")
    }
  }, [])

  const decodeUrl = useCallback((text: string): string => {
    try {
      return decodeURIComponent(text)
    } catch (err) {
      throw new Error("Invalid URL-encoded string")
    }
  }, [])

  const handleConvert = useCallback(
    (text: string) => {
      if (!text.trim()) {
        setOutput("")
        setIsValid(true)
        setError("")
        return
      }

      try {
        const result = mode === "encode" ? encodeUrl(text) : decodeUrl(text)
        setOutput(result)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Conversion error")
        setOutput("")
      }
    },
    [mode, encodeUrl, decodeUrl],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    handleConvert(value)
  }

  const handleModeChange = (newMode: "encode" | "decode") => {
    setMode(newMode)
    if (input.trim()) {
      handleConvert(input)
    }
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: `${mode === "encode" ? "Encoded" : "Decoded"} URL copied to clipboard`,
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `url-${mode}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "File downloaded successfully",
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
    const example =
      mode === "encode"
        ? "https://example.com/search?q=hello world&category=tech&sort=date"
        : "https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Dtech%26sort%3Ddate"
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'URL Encoder & Decoder'}
        icon={<Globe className="sm:h-5 sm:w-5 h-4 w-4 text-green-600" />}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">URL Encoder & Decoder</h1>
              <p className="text-lg text-gray-600 mb-4">Encode URLs for web safety or decode URL-encoded strings</p>
              <p className="text-gray-500">
                Securely encode and decode URLs directly in your browser with our professional and reliable URL encoder and decoder tool. It helps you safely handle special characters, query parameters, and complex data within web links, ensuring your URLs remain valid, secure, and properly formatted. Ideal for developers working on web applications, APIs, or integrations that require accurate and consistent URL handling. The tool automatically detects unsafe or invalid characters and converts them into a clean, encoded format for reliable data transmission. It also decodes URLs back to their readable form instantly, preserving the original structure and content without any errors. Featuring real-time conversion, syntax validation, and instant feedback, it guarantees a smooth, efficient workflow. Use it online, no installation or setup required, and enjoy secure, fast, and precise URL encoding and decoding right from your browser.
              </p>
            </header>

            {/* Mode Selection */}
            <div className="mb-6">
              <Tabs value={mode} onValueChange={(value) => handleModeChange(value as "encode" | "decode")}>
                <TabsList>
                  <TabsTrigger value="encode">Encode URL</TabsTrigger>
                  <TabsTrigger value="decode">Decode URL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">{mode === "encode" ? "URL Input" : "Encoded URL Input"}</CardTitle>
                        <CardDescription>
                          {mode === "encode"
                            ? "Enter the URL you want to encode"
                            : "Enter the URL-encoded string you want to decode"}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={handleLoadExample} className="flex-1 sm:w-auto">
                          Load Example
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClear} className="flex-1 sm:w-auto">
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
                      placeholder={mode === "encode" ? "Enter your URL here..." : "Enter your encoded URL here..."}
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label={mode === "encode" ? "URL input" : "Encoded URL input"}
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
                        <CardTitle className="mb-2">{mode === "encode" ? "Encoded URL" : "Decoded URL"}</CardTitle>
                        <CardDescription>
                          {mode === "encode" ? "URL-encoded result" : "Decoded URL result"}
                        </CardDescription>
                      </div>
                      <div className="flex  gap-1 w-full sm:w-auto flex-wrap mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          disabled={!output || !isValid}
                          className="flex-1 sm:w-auto"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={!output || !isValid}
                          className="flex-1 sm:w-auto"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Textarea
                      value={output}
                      readOnly
                      placeholder={
                        mode === "encode" ? "URL-encoded text will appear here..." : "Decoded URL will appear here..."
                      }
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label={mode === "encode" ? "Encoded URL output" : "Decoded URL output"}
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About URL Encoding</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="uses">Common Uses</TabsTrigger>
                      <TabsTrigger value="characters">Special Characters</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What is URL Encoding?</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>URL encoding converts special characters to percent-encoded format</li>
                          <li>Also known as percent-encoding or URI encoding</li>
                          <li>Ensures URLs are transmitted safely over the internet</li>
                          <li>Required for special characters in query parameters</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="uses" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Common Use Cases:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Query parameters with spaces or special characters</li>
                          <li>Form data submission</li>
                          <li>API endpoint parameters</li>
                          <li>Search queries in URLs</li>
                          <li>File paths with special characters</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="characters" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Common Encodings:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Space → %20</li>
                          <li>& → %26</li>
                          <li>= → %3D</li>
                          <li>? → %3F</li>
                          <li># → %23</li>
                          <li>+ → %2B</li>
                        </ul>
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
