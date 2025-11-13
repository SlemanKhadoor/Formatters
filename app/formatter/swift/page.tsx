import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "Swift Formatter & Beautifier - Format Swift Code Online",
  description:
    "Professional Swift code formatter and beautifier. Format, validate, and organize Swift code with proper indentation and syntax highlighting.",
  keywords: ["swift formatter", "swift beautifier", "swift code formatter", "format swift", "swift validator"],
}

export default function SwiftFormatterPage() {
  const formatter = {
    name: "Swift",
    description: "Format, validate and beautify Swift code with real-time syntax checking",
    placeholder: `// Swift example
struct User {
    let id: Int
    let name: String
    let email: String
    let isActive: Bool
}

func greetUser(_ user: User) -> String {
    return "Hello, \\(user.name)! Your email is \\(user.email)"
}

let users = [
    User(id: 1, name: "John", email: "john@example.com", isActive: true),
    User(id: 2, name: "Jane", email: "jane@example.com", isActive: false)
]

let activeUsers = users.filter { $0.isActive }
activeUsers.forEach { user in
    print(greetUser(user))
}`,
    longDescription:
      "Format and beautifully beautify your Swift code effortlessly with our professional Swift formatter. This powerful tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and fully consistent. It provides advanced syntax highlighting, intelligently detects common mistakes, and organizes your Swift files, structs, and functions efficiently. Whether you are maintaining existing projects or building new applications, the formatter helps you produce high-quality, production-ready code. It significantly improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results, no installation, setup, or plugins required. Perfect for Swift developers, learners, and enthusiasts alike.",
    keywords: ["swift", "formatter", "beautifier", "code formatter", "swift beautifier"],
  }

  return <FormatterInterface type="swift" formatter={formatter} />
}
