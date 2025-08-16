import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "Kotlin Formatter & Beautifier - Format Kotlin Code Online",
  description:
    "Professional Kotlin code formatter and beautifier. Format, validate, and organize Kotlin code with proper indentation and syntax highlighting.",
  keywords: ["kotlin formatter", "kotlin beautifier", "kotlin code formatter", "format kotlin", "kotlin validator"],
}

export default function KotlinFormatterPage() {
  const formatter = {
    name: "Kotlin",
    description: "Format and beautify Kotlin code with proper indentation and syntax highlighting",
    placeholder: `// Kotlin example
data class User(val id: Int, val name: String, val email: String, val isActive: Boolean)
fun greetUser(user: User): String { return "Hello, \${user.name}! Your email is \${user.email}" }
fun main() {
val users = listOf(User(1, "John", "john@example.com", true), User(2, "Jane", "jane@example.com", false))
val activeUsers = users.filter { it.isActive }
activeUsers.forEach { user -> println(greetUser(user)) }
}
`,
    longDescription:
      "Format Kotlin code with proper indentation and syntax highlighting. Perfect for cleaning up Kotlin files, classes, and functions.",
    keywords: ["kotlin", "formatter", "beautifier", "code formatter", "kotlin beautifier"],
  }

  return <FormatterInterface type="kotlin" formatter={formatter} />
}
