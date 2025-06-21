import type { Metadata } from "next"
import LayoutWithAds from "@/components/layout-with-ads"
import { TimestampConverter } from "@/components/timestamp-converter"

export const metadata: Metadata = {
  title: "Timestamp Converter - Unix, ISO, Human-Readable Time Converter",
  description:
    "Convert between Unix timestamps, ISO 8601 dates, and human-readable time formats. Support for milliseconds, timezones, and batch conversion.",
  keywords: [
    "timestamp converter",
    "unix timestamp",
    "iso 8601",
    "date converter",
    "time converter",
    "epoch converter",
  ],
}

export default function TimestampConverterPage() {
  return (
    <LayoutWithAds adPosition="right" showAds={true}>
      <TimestampConverter />
    </LayoutWithAds>
  )
}
