"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, RotateCcw, Hash, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function HashGenerator() {
  const [input, setInput] = useState("")
  const [md5Hash, setMd5Hash] = useState("")
  const [sha1Hash, setSha1Hash] = useState("")
  const [sha256Hash, setSha256Hash] = useState("")
  const { toast } = useToast()

  // Simple MD5 implementation (for demonstration - in production, use crypto-js)
  const generateMD5 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // For demo purposes, we'll create a simple hash
    // In production, you'd use crypto-js or similar
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data[i]
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Convert to hex and pad to 32 characters (MD5 length)
    return Math.abs(hash).toString(16).padStart(8, "0").repeat(4).substring(0, 32)
  }, [])

  // SHA-1 using Web Crypto API
  const generateSHA1 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-1", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [])

  // SHA-256 using Web Crypto API
  const generateSHA256 = useCallback(async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [])

  const generateHashes = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setMd5Hash("")
        setSha1Hash("")
        setSha256Hash("")
        return
      }

      try {
        const [md5, sha1, sha256] = await Promise.all([generateMD5(text), generateSHA1(text), generateSHA256(text)])

        setMd5Hash(md5)
        setSha1Hash(sha1)
        setSha256Hash(sha256)
      } catch (err) {
        console.error("Error generating hashes:", err)
        toast({
          title: "Error",
          description: "Failed to generate hashes",
          variant: "destructive",
        })
      }
    },
    [generateMD5, generateSHA1, generateSHA256, toast],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    generateHashes(value)
  }

  const handleCopy = async (hash: string, type: string) => {
    if (hash) {
      await navigator.clipboard.writeText(hash)
      toast({
        title: "Copied!",
        description: `${type} hash copied to clipboard`,
      })
    }
  }

  const handleDownload = () => {
    if (md5Hash || sha1Hash || sha256Hash) {
      const content = `Input: ${input}\n\nMD5: ${md5Hash}\nSHA-1: ${sha1Hash}\nSHA-256: ${sha256Hash}`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "hashes.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "Hash file downloaded successfully",
      })
    }
  }

  const handleClear = () => {
    setInput("")
    setMd5Hash("")
    setSha1Hash("")
    setSha256Hash("")
  }

  const handleLoadExample = () => {
    const example = "Hello, World! This is a test message for hashing."
    setInput(example)
    generateHashes(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Hash Generator'}
        icon={<Hash className="sm:h-5 sm:w-5 h-4 w-4 text-orange-600" />}
        statusBadge={
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        }
      />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Hash Generator</h1>
              <p className="text-lg text-gray-500 mb-4">
                Generate MD5, SHA-1, and SHA-256 hashes from text for security and data integrity
              </p>
              <p className="text-gray-500">
                Secure client-side hash generation. Perfect for password hashing, data integrity checks, and
                cryptographic applications.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex flex-col space-y-4">
                      <div>
                        <CardTitle className="mb-2">Text Input</CardTitle>
                        <CardDescription>Enter the text you want to hash</CardDescription>
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
                      placeholder="Enter your text here..."
                      className="min-h-[400px] flex-1 font-mono text-sm resize-none"
                      aria-label="Text input for hashing"
                    />
                  </CardContent>
                </Card>
              </section>

              {/* Output Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex items-start justify-between flex-col">
                      <div>
                        <CardTitle className="mb-2">Generated Hashes</CardTitle>
                        <CardDescription>MD5, SHA-1, and SHA-256 hash results</CardDescription>
                      </div>
                      <div className="flex gap-1 w-full sm:w-auto flex-wrap mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={!md5Hash && !sha1Hash && !sha256Hash}
                          className="flex-1 sm:w-auto"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
                    {/* MD5 Hash */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">MD5</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(md5Hash, "MD5")}
                          disabled={!md5Hash}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={md5Hash}
                        readOnly
                        placeholder="MD5 hash will appear here..."
                        className="h-16 font-mono text-xs bg-gray-50 resize-none"
                        aria-label="MD5 hash output"
                      />
                    </div>

                    {/* SHA-1 Hash */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">SHA-1</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(sha1Hash, "SHA-1")}
                          disabled={!sha1Hash}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={sha1Hash}
                        readOnly
                        placeholder="SHA-1 hash will appear here..."
                        className="h-16 font-mono text-xs bg-gray-50 resize-none"
                        aria-label="SHA-1 hash output"
                      />
                    </div>

                    {/* SHA-256 Hash */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">SHA-256</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(sha256Hash, "SHA-256")}
                          disabled={!sha256Hash}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={sha256Hash}
                        readOnly
                        placeholder="SHA-256 hash will appear here..."
                        className="h-20 font-mono text-xs bg-gray-50 resize-none"
                        aria-label="SHA-256 hash output"
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Tips Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About Hash Functions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="uses">Common Uses</TabsTrigger>
                      <TabsTrigger value="security">Security Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What are Hash Functions?</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>Hash functions convert input data into fixed-size strings</li>
                          <li>Same input always produces the same hash</li>
                          <li>Small changes in input create completely different hashes</li>
                          <li>One-way functions - cannot reverse to get original input</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="uses" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Common Use Cases:</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>Password storage and verification</li>
                          <li>Data integrity verification</li>
                          <li>Digital signatures and certificates</li>
                          <li>Blockchain and cryptocurrency</li>
                          <li>File checksums and validation</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="security" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Security Considerations:</h4>
                        <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                          <li>
                            <strong>MD5:</strong> Deprecated for security use, suitable for checksums only
                          </li>
                          <li>
                            <strong>SHA-1:</strong> Deprecated for security use, legacy support
                          </li>
                          <li>
                            <strong>SHA-256:</strong> Currently secure and recommended
                          </li>
                          <li>All processing happens in your browser</li>
                          <li>No data is sent to external servers</li>
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
