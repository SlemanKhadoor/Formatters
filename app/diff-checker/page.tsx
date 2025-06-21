import LayoutWithAds from "@/components/layout-with-ads"
import DiffChecker from "@/components/diff-checker"

export default function DiffCheckerPage() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Advanced Diff Checker</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Compare text and code differences with advanced features like file upload, ignore options, and export
              functionality.
            </p>
          </div>
          <DiffChecker />
        </div>
      </LayoutWithAds>
    </div>
  )
}
