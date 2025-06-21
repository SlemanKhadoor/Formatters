"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Upload, FileImage, X } from "lucide-react"

export default function ImageToBase64Converter() {
  const [base64Output, setBase64Output] = useState("")
  const [error, setError] = useState("")
  const [imageInfo, setImageInfo] = useState<{
    name: string
    size: number
    type: string
    dimensions?: { width: number; height: number }
  } | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    processFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    processFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const processFile = (file: File) => {
    setError("")

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("File size must be less than 10MB")
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result as string
      setBase64Output(result)
      setPreviewUrl(result)

      // Get image dimensions
      const img = new Image()
      img.onload = () => {
        setImageInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: { width: img.width, height: img.height },
        })
      }
      img.src = result
    }

    reader.onerror = () => {
      setError("Error reading file")
    }

    reader.readAsDataURL(file)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(base64Output)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyDataUri = async () => {
    try {
      await navigator.clipboard.writeText(base64Output)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyBase64Only = async () => {
    try {
      const base64Only = base64Output.split(",")[1] || base64Output
      await navigator.clipboard.writeText(base64Only)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadBase64 = () => {
    const blob = new Blob([base64Output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${imageInfo?.name || "image"}.base64.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearImage = () => {
    setBase64Output("")
    setPreviewUrl("")
    setImageInfo(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>Select an image file to convert to Base64</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop an image here, or click to select</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG, GIF, WebP, SVG (max 10MB)</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {imageInfo && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Image Information</h4>
                  <Button variant="ghost" size="sm" onClick={clearImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-mono truncate">{imageInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <p>{formatFileSize(imageInfo.size)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p>{imageInfo.type}</p>
                  </div>
                  {imageInfo.dimensions && (
                    <div>
                      <span className="text-gray-500">Dimensions:</span>
                      <p>
                        {imageInfo.dimensions.width} × {imageInfo.dimensions.height}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-2">
                <h4 className="font-medium">Preview</h4>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-48 mx-auto object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Base64 Output
            </CardTitle>
            <CardDescription>Generated Base64 encoded string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={base64Output}
              readOnly
              placeholder="Base64 encoded image will appear here..."
              className="min-h-[300px] font-mono text-sm"
            />
            {base64Output && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Size: {formatFileSize(base64Output.length)}</Badge>
                  <Badge variant="outline">Data URI Ready</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={copyDataUri} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Data URI
                  </Button>
                  <Button onClick={copyBase64Only} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Base64 Only
                  </Button>
                  <Button onClick={downloadBase64} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {base64Output && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">HTML Image Tag:</h4>
              <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                {`<img src="${base64Output}" alt="Base64 Image" />`}
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">CSS Background:</h4>
              <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                {`background-image: url('${base64Output}');`}
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Base64 String Only:</h4>
              <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono break-all">
                {base64Output.split(",")[1] || base64Output}
              </code>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Base64 Encoding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Data URI</Badge>
            <Badge variant="secondary">Inline Images</Badge>
            <Badge variant="secondary">No External Files</Badge>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-4">
            <li>• Base64 encoding converts binary image data to text</li>
            <li>• Perfect for embedding images directly in HTML/CSS</li>
            <li>• Eliminates need for separate image files</li>
            <li>• Increases file size by approximately 33%</li>
            <li>• Best for small images and icons</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
