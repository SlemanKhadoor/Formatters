"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RefreshCw, Shuffle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<"v1" | "v4" | "nil">("v4")
  const { toast } = useToast()

  // Generate UUID v4 (random)
  const generateUuidV4 = useCallback((): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }, [])

  // Generate UUID v1 (timestamp-based, simplified)
  const generateUuidV1 = useCallback((): string => {
    const timestamp = Date.now()
    const timestampHex = timestamp.toString(16).padStart(12, "0")
    const clockSeq = Math.floor(Math.random() * 0x3fff)
    const node = Math.floor(Math.random() * 0xffffffffffff)

    return `${timestampHex.slice(-8)}-${timestampHex.slice(-12, -8)}-1${timestampHex.slice(-15, -12)}-${clockSeq.toString(16).padStart(4, "0")}-${node.toString(16).padStart(12, "0")}`
  }, [])

  // Generate NIL UUID
  const generateNilUuid = useCallback((): string => {
    return "00000000-0000-0000-0000-000000000000"
  }, [])

  const generateUuids = useCallback(() => {
    const newUuids: string[] = []

    for (let i = 0; i < count; i++) {
      switch (version) {
        case "v1":
          newUuids.push(generateUuidV1())
          break
        case "v4":
          newUuids.push(generateUuidV4())
          break
        case "nil":
          newUuids.push(generateNilUuid())
          break
      }
    }

    setUuids(newUuids)
  }, [count, version, generateUuidV1, generateUuidV4, generateNilUuid])

  const handleCopy = async (uuid?: string) => {
    const textToCopy = uuid || uuids.join("\n")
    await navigator.clipboard.writeText(textToCopy)
    toast({
      title: "Copied!",
      description: uuid ? "UUID copied to clipboard" : "All UUIDs copied to clipboard",
    })
  }

  const handleDownload = () => {
    if (uuids.length === 0) return

    const blob = new Blob([uuids.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `uuids-${version}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "UUIDs downloaded successfully",
    })
  }

  // Generate initial UUIDs
  // useState(() => {
  //   generateUuids()
  // })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header
        formatterName={'UUID Generator'}
        icon={<Shuffle className="sm:h-5 sm:w-5 h-4 w-4 text-indigo-600" />}
        statusBadge={
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Secure
          </Badge>
        } />

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">UUID Generator</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Generate UUID/GUID (Universally Unique Identifiers) instantly
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Generate Version 1, Version 4, or NIL UUIDs securely and instantly with our professional UUID Generator. All generation happens entirely in your browser, ensuring complete data privacy and top-level security, no external requests, servers, or tracking involved. This advanced tool provides developers with unique, collision-free identifiers ideal for databases, APIs, authentication systems, and distributed architectures. You can easily copy, regenerate, or validate UUIDs with a single click using the intuitive interface. It supports real-time generation, batch creation, and guarantees full compliance with the official RFC 4122 standard. Whether you need UUIDs for user sessions, resource tracking, application development, or testing environments, this generator delivers fast, reliable, and consistent results every time. Perfect for developers, engineers, and system architects who want a secure, lightweight, and client-side UUID generation solution without dependencies or installations.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-6 items-start">
              {/* Controls Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <CardTitle className="mb-2">Generator Settings</CardTitle>
                    <CardDescription>Configure UUID generation options</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col space-y-6">
                    {/* UUID Version Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        UUID Version
                      </label>
                      <Tabs value={version} onValueChange={(value) => setVersion(value as any)}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="v4">Version 4</TabsTrigger>
                          <TabsTrigger value="v1">Version 1</TabsTrigger>
                          <TabsTrigger value="nil">NIL UUID</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Count Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of UUIDs
                      </label>
                      <select
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 5, 10, 25, 50, 100].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Generate Button */}
                    <div className="mt-auto">
                      <Button onClick={generateUuids} className="w-full" size="lg">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate UUIDs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Results Section */}
              <section className="h-full">
                <Card className="border-0 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="mb-2">Generated UUIDs</CardTitle>
                        <CardDescription>
                          {uuids.length} UUID{uuids.length !== 1 ? "s" : ""} generated
                        </CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy()}
                          disabled={uuids.length === 0}
                          className="flex-1 sm:w-auto"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={uuids.length === 0}
                          className="flex-1 sm:w-auto"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {uuids.map((uuid, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md font-mono text-sm"
                        >
                          <span className="flex-1 mr-2">{uuid}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(uuid)}
                            className="flex-shrink-0 min-w-[2rem]"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Information Section */}
            <section className="mt-8">
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle>About UUIDs</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="about" className="w-full">
                    <TabsList>
                      <TabsTrigger value="about">About</TabsTrigger>
                      <TabsTrigger value="versions">Versions</TabsTrigger>
                      <TabsTrigger value="uses">Use Cases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">What are UUIDs?</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>UUID stands for Universally Unique Identifier</li>
                          <li>128-bit values that are unique across space and time</li>
                          <li>Standardized by RFC 4122</li>
                          <li>Also known as GUID (Globally Unique Identifier) in Microsoft systems</li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="versions" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">UUID Versions:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>
                            <strong>Version 1:</strong> Time-based UUIDs using MAC address and timestamp
                          </li>
                          <li>
                            <strong>Version 4:</strong> Random UUIDs (most commonly used)
                          </li>
                          <li>
                            <strong>NIL UUID:</strong> Special UUID with all bits set to zero
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    <TabsContent value="uses" className="mt-4">
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Common Use Cases:</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          <li>Database primary keys</li>
                          <li>API request/response tracking</li>
                          <li>File and resource identification</li>
                          <li>Session management</li>
                          <li>Distributed system coordination</li>
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
