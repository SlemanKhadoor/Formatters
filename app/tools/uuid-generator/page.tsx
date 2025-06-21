import LayoutWithAds from "@/components/layout-with-ads"
import UuidGenerator from "@/components/uuid-generator"

export default function UuidGeneratorPage() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">UUID Generator</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Generate unique identifiers (UUID/GUID) for your applications.
            </p>
          </div>
          <UuidGenerator />
        </div>
      </LayoutWithAds>
    </div>
  )
}
