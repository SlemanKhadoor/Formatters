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
    description: "Format and beautify Swift code with proper indentation and syntax highlighting",
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
      "Format Swift code with proper indentation and syntax highlighting. Perfect for cleaning up Swift files, structs, and functions.",
    keywords: ["swift", "formatter", "beautifier", "code formatter", "swift beautifier"],
  }

  return <FormatterInterface type="swift" formatter={formatter} />
}
