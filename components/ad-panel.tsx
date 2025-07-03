"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdPanelProps {
  position?: "left" | "right"
  className?: string
}

// Mock ad data - replace with real ad service integration
const mockAds = [
  {
    id: "1",
    title: "VS Code Extensions",
    description: "Boost your coding productivity with these essential VS Code extensions",
    image: "/placeholder.svg?height=120&width=200",
    url: "#",
    type: "sponsored",
  },
  {
    id: "2",
    title: "Learn JavaScript",
    description: "Master JavaScript with interactive tutorials and real projects",
    image: "/placeholder.svg?height=120&width=200",
    url: "#",
    type: "sponsored",
  },
  {
    id: "3",
    title: "Code Review Tools",
    description: "Improve code quality with automated review and analysis tools",
    image: "/placeholder.svg?height=120&width=200",
    url: "#",
    type: "sponsored",
  },
]

export default function AdPanel({ position = "right", className = "" }: AdPanelProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  // Rotate ads every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % mockAds.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return null
  }

  const currentAd = mockAds[currentAdIndex]

  return (
    <aside
      className={`
        ${className}
        ${position === "left" ? "order-first" : "order-last"}
        w-full lg:w-80 xl:w-80
        space-y-4
        ${position === "left" ? "lg:pr-3" : "lg:pl-3 "}
      `}
      aria-label="Advertisement panel"
    >
      {/* Sponsored Content Banner */}
      <Card className="relative overflow-hidden border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-gray-500">Sponsored</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              onClick={() => setIsVisible(false)}
              aria-label="Close ad panel"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Main Ad Display */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <img
                src={currentAd.image || "/placeholder.svg?height=64&width=64"}
                alt={currentAd.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{currentAd.title}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-3">{currentAd.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => window.open(currentAd.url, "_blank")}
                >
                  Learn More
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Native Ad Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-500">Recommended Tools</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {mockAds.slice(0, 2).map((ad, index) => (
            <div
              key={ad.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => window.open(ad.url, "_blank")}
            >
              <img
                src={ad.image || "/placeholder.svg?height=48&width=48"}
                alt={ad.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">{ad.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{ad.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sticky Ad for longer content */}
      <div className="sticky top-24">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            {/* Placeholder for AdSense or other ad networks */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg p-4 text-center">
              <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Advertisement</span>
              </div>
              <p className="text-xs text-gray-600">Support Formatters.net by allowing ads</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
