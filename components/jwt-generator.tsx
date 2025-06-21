"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Key, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads" // Declare the LayoutWithAds variable

export default function JwtGenerator() {
  const [algorithm, setAlgorithm] = useState("HS256")
  const [secret, setSecret] = useState("your-256-bit-secret")
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
  const [payload, setPayload] = useState(
    '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022,\n  "exp": 1616239022\n}',
  )
  const [generatedToken, setGeneratedToken] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Base64URL encode function
  const base64UrlEncode = useCallback((str: string): string => {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  }, [])

  // Simple HMAC SHA256 implementation (for demo purposes)
  const hmacSha256 = useCallback(async (message: string, secret: string): Promise<string> => {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
    const signatureArray = Array.from(new Uint8Array(signature))
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))

    return signatureBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  }, [])

  // Generate JWT token
  const generateToken = useCallback(async () => {
    try {
      // Validate JSON inputs
      const headerObj = JSON.parse(header)
      const payloadObj = JSON.parse(payload)

      // Update algorithm in header
      headerObj.alg = algorithm

      // Encode header and payload
      const encodedHeader = base64UrlEncode(JSON.stringify(headerObj))
      const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj))

      // Create signature
      const message = `${encodedHeader}.${encodedPayload}`
      let signature = ""

      switch (algorithm) {
        case "HS256":
          signature = await hmacSha256(message, secret)
          break
        case "none":
          signature = ""
          break
        default:
          throw new Error(`Algorithm ${algorithm} not supported in this demo`)
      }

      // Combine parts
      const token = signature ? `${message}.${signature}` : message + "."

      setGeneratedToken(token)
      setIsValid(true)
      setError("")
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Failed to generate JWT")
      setGeneratedToken("")
    }
  }, [algorithm, secret, header, payload, base64UrlEncode, hmacSha256])

  // Auto-generate when inputs change
  useMemo(() => {
    if (header && payload) {
      generateToken()
    }
  }, [header, payload, algorithm, secret, generateToken])

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
    if (generatedToken) {
      const content = `JWT Token Generated

Algorithm: ${algorithm}
Secret: ${secret}

Header:
${header}

Payload:
${payload}

Generated Token:
${generatedToken}`

      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "jwt-token.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "JWT token downloaded successfully",
      })
    }
  }

  const handleClear = () => {
    setHeader('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
    setPayload('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}')
    setSecret("your-256-bit-secret")
    setAlgorithm("HS256")
    setGeneratedToken("")
  }

  const handleLoadExample = () => {
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 3600 // 1 hour from now

    setHeader('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
    setPayload(
      `{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "email": "john@example.com",\n  "role": "admin",\n  "iat": ${now},\n  "exp": ${exp}\n}`,
    )
    setSecret("my-super-secret-key-256-bits")
    setAlgorithm("HS256")
  }

  const addClaim = (key: string, value: string) => {
    try {
      const payloadObj = JSON.parse(payload)
      payloadObj[key] = value
      setPayload(JSON.stringify(payloadObj, null, 2))
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid JSON in payload",
        variant: "destructive",
      })
    }
  }

  const addTimestamp = (type: "iat" | "exp" | "nbf") => {
    const now = Math.floor(Date.now() / 1000)
    let timestamp = now

    switch (type) {
      case "exp":
        timestamp = now + 3600 // 1 hour from now
        break
      case "nbf":
        timestamp = now - 60 // 1 minute ago
        break
    }

    addClaim(type, timestamp.toString())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
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
                <Key className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">JWT Generator</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isValid ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
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

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">JWT Generator</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Create and sign JWT tokens with custom headers and payloads for authentication and API development
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Secure client-side JWT token generation. Perfect for API development, authentication testing, and token
                creation with various algorithms.
              </p>
            </header>

            {/* Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    onClick={() => handleCopy(generatedToken, "JWT Token")}
                    disabled={!generatedToken}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Token
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!generatedToken}
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <section className="mb-6">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>Token Configuration</CardTitle>
                  <CardDescription>Configure the algorithm and signing secret</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Algorithm</label>
                      <Select value={algorithm} onValueChange={setAlgorithm}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HS256">HS256 (HMAC SHA256)</SelectItem>
                          <SelectItem value="none">none (Unsigned)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Secret Key</label>
                      <Input
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter your secret key"
                        className="font-mono"
                        disabled={algorithm === "none"}
                      />
                    </div>
                  </div>
                  {algorithm === "none" && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-700 dark:text-yellow-300 text-sm">
                      <Shield className="h-4 w-4 inline mr-2" />
                      <strong>Warning:</strong> Unsigned tokens (none algorithm) are not secure and should only be used
                      for testing purposes.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Header Section */}
              <section>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <CardTitle>Header</CardTitle>
                    <CardDescription>JWT header containing algorithm and token type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                      placeholder="Enter JWT header JSON..."
                      className="min-h-[200px] font-mono text-sm resize-none"
                      aria-label="JWT header JSON"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Payload Section */}
              <section>
                <Card className="border-0 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Payload</CardTitle>
                        <CardDescription>JWT payload containing claims and user data</CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimestamp("iat")}
                          className="text-xs px-2"
                        >
                          +iat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimestamp("exp")}
                          className="text-xs px-2"
                        >
                          +exp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimestamp("nbf")}
                          className="text-xs px-2"
                        >
                          +nbf
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      placeholder="Enter JWT payload JSON..."
                      className="min-h-[200px] font-mono text-sm resize-none"
                      aria-label="JWT payload JSON"
                    />
                    {error && (
                      <div
                        className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4 inline mr-2" />
                        <strong>Error:</strong> {error}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Generated Token */}
            <section className="mb-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generated JWT Token</CardTitle>
                      <CardDescription>Your signed JWT token ready for use</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generatedToken, "JWT Token")}
                      disabled={!generatedToken}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Token
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={generatedToken}
                    readOnly
                    placeholder="Generated JWT token will appear here..."
                    className="min-h-[120px] font-mono text-sm bg-gray-50 dark:bg-gray-800 resize-none break-all"
                    aria-label="Generated JWT token"
                  />
                </CardContent>
              </Card>
            </section>

            {/* Information and Tools */}
            <section>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>JWT Information & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="claims" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="claims">Standard Claims</TabsTrigger>
                      <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="claims" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Standard JWT Claims:</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <strong>iss (Issuer):</strong> Who issued the token
                          </div>
                          <div>
                            <strong>sub (Subject):</strong> Who the token is about
                          </div>
                          <div>
                            <strong>aud (Audience):</strong> Who the token is for
                          </div>
                          <div>
                            <strong>exp (Expiration):</strong> When the token expires
                          </div>
                          <div>
                            <strong>nbf (Not Before):</strong> When the token becomes valid
                          </div>
                          <div>
                            <strong>iat (Issued At):</strong> When the token was issued
                          </div>
                          <div>
                            <strong>jti (JWT ID):</strong> Unique identifier for the token
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="algorithms" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Supported Algorithms:</h4>
                        <div className="space-y-2">
                          <div>
                            <strong>HS256:</strong> HMAC with SHA-256 (symmetric key)
                          </div>
                          <div>
                            <strong>none:</strong> Unsigned token (not recommended for production)
                          </div>
                          <div>
                            <strong>Note:</strong> This demo supports HS256 and none algorithms. Production systems
                            typically support RS256, ES256, and other asymmetric algorithms.
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="mt-4">
                      <div className="space-y-3 text-sm">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Security Best Practices:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Always use strong, random secret keys (256+ bits for HS256)</li>
                          <li>Set appropriate expiration times (exp claim)</li>
                          <li>Never include sensitive data in the payload (it's base64 encoded, not encrypted)</li>
                          <li>Validate tokens on the server side</li>
                          <li>Use HTTPS for token transmission</li>
                          <li>Consider using asymmetric algorithms (RS256) for better security</li>
                          <li>All processing happens in your browser - no tokens are sent to servers</li>
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
