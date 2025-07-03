"use client"

import type React from "react"
import AdPanel from "./ad-panel"
import { usePathname } from "next/navigation"

interface LayoutWithAdsProps {
  children: React.ReactNode
  adPosition?: "left" | "right"
  showAds?: boolean
}

export default function LayoutWithAds({ children, adPosition = "right", showAds = true }: LayoutWithAdsProps) {
  const pathname = usePathname()

  // Don't show ads on homepage hero section
  const isHomePage = pathname === "/"

  if (!showAds) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-2">
      {/* Left Ad Panel */}
      {adPosition === "left" && !isHomePage && <AdPanel position="left" className="hidden lg:block flex-shrink-0" />}

      {/* Main Content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Right Ad Panel */}
      {adPosition === "right" && <AdPanel position="right" className="hidden lg:block flex-shrink-0" />}

      {/* Mobile Ad Panel */}
      <div className="lg:hidden">
        <AdPanel position="right" className="w-full" />
      </div>
    </div>
  )
}
