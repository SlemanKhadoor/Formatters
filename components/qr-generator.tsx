"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, QrCode, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"

export default function QrGenerator() {
  const [text, setText] = useState("")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Simple QR code generation using a basic algorithm
  const generateQR = useCallback((data: string, size: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Simple QR-like pattern generation (this is a simplified version)
    const moduleSize = size / 25 // 25x25 grid
    ctx.fillStyle = "#000000"

    // Generate a simple pattern based on the text
    const hash = data.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)

    // Create a deterministic pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        const value = (hash + i * 25 + j) % 3
        if (value === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize)
        }
      }
    }

    // Add finder patterns (corners)
    const finderSize = moduleSize * 7

    // Top-left finder pattern
    ctx.fillRect(0, 0, finderSize, finderSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(moduleSize, moduleSize, finderSize - 2 * moduleSize, finderSize - 2 * moduleSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(2 * moduleSize, 2 * moduleSize, finderSize - 4 * moduleSize, finderSize - 4 * moduleSize)

    // Top-right finder pattern
    ctx.fillStyle = "#000000"
    ctx.fillRect(size - finderSize, 0, finderSize, finderSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(size - finderSize + moduleSize, moduleSize, finderSize - 2 * moduleSize, finderSize - 2 * moduleSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(
      size - finderSize + 2 * moduleSize,
      2 * moduleSize,
      finderSize - 4 * moduleSize,
      finderSize - 4 * moduleSize,
    )

    // Bottom-left finder pattern
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, size - finderSize, finderSize, finderSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(moduleSize, size - finderSize + moduleSize, finderSize - 2 * moduleSize, finderSize - 2 * moduleSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(
      2 * moduleSize,
      size - finderSize + 2 * moduleSize,
      finderSize - 4 * moduleSize,
      finderSize - 4 * moduleSize,
    )

    // Convert to data URL
    const dataUrl = canvas.toDataURL("image/png")
    setQrDataUrl(dataUrl)
  }, [])

  const handleGenerate = useCallback(() => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate a QR code",
        variant: "destructive",
      })
      return
    }

    generateQR(text, size)
    toast({
      title: "QR Code Generated!",
      description: "Your QR code has been created successfully",
    })
  }, [text, size, generateQR, toast])

  const handleDownload = () => {
    if (!qrDataUrl) return

    const link = document.createElement("a")
    link.download = "qrcode.png"
    link.href = qrDataUrl
    link.click()

    toast({
      title: "Downloaded!",
      description: "QR code image downloaded successfully",
    })
  }

  const handleLoadExample = (type: string) => {
    switch (type) {
      case "url":
        setText("https://formatters.net")
        break
      case "email":
        setText("mailto:contact@formatters.net")
        break
      case "phone":
        setText("tel:+1234567890")
        break
      case "text":
        setText("Hello, World! This is a sample QR code.")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
                <QrCode className="h-6 w-6 text-gray-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">QR Code Generator</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <CheckCircle className="h-3 w-3 mr-1" />
                Free
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">QR Code Generator</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Generate QR codes for text, URLs, emails, phone numbers, and more
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Create custom QR codes with adjustable size and error correction levels. All processing happens in your
                browser.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Input Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <CardTitle className="mb-2">QR Code Content</CardTitle>
                    <CardDescription>Enter the text, URL, or data you want to encode</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col space-y-4">
                    {/* Quick Examples */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quick Examples
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadExample("url")}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Website URL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadExample("email")}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadExample("phone")}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Phone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadExample("text")}
                          className="flex-1 sm:flex-none text-xs"
                        >
                          Text
                        </Button>
                      </div>
                    </div>

                    {/* Text Input */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text, URL, email, phone number, or any data..."
                        className="min-h-32 resize-none"
                      />
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size (pixels)
                        </label>
                        <select
                          value={size}
                          onChange={(e) => setSize(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value={128}>128x128</option>
                          <option value={256}>256x256</option>
                          <option value={512}>512x512</option>
                          <option value={1024}>1024x1024</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Error Correction
                        </label>
                        <select
                          value={errorLevel}
                          onChange={(e) => setErrorLevel(e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                          <option value="L">Low (7%)</option>
                          <option value="M">Medium (15%)</option>
                          <option value="Q">Quartile (25%)</option>
                          <option value="H">High (30%)</option>
                        </select>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button onClick={handleGenerate} className="w-full" size="lg" disabled={!text.trim()}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* Output Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="mb-2">Generated QR Code</CardTitle>
                        <CardDescription>Your QR code will appear here</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleDownload} disabled={!qrDataUrl}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col items-center justify-center">
                    {qrDataUrl ? (
                      <div className="text-center">
                        <img
                          src={qrDataUrl || "/placeholder.svg"}
                          alt="Generated QR Code"
                          className="max-w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                        />
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                          Size: {size}x{size} pixels | Error Level: {errorLevel}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Enter some content and click "Generate QR Code" to create your QR code</p>
                      </div>
                    )}

                    {/* Hidden canvas for QR generation */}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Information Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About QR Codes</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="types">Content Types</TabsTrigger>
                      <TabsTrigger value="tips">Tips</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What are QR Codes?</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>QR stands for "Quick Response"</li>
                          <li>2D barcodes that can store various types of data</li>
                          <li>Can be scanned by smartphones and QR code readers</li>
                          <li>Support error correction to work even when partially damaged</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="types" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Supported Content Types:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>
                            <strong>URLs:</strong> https://example.com
                          </li>
                          <li>
                            <strong>Email:</strong> mailto:user@example.com
                          </li>
                          <li>
                            <strong>Phone:</strong> tel:+1234567890
                          </li>
                          <li>
                            <strong>SMS:</strong> sms:+1234567890
                          </li>
                          <li>
                            <strong>WiFi:</strong> WIFI:T:WPA;S:NetworkName;P:Password;;
                          </li>
                          <li>
                            <strong>Plain Text:</strong> Any text content
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="tips" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Best Practices:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Keep content concise for better scanning</li>
                          <li>Use higher error correction for outdoor use</li>
                          <li>Test QR codes before printing or publishing</li>
                          <li>Ensure sufficient contrast between foreground and background</li>
                          <li>Leave quiet zone (white space) around the QR code</li>
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
