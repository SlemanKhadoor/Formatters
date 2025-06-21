import LayoutWithAds from "@/components/layout-with-ads"
import Base64Converter from "@/components/base64-converter"

export default function Base64Page() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Base64 Encoder/Decoder</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Encode and decode Base64 strings securely in your browser.
            </p>
          </div>
          <Base64Converter />
        </div>
      </LayoutWithAds>
    </div>
  )
}
