import type { Metadata } from "next"
import CodeMinifier from "@/components/code-minifier"
import LayoutWithAds from "@/components/layout-with-ads"
import { ArrowLeft, Code } from "lucide-react"
import { Header } from "@/components/Header"

export const metadata: Metadata = {
  title: "CSS/JS/HTML Minifier | Formatters.net",           
  description: "Minify CSS, JavaScript, and HTML code quickly and efficiently with our professional Minifier tool. This powerful and easy-to-use utility helps web developers and designers reduce file sizes, improve loading times, and significantly enhance overall website performance. By removing unnecessary spaces, line breaks, and comments, the minifier creates optimized, clean, and compact code without altering functionality. It supports single or multiple files, provides instant previews to verify results before deployment, and allows users to copy or download the optimized code immediately. Ideal for websites, web applications, and mobile projects, the tool ensures faster page rendering, better SEO performance, and a smoother user experience. All processing happens locally in your browser, maintaining privacy, speed, and security. Perfect for developers who want a reliable, simple, and highly efficient solution to optimize their front-end code for production environments while still maintaining readability when needed.",
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
                Minify CSS, JavaScript, and HTML code quickly and efficiently with our professional Minifier tool. This powerful and easy-to-use utility helps web developers and designers reduce file sizes, improve loading times, and significantly enhance overall website performance. By removing unnecessary spaces, line breaks, and comments, the minifier creates optimized, clean, and compact code without altering functionality. It supports single or multiple files, provides instant previews to verify results before deployment, and allows users to copy or download the optimized code immediately. Ideal for websites, web applications, and mobile projects, the tool ensures faster page rendering, better SEO performance, and a smoother user experience. All processing happens locally in your browser, maintaining privacy, speed, and security. Perfect for developers who want a reliable, simple, and highly efficient solution to optimize their front-end code for production environments while still maintaining readability when needed.
              </p>
            </div>
            <CodeMinifier />
          </div>
        </LayoutWithAds>
      </div>
    </div>
  )
}
