"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Clock, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function TimestampConverter() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [unixInput, setUnixInput] = useState("")
  const [isoInput, setIsoInput] = useState("")
  const [humanInput, setHumanInput] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy timestamp.",
        variant: "destructive",
      })
    }
  }

  const setCurrentTimestamp = () => {
    const now = new Date()
    setUnixInput(Math.floor(now.getTime() / 1000).toString())
    setIsoInput(now.toISOString())
    setHumanInput(now.toString())
  }

  const convertFromUnix = (unix: string) => {
    try {
      const timestamp = Number.parseInt(unix)
      if (isNaN(timestamp)) return null

      // Handle both seconds and milliseconds
      const date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
      if (isNaN(date.getTime())) return null

      return date
    } catch {
      return null
    }
  }

  const convertFromISO = (iso: string) => {
    try {
      const date = new Date(iso)
      if (isNaN(date.getTime())) return null
      return date
    } catch {
      return null
    }
  }

  const convertFromHuman = (human: string) => {
    try {
      const date = new Date(human)
      if (isNaN(date.getTime())) return null
      return date
    } catch {
      return null
    }
  }

  const formatTimestamp = (date: Date) => {
    return {
      unix: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toString(),
      localDate: date.toLocaleDateString(),
      localTime: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    }
  }

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (Math.abs(diffSec) < 60) return `${diffSec} seconds ago`
    if (Math.abs(diffMin) < 60) return `${diffMin} minutes ago`
    if (Math.abs(diffHour) < 24) return `${diffHour} hours ago`
    if (Math.abs(diffDay) < 30) return `${diffDay} days ago`
    return date.toLocaleDateString()
  }

  const unixDate = convertFromUnix(unixInput)
  const isoDate = convertFromISO(isoInput)
  const humanDate = convertFromHuman(humanInput)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Timestamp Converter</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Convert between Unix timestamps, ISO 8601 dates, and human-readable time formats.
          </p>
        </div>

        {/* Current Time */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Time
            </CardTitle>
            <CardDescription>Live current timestamp in various formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Unix Timestamp</Label>
                <div className="flex gap-2">
                  <Input value={Math.floor(currentTime.getTime() / 1000)} readOnly className="font-mono" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(Math.floor(currentTime.getTime() / 1000).toString(), "Unix timestamp")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>ISO 8601</Label>
                <div className="flex gap-2">
                  <Input value={currentTime.toISOString()} readOnly className="font-mono" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentTime.toISOString(), "ISO timestamp")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Local Date</Label>
                <div className="flex gap-2">
                  <Input value={currentTime.toLocaleDateString()} readOnly className="font-mono" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentTime.toLocaleDateString(), "Local date")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Local Time</Label>
                <div className="flex gap-2">
                  <Input value={currentTime.toLocaleTimeString()} readOnly className="font-mono" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(currentTime.toLocaleTimeString(), "Local time")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={setCurrentTimestamp} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Use Current Time in Converters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Converters */}
        <Tabs defaultValue="unix" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unix">Unix Timestamp</TabsTrigger>
            <TabsTrigger value="iso">ISO 8601</TabsTrigger>
            <TabsTrigger value="human">Human Readable</TabsTrigger>
          </TabsList>

          <TabsContent value="unix" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unix Timestamp Converter</CardTitle>
                <CardDescription>Convert Unix timestamp to other formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="unix-input">Unix Timestamp (seconds or milliseconds)</Label>
                  <Input
                    id="unix-input"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="1640995200 or 1640995200000"
                    className="font-mono mt-2"
                  />
                </div>

                {unixDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formatTimestamp(unixDate)).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                        <div className="flex gap-2">
                          <Input value={value.toString()} readOnly className="font-mono" />
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(value.toString(), key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {unixInput && !unixDate && <Badge variant="destructive">Invalid Unix timestamp</Badge>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="iso" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ISO 8601 Converter</CardTitle>
                <CardDescription>Convert ISO 8601 date to other formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="iso-input">ISO 8601 Date</Label>
                  <Input
                    id="iso-input"
                    value={isoInput}
                    onChange={(e) => setIsoInput(e.target.value)}
                    placeholder="2022-01-01T00:00:00.000Z"
                    className="font-mono mt-2"
                  />
                </div>

                {isoDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formatTimestamp(isoDate)).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                        <div className="flex gap-2">
                          <Input value={value.toString()} readOnly className="font-mono" />
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(value.toString(), key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isoInput && !isoDate && <Badge variant="destructive">Invalid ISO 8601 date</Badge>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="human" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Human Readable Converter</CardTitle>
                <CardDescription>Convert human-readable date to other formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="human-input">Human Readable Date</Label>
                  <Input
                    id="human-input"
                    value={humanInput}
                    onChange={(e) => setHumanInput(e.target.value)}
                    placeholder="January 1, 2022 or 2022-01-01 or Jan 1 2022"
                    className="font-mono mt-2"
                  />
                </div>

                {humanInput && humanDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formatTimestamp(humanDate)).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                        <div className="flex gap-2">
                          <Input value={value.toString()} readOnly className="font-mono" />
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(value.toString(), key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {humanInput && !humanDate && <Badge variant="destructive">Invalid date format</Badge>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Common Timestamps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common Timestamps</CardTitle>
            <CardDescription>Frequently used timestamp values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Unix Epoch", timestamp: 0, description: "January 1, 1970" },
                { name: "Y2K", timestamp: 946684800, description: "January 1, 2000" },
                { name: "Unix Y2038", timestamp: 2147483647, description: "January 19, 2038" },
                { name: "Start of 2020", timestamp: 1577836800, description: "January 1, 2020" },
                { name: "Start of 2025", timestamp: 1735689600, description: "January 1, 2025" },
                { name: "Start of 2030", timestamp: 1893456000, description: "January 1, 2030" },
              ].map((item) => (
                <div key={item.name} className="p-3 border rounded-lg">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{item.timestamp}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUnixInput(item.timestamp.toString())
                        copyToClipboard(item.timestamp.toString(), item.name)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
