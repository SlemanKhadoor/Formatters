"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function Base64Converter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const encodeBase64 = useCallback((text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch (err) {
      throw new Error("Failed to encode to Base64")
    }
  }, [])

  const decodeBase64 = useCallback((text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)))
    } catch (err) {
      throw new Error("Invalid Base64 string")
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
        const result = mode === "encode" ? encodeBase64(text) : decodeBase64(text)
        setOutput(result)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Conversion error")
        setOutput("")
      }
    },
    [mode, encodeBase64, decodeBase64],
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
        description: `${mode === "encode" ? "Encoded" : "Decoded"} text copied to clipboard`,
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `base64-${mode}.txt`
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
        ? "Hello, World! This is a test message."
        : "SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdGVzdCBtZXNzYWdlLg=="
    setInput(example)
    handleConvert(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Base64 Tool'}
        icon={<Lock className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Base64 Encoder & Decoder</h1>
              <p className="text-lg text-gray-600 mb-4">
                Encode text to Base64 or decode Base64 strings back to readable text
              </p>
              <p className="text-gray-500">
                Experience secure and efficient Base64 encoding and decoding directly in your browser with our professional tool. It allows you to convert text, files, and binary data into Base64 format for safe data transmission, API authentication, and web development. The encoder ensures your data remains intact and readable across platforms using proper padding and character mapping, while the decoder accurately restores the original data without loss. Whether you’re handling sensitive information, creating secure tokens, or embedding images in HTML or CSS, this tool provides reliable performance and strong security. It features real-time conversion, syntax validation, and instant error detection for precise results. Use it directly online, no installation required, and enjoy fast, accurate, and private encoding and decoding. Perfect for developers and cybersecurity experts.
              </p>
            </header>

            {/* Mode Selection */}
            <div className="mb-6">
              <Tabs value={mode} onValueChange={(value) => handleModeChange(value as "encode" | "decode")}>
                <TabsList>
                  <TabsTrigger value="encode">Encode to Base64</TabsTrigger>
                  <TabsTrigger value="decode">Decode from Base64</TabsTrigger>
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
                        <CardTitle className="mb-2">{mode === "encode" ? "Text Input" : "Base64 Input"}</CardTitle>
                        <CardDescription>
                          {mode === "encode"
                            ? "Enter the text you want to encode to Base64"
                            : "Enter the Base64 string you want to decode"}
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
                      placeholder={mode === "encode" ? "Enter your text here..." : "Enter your Base64 string here..."}
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label={mode === "encode" ? "Text input" : "Base64 input"}
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
                        <CardTitle className="mb-2">{mode === "encode" ? "Base64 Output" : "Decoded Text"}</CardTitle>
                        <CardDescription>
                          {mode === "encode" ? "Base64 encoded result" : "Decoded text result"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
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
                        mode === "encode" ? "Base64 encoded text will appear here..." : "Decoded text will appear here..."
                      }
                      className="min-h-[400px] flex-1 font-mono text-sm bg-gray-50 resize-none"
                      aria-label={mode === "encode" ? "Base64 output" : "Decoded text output"}
                    />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About Base64 Encoding</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="uses">Common Uses</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What is Base64?</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Base64 is a binary-to-text encoding scheme</li>
                          <li>Converts binary data into ASCII characters</li>
                          <li>Uses 64 characters: A-Z, a-z, 0-9, +, /</li>
                          <li>Often used for data transmission over text-based protocols</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="uses" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Common Use Cases:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Email attachments (MIME encoding)</li>
                          <li>Embedding images in HTML/CSS (data URLs)</li>
                          <li>API authentication tokens</li>
                          <li>Storing binary data in JSON/XML</li>
                          <li>URL-safe data transmission</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Security Notes:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Base64 is encoding, NOT encryption</li>
                          <li>Data is easily readable when decoded</li>
                          <li>All processing happens in your browser</li>
                          <li>No data is sent to external servers</li>
                          <li>Use HTTPS for sensitive data transmission</li>
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
