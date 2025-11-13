import type { Metadata } from "next"
import LayoutWithAds from "@/components/layout-with-ads"
import { ColorConverter } from "@/components/color-converter"

export const metadata: Metadata = {
  title: "Color Converter - Convert HEX, RGB, HSL, HSV Colors Online",
  description:
    "Convert colors between different formats: HEX, RGB, HSL, HSV, CMYK. Color picker, palette generator, and color harmony tools for designers and developers.",
  keywords: ["color converter","online color converter","free color converter", "hex to rgb", "rgb to hsl", "color picker", "color palette", "hex converter"],
}

export default function ColorConverterPage() {
  return (
    <ColorConverter />
  )
}
