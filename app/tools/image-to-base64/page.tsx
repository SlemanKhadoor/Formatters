import type { Metadata } from "next"
import ImageToBase64Converter from "@/components/image-to-base64-converter"
import LayoutWithAds from "@/components/layout-with-ads"

export const metadata: Metadata = {
  title: "Image to Base64 Converter | Formatters.net",
  description: "Convert images to Base64 encoded strings for embedding in HTML, CSS, or data URIs.",
  keywords: "image to base64, base64 encoder, data uri, image converter",
}

export default function ImageToBase64Page() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Image to Base64 Converter</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert images to Base64 encoded strings for embedding in HTML, CSS, or data URIs.
            </p>
          </div>
          <ImageToBase64Converter />
        </div>
      </LayoutWithAds>
    </div>
  )
}
