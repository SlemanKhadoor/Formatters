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
    description: "Format and beautify TypeScript code with proper indentation and syntax highlighting",
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
      "Format TypeScript code with proper indentation, syntax highlighting, and type checking. Perfect for cleaning up TypeScript files, interfaces, and classes.",
    keywords: ["typescript", "ts", "formatter", "beautifier", "code formatter"],
  }

  return <FormatterInterface type="typescript" formatter={formatter} />
}
