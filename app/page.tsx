import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  FileText,
  Database,
  Zap,
  Shield,
  Globe,
  Search,
  Key,
  Hash,
  Lock,
  FileSpreadsheet,
  FileCode,
  GitCompare,
  QrCode,
  Shuffle,
  Palette,
  Clock,
  Type,
  Calculator,
  ShieldCheck,
  FileDown,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LayoutWithAds from "@/components/layout-with-ads"

const formatters = [
  {
    name: "JSON",
    description: "Format and validate JSON data with syntax highlighting",
    icon: Code,
    href: "/formatter/json",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "JavaScript",
    description: "Format and beautify JavaScript code with proper indentation",
    icon: Code,
    href: "/formatter/javascript",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    name: "TypeScript",
    description: "Format TypeScript code with type checking and validation",
    icon: Code,
    href: "/formatter/typescript",
    color: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "HTML",
    description: "Format and validate HTML markup with proper structure",
    icon: Code,
    href: "/formatter/html",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "CSS",
    description: "Format and organize CSS stylesheets with clean structure",
    icon: Code,
    href: "/formatter/css",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "Python",
    description: "Format and structure Python code with PEP 8 standards",
    icon: Code,
    href: "/formatter/python",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "PHP",
    description: "Format and beautify PHP code with proper indentation",
    icon: Code,
    href: "/formatter/php",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    name: "Go",
    description: "Format Go language code with standard formatting",
    icon: Code,
    href: "/formatter/go",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    name: "Rust",
    description: "Format and structure Rust code with proper syntax",
    icon: Code,
    href: "/formatter/rust",
    color: "text-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "Swift",
    description: "Format Swift programming code with clean structure",
    icon: Code,
    href: "/formatter/swift",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    name: "Kotlin",
    description: "Format Kotlin code with proper structure and indentation",
    icon: Code,
    href: "/formatter/kotlin",
    color: "text-purple-700",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "C/C++",
    description: "Format C and C++ source code with standard formatting",
    icon: Code,
    href: "/formatter/cpp",
    color: "text-gray-700",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  {
    name: "XML",
    description: "Format and validate XML documents with proper structure",
    icon: Code,
    href: "/formatter/xml",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    name: "SQL",
    description: "Format and organize SQL queries with proper formatting",
    icon: Database,
    href: "/formatter/sql",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    name: "Markdown",
    description: "Format and structure Markdown text with clean layout",
    icon: FileText,
    href: "/formatter/markdown",
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  {
    name: "YAML",
    description: "Format and validate YAML configuration files properly",
    icon: FileText,
    href: "/formatter/yaml",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
]

const converters = [
  {
    name: "JSON to CSV",
    description: "Convert JSON arrays to CSV format for spreadsheets",
    icon: FileSpreadsheet,
    href: "/tools/json-to-csv",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "JSON to XML",
    description: "Convert JSON data to XML format with proper structure",
    icon: FileCode,
    href: "/tools/json-to-xml",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    name: "JSON to YAML",
    description: "Convert JSON to YAML configuration format easily",
    icon: FileText,
    href: "/tools/json-to-yaml",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "JSON to TypeScript",
    description: "Generate TypeScript interfaces from JSON data",
    icon: Code,
    href: "/tools/json-to-typescript",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "JSON to HTML Table",
    description: "Convert JSON data to HTML table format quickly",
    icon: FileCode,
    href: "/tools/json-to-html",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "XML to JSON",
    description: "Convert XML documents to JSON format seamlessly",
    icon: FileCode,
    href: "/tools/xml-to-json",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "CSV to JSON",
    description: "Convert CSV data to JSON format for APIs",
    icon: FileSpreadsheet,
    href: "/tools/csv-to-json",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "YAML to JSON",
    description: "Convert YAML configuration to JSON format",
    icon: FileText,
    href: "/tools/yaml-to-json",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "TSV to CSV",
    description: "Convert Tab-Separated Values to CSV format",
    icon: FileSpreadsheet,
    href: "/tools/tsv-to-csv",
    color: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
]

const utilities = [
  {
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings securely",
    icon: Lock,
    href: "/tools/base64",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL strings for web safety",
    icon: Globe,
    href: "/tools/url-encoder",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, and SHA-256 hashes",
    icon: Hash,
    href: "/tools/hash-generator",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "JWT Decoder",
    description: "Decode and inspect JWT tokens safely",
    icon: Key,
    href: "/tools/jwt-decoder",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "JWT Generator",
    description: "Create and sign JWT tokens with custom claims",
    icon: Key,
    href: "/tools/jwt-generator",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "Regex Tester",
    description: "Test and debug regular expressions interactively",
    icon: Search,
    href: "/tools/regex-tester",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "QR Code Generator",
    description: "Generate and customize QR codes easily",
    icon: QrCode,
    href: "/tools/qr-generator",
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  {
    name: "UUID Generator",
    description: "Generate unique identifiers (UUID/GUID)",
    icon: Shuffle,
    href: "/tools/uuid-generator",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    name: "Password Generator",
    description: "Generate secure passwords with custom rules",
    icon: ShieldCheck,
    href: "/tools/password-generator",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    name: "Color Converter",
    description: "Convert between color formats (HEX, RGB, HSL)",
    icon: Palette,
    href: "/tools/color-converter",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    name: "Timestamp Converter",
    description: "Convert between Unix, ISO, and human-readable time",
    icon: Clock,
    href: "/tools/timestamp-converter",
    color: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for design and development",
    icon: Type,
    href: "/tools/lorem-generator",
    color: "text-gray-700",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
  {
    name: "CSS/JS/HTML Minifier",
    description: "Minify CSS, JavaScript, and HTML code efficiently",
    icon: FileDown,
    href: "/tools/minifier",
    color: "text-green-700",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
]

const textTools = [
  {
    name: "Word Counter",
    description: "Count words, characters, and text statistics",
    icon: Calculator,
    href: "/tools/word-counter",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Case Converter",
    description: "Convert text between different cases (camelCase, snake_case, etc.)",
    icon: Type,
    href: "/tools/case-converter",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "Diff Checker",
    description: "Compare text and code differences with advanced features",
    icon: GitCompare,
    href: "/diff-checker",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
]

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant formatting and validation with real-time feedback",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "All processing happens in your browser - no data sent to servers",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "No internet connection required after initial page load",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-2 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-1">
              <Code className="h-8 w-7 text-blue-600" />
              <h1 className="text-base sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Formatters.net
              </h1>
            </Link>
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs text-nowrap">
                <Shield className="h-3 w-3 mr-1 hidden sm:block" />
                100% Client-Side
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Complete Developer Toolkit
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Professional code formatting, data conversion, and developer utilities. Over 35 tools including 16 code
                formatters with syntax highlighting, 9 data converters, 13 utilities, and 3 text processing tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{feature.title}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Code Formatters Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Code Formatters</h2>
                <Badge variant="outline" className="text-blue-600 border-blue-200 dark:border-blue-800 text-nowrap">
                  {formatters.length} Languages
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {formatters.map((formatter) => (
                  <Card
                    key={formatter.name}
                    className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md h-full flex flex-col"
                  >
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-lg ${formatter.bgColor}`}>
                          <formatter.icon className={`h-6 w-6 ${formatter.color}`} />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{formatter.name}</CardTitle>
                          <CardDescription className="text-sm text-center leading-relaxed min-h-[2.5rem] flex items-center">
                            {formatter.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button asChild size="sm" className="w-full">
                        <Link href={formatter.href}>Format Code</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Data Converters Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Data Converters</h2>
                <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800 text-nowrap">
                  {converters.length} Tools
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {converters.map((converter) => (
                  <Card
                    key={converter.name}
                    className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md h-full flex flex-col"
                  >
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-lg ${converter.bgColor}`}>
                          <converter.icon className={`h-5 w-5 ${converter.color}`} />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-semibold leading-tight">{converter.name}</CardTitle>
                          <CardDescription className="text-xs text-center leading-relaxed min-h-[3rem] flex items-center px-1">
                            {converter.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link href={converter.href}>Convert</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Developer Utilities Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Developer Utilities</h2>
                <Badge variant="outline" className="text-purple-600 border-purple-200 dark:border-purple-800 ">
                  {utilities.length} Tools
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {utilities.map((utility) => (
                  <Card
                    key={utility.name}
                    className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md h-full flex flex-col"
                  >
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-lg ${utility.bgColor}`}>
                          <utility.icon className={`h-6 w-6 ${utility.color}`} />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{utility.name}</CardTitle>
                          <CardDescription className="text-sm text-center leading-relaxed min-h-[2.5rem] flex items-center">
                            {utility.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button asChild variant="secondary" size="sm" className="w-full">
                        <Link href={utility.href}>Open Tool</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Text Processing Tools Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Text Processing Tools</h2>
                <Badge variant="outline" className="text-orange-600 border-orange-200 dark:border-orange-800 text-nowrap">
                  {textTools.length} Tools
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {textTools.map((tool) => (
                  <Card
                    key={tool.name}
                    className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md h-full flex flex-col"
                  >
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                          <tool.icon className={`h-6 w-6 ${tool.color}`} />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                          <CardDescription className="text-sm text-center leading-relaxed min-h-[2.5rem] flex items-center">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={tool.href}>Use Tool</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
                Why Choose Formatters.net?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center flex flex-col items-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
              <p className="text-xl mb-6 opacity-90">
                Choose from our comprehensive collection of 35+ professional developer tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="transition-colors duration-300"
                >
                  <Link href="/formatter/json">Start with JSON</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="transition-colors duration-300"
                >
                  <Link href="/tools/uuid-generator">Generate UUID</Link>
                </Button>
              </div>
            </section>

          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
