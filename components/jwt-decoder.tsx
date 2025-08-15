"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, RotateCcw, CheckCircle, AlertCircle, Key, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

interface JwtParts {
  header: string
  payload: string
  signature: string
}

export default function JwtDecoder() {
  const [input, setInput] = useState("")
  const [decodedHeader, setDecodedHeader] = useState("")
  const [decodedPayload, setDecodedPayload] = useState("")
  const [signature, setSignature] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const base64UrlDecode = useCallback((str: string): string => {
    // Add padding if needed
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) {
      base64 += "="
    }

    try {
      return decodeURIComponent(escape(atob(base64)))
    } catch (err) {
      throw new Error("Invalid base64 encoding")
    }
  }, [])

  const decodeJwt = useCallback(
    (token: string) => {
      if (!token.trim()) {
        setDecodedHeader("")
        setDecodedPayload("")
        setSignature("")
        setIsValid(true)
        setError("")
        return
      }

      try {
        const parts = token.split(".")

        if (parts.length !== 3) {
          throw new Error("Invalid JWT format. JWT must have 3 parts separated by dots.")
        }

        const [headerPart, payloadPart, signaturePart] = parts

        // Decode header
        const headerJson = base64UrlDecode(headerPart)
        const headerFormatted = JSON.stringify(JSON.parse(headerJson), null, 2)

        // Decode payload
        const payloadJson = base64UrlDecode(payloadPart)
        const payloadFormatted = JSON.stringify(JSON.parse(payloadJson), null, 2)

        setDecodedHeader(headerFormatted)
        setDecodedPayload(payloadFormatted)
        setSignature(signaturePart)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid JWT token")
        setDecodedHeader("")
        setDecodedPayload("")
        setSignature("")
      }
    },
    [base64UrlDecode],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    decodeJwt(value)
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
    if (decodedHeader || decodedPayload) {
      const content = `JWT Token Decoded\n\nHeader:\n${decodedHeader}\n\nPayload:\n${decodedPayload}\n\nSignature:\n${signature}`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "jwt-decoded.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "JWT decoded data downloaded successfully",
      })
    }
  }

  const handleClear = () => {
    setInput("")
    setDecodedHeader("")
    setDecodedPayload("")
    setSignature("")
    setIsValid(true)
    setError("")
  }

  const handleLoadExample = () => {
    const example =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    setInput(example)
    decodeJwt(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'JWT Decoder'}
        icon={<Key className="sm:h-5 sm:w-5 h-4 w-4 text-purple-600" />}
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
        } />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JWT Decoder</h1>
              <p className="text-lg text-gray-500 mb-4">
                Decode JWT tokens to view header and payload data for debugging and development
              </p>
              <p className="text-gray-500">
                Secure client-side JWT token decoding. Perfect for debugging authentication tokens, API development, and
                understanding JWT structure.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">JWT Token Input</CardTitle>
                        <CardDescription>Paste your JWT token here to decode it</CardDescription>
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
                      placeholder="Enter your JWT token here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="JWT token input"
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
                        <CardTitle className="mb-2">Decoded JWT</CardTitle>
                        <CardDescription>Header, payload, and signature information</CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={!decodedHeader && !decodedPayload}
                          className="flex-1 sm:w-auto"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <Tabs defaultValue="header" className="flex-1 flex flex-col">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="header">Header</TabsTrigger>
                        <TabsTrigger value="payload">Payload</TabsTrigger>
                        <TabsTrigger value="signature">Signature</TabsTrigger>
                      </TabsList>

                      <TabsContent value="header" className="mt-4 hidden data-[state=active]:flex flex-1 flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Header (Algorithm & Token Type)</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(decodedHeader, "Header")}
                            disabled={!decodedHeader}
                            className="flex-shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          value={decodedHeader}
                          readOnly
                          placeholder="JWT header will appear here..."
                          className="flex-1 font-mono text-sm bg-gray-50 resize-none"
                          aria-label="JWT header output"
                        />
                      </TabsContent>

                      <TabsContent value="payload" className="mt-4 hidden data-[state=active]:flex flex-1 flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Payload (Claims & Data)</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(decodedPayload, "Payload")}
                            disabled={!decodedPayload}
                            className="flex-shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          value={decodedPayload}
                          readOnly
                          placeholder="JWT payload will appear here..."
                          className="flex-1 font-mono text-sm bg-gray-50 resize-none"
                          aria-label="JWT payload output"
                        />
                      </TabsContent>

                      <TabsContent value="signature" className="mt-4 hidden data-[state=active]:flex flex-1 flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Signature (Verification)</label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(signature, "Signature")}
                            disabled={!signature}
                            className="flex-shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Textarea
                          value={signature}
                          readOnly
                          placeholder="JWT signature will appear here..."
                          className="flex-1 font-mono text-sm bg-gray-50 resize-none"
                          aria-label="JWT signature output"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          <Shield className="h-3 w-3 inline mr-1" />
                          Signature verification requires the secret key
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About JWT Tokens</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What are JWT Tokens?</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>JSON Web Tokens (JWT) are compact, URL-safe tokens</li>
                          <li>Used for securely transmitting information between parties</li>
                          <li>Self-contained - carry all necessary information</li>
                          <li>Commonly used for authentication and authorization</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="structure" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">JWT Structure:</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>
                            <strong>Header:</strong> Algorithm and token type
                          </li>
                          <li>
                            <strong>Payload:</strong> Claims and user data
                          </li>
                          <li>
                            <strong>Signature:</strong> Verification hash
                          </li>
                          <li>Format: header.payload.signature</li>
                          <li>Each part is Base64URL encoded</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Security Notes:</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>Decoding only reveals the content, doesn't verify authenticity</li>
                          <li>Signature verification requires the secret key</li>
                          <li>All processing happens in your browser</li>
                          <li>No tokens are sent to external servers</li>
                          <li>Never share tokens containing sensitive information</li>
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
