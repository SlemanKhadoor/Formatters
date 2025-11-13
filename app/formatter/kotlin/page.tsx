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
    description: "Format and beautify your C and C++ code effortlessly with our professional C/C++ formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It provides syntax highlighting, detects common mistakes, and organizes your C and C++ files, classes, and functions efficiently. Whether you are maintaining legacy projects or developing new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results — no installation, setup, or plugins required. Perfect for C/C++ developers, learners, and enthusiasts alike.Format and beautify your C and C++ code effortlessly with our professional C/C++ formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It provides syntax highlighting, detects common mistakes, and organizes your C and C++ files, classes, and functions efficiently. Whether you are maintaining legacy projects or developing new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results — no installation, setup, or plugins required. Perfect for C/C++ developers, learners, and enthusiasts alike.Format and beautify your C and C++ code effortlessly with our professional C/C++ formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It provides syntax highlighting, detects common mistakes, and organizes your C and C++ files, classes, and functions efficiently. Whether you are maintaining legacy projects or developing new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results — no installation, setup, or plugins required. Perfect for C/C++ developers, learners, and enthusiasts alike.Format and beautify your C and C++ code effortlessly with our professional C/C++ formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It provides syntax highlighting, detects common mistakes, and organizes your C and C++ files, classes, and functions efficiently. Whether you are maintaining legacy projects or developing new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results — no installation, setup, or plugins required. Perfect for C/C++ developers, learners, and enthusiasts alike.",
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
      "Format and beautify your Kotlin code effortlessly with our professional Kotlin formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent. It provides syntax highlighting, detects common mistakes, and organizes your Kotlin files, classes, and functions efficiently. Whether you are maintaining existing projects or building new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable results, no installation, setup, or plugins required. Perfect for Kotlin developers, learners, and enthusiasts alike.",
    keywords: ["kotlin", "formatter", "beautifier", "code formatter", "kotlin beautifier"],
  }

  return <FormatterInterface type="kotlin" formatter={formatter} />
}
