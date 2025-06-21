import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Code, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Code className="h-12 w-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Formatters.net</h1>
        </div>
        <h2 className="text-6xl font-bold text-gray-900 mb-4">404</h2>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Formatter Not Found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The formatter you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
