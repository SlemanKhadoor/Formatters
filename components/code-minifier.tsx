"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Code, Zap } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CodeMinifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("css")
  const [compressionRatio, setCompressionRatio] = useState(0)

  const minifyCode = () => {
    try {
      setError("")

      if (!input.trim()) {
        setError("Please enter code to minify")
        return
      }

      let minified = ""
      const originalSize = input.length

      switch (activeTab) {
        case "css":
          minified = minifyCSS(input)
          break
        case "javascript":
          minified = minifyJavaScript(input)
          break
        case "html":
          minified = minifyHTML(input)
          break
        default:
          minified = input
      }

      const minifiedSize = minified.length
      const ratio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0
      setCompressionRatio(Math.round(ratio * 100) / 100)
      setOutput(minified)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error minifying code")
      setOutput("")
    }
  }

  const minifyCSS = (css: string): string => {
    return (
      css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Remove unnecessary whitespace
        .replace(/\s+/g, " ")
        // Remove whitespace around specific characters
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*,\s*/g, ",")
        .replace(/\s*>\s*/g, ">")
        .replace(/\s*\+\s*/g, "+")
        .replace(/\s*~\s*/g, "~")
        // Remove trailing semicolon before }
        .replace(/;}/g, "}")
        // Remove leading/trailing whitespace
        .trim()
    )
  }

  const minifyJavaScript = (js: string): string => {
    return (
      js
        // Remove single-line comments (but preserve URLs)
        .replace(/\/\/(?![^\r\n]*https?:)[^\r\n]*/g, "")
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        // Remove unnecessary whitespace
        .replace(/\s+/g, " ")
        // Remove whitespace around operators and punctuation
        .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, "$1")
        // Remove whitespace around dots
        .replace(/\s*\.\s*/g, ".")
        // Remove trailing semicolons before }
        .replace(/;}/g, "}")
        // Remove leading/trailing whitespace
        .trim()
    )
  }

  const minifyHTML = (html: string): string => {
    return (
      html
        // Remove HTML comments (but preserve conditional comments)
        .replace(/<!--(?!\[if)[\s\S]*?-->/g, "")
        // Remove unnecessary whitespace between tags
        .replace(/>\s+</g, "><")
        // Remove whitespace at the beginning and end of lines
        .replace(/^\s+|\s+$/gm, "")
        // Remove empty lines
        .replace(/\n\s*\n/g, "\n")
        // Compress whitespace within text content (but preserve single spaces)
        .replace(/\s{2,}/g, " ")
        // Remove leading/trailing whitespace
        .trim()
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadMinified = () => {
    const extensions = { css: "css", javascript: "js", html: "html" }
    const extension = extensions[activeTab as keyof typeof extensions]
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `minified.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sampleCode = {
    css: `/* Main styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background-color: #333;
    color: white;
    padding: 1rem;
}

.button {
    background-color: #007bff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
}`,
    javascript: `// Sample JavaScript code
function calculateTotal(items) {
    let total = 0;
    
    for (let i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
    }
    
    return total;
}

const cart = [
    { name: "Product 1", price: 10.99, quantity: 2 },
    { name: "Product 2", price: 15.50, quantity: 1 }
];

console.log("Total:", calculateTotal(cart));`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Main Content</h2>
            <p>This is some sample content that will be minified.</p>
        </section>
    </main>
</body>
</html>`,
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {activeTab.toUpperCase()} Input
              </CardTitle>
              <CardDescription>Enter your {activeTab.toUpperCase()} code to minify</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={`Paste your ${activeTab.toUpperCase()} code here...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={minifyCode} className="flex-1">
                  <Zap className="h-4 w-4 mr-2" />
                  Minify Code
                </Button>
                <Button variant="outline" onClick={() => setInput(sampleCode[activeTab as keyof typeof sampleCode])}>
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Minified Output
              </CardTitle>
              <CardDescription>Compressed {activeTab.toUpperCase()} code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              <Textarea
                value={output}
                readOnly
                placeholder="Minified code will appear here..."
                className="min-h-[400px] font-mono text-sm"
              />
              {output && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Compression: {compressionRatio}%</Badge>
                    <Badge variant="outline">
                      Size: {input.length} → {output.length} chars
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadMinified} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Minification Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Faster Loading</Badge>
            <Badge variant="secondary">Reduced Bandwidth</Badge>
            <Badge variant="secondary">Better Performance</Badge>
            <Badge variant="secondary">SEO Benefits</Badge>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-4">
            <li>• Removes unnecessary whitespace and comments</li>
            <li>• Reduces file size for faster downloads</li>
            <li>• Improves website loading speed</li>
            <li>• Saves bandwidth costs</li>
            <li>• Enhances user experience</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
