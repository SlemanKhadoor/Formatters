import type { Metadata } from "next"
import CodeMinifier from "@/components/code-minifier"
import LayoutWithAds from "@/components/layout-with-ads"
import { ArrowLeft, Code } from "lucide-react"
import { Header } from "@/components/Header"

export const metadata: Metadata = {
  title: "CSS/JS/HTML Minifier | Formatters.net",
  description: "Minify CSS, JavaScript, and HTML code to reduce file size and improve website performance.",
  keywords: "css minifier, javascript minifier, html minifier, code compression, web optimization",
}

export default function MinifierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        formatterName={'CSS/JS/HTML Minifier'}
        icon={<Code className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
      />
      <div className="container mx-auto px-2 py-8">
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
    </div>
  )
}
