import type { Metadata } from "next"
import CodeMinifier from "@/components/code-minifier"
import LayoutWithAds from "@/components/layout-with-ads"

export const metadata: Metadata = {
  title: "CSS/JS/HTML Minifier | Formatters.net",
  description: "Minify CSS, JavaScript, and HTML code to reduce file size and improve website performance.",
  keywords: "css minifier, javascript minifier, html minifier, code compression, web optimization",
}

export default function MinifierPage() {
  return (
    <div className="container mx-auto py-8">
      <LayoutWithAds adPosition="right" showAds={true}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">CSS/JS/HTML Minifier</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Minify CSS, JavaScript, and HTML code to reduce file size and improve website performance.
            </p>
          </div>
          <CodeMinifier />
        </div>
      </LayoutWithAds>
    </div>
  )
}
