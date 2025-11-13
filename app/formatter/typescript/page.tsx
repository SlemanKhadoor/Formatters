import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "TypeScript Formatter & Beautifier - Format TypeScript Code Online",
  description:
    "Professional TypeScript code formatter and beautifier. Format, validate, and organize TypeScript code with proper indentation, syntax highlighting, and type checking.",
  keywords: [
    "typescript formatter",
    "typescript beautifier",
    "typescript code formatter",
    "format typescript",
    "typescript validator",
  ],
}

export default function TypeScriptFormatterPage() {
  const formatter = {
    name: "TypeScript",
    description: "Format, validate and beautify TypeScript code with real-time syntax checking",
    placeholder: `// TypeScript example
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! Your email is \${user.email}\`;
}

const users: User[] = [
  { id: 1, name: "John", email: "john@example.com", isActive: true },
  { id: 2, name: "Jane", email: "jane@example.com", isActive: false }
];

const activeUsers = users.filter(user => user.isActive);
console.log(activeUsers.map(user => greetUser(user)));`,
    longDescription:
      "Format and enhance your TypeScript code effortlessly with our professional TypeScript formatter. This tool provides clean and consistent indentation, clear syntax highlighting, and intelligent type checking to help you write reliable, maintainable code. It automatically detects and corrects common formatting issues while preserving your code’s logic and readability. Whether you’re working with TypeScript files, interfaces, or classes, the formatter ensures a well-structured and visually appealing result. It’s perfect for developers who want to clean up messy code, improve consistency across projects, and maintain high-quality standards. Use it instantly in your browser to format TypeScript code effortlessly, without the need for any extra installations or setup.",
    keywords: ["typescript", "ts", "formatter", "beautifier", "code formatter"],
  }

  return <FormatterInterface type="typescript" formatter={formatter} />
}
