import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "Rust Formatter & Beautifier - Format Rust Code Online",
  description:
    "Professional Rust code formatter and beautifier. Format, validate, and organize Rust code with proper indentation and syntax highlighting.",
  keywords: ["rust formatter", "rust beautifier", "rust code formatter", "format rust", "rust validator"],
}

export default function RustFormatterPage() {
  const formatter = {
    name: "Rust",
    description: "Format, validate and beautify Rust code with real-time syntax checking",
    placeholder: `// Rust example
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];let even_numbers: Vec<i32> = numbers.into_iter().filter(|x| x % 2 == 0).collect();

    for num in even_numbers {
        println!("Even number: {}", num);
    }
}`,
    longDescription:
      "Format and beautify your Rust code effortlessly with our professional Rust formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent. It provides syntax highlighting, detects common mistakes, and organizes your Rust files, structs, and functions efficiently. Whether you are maintaining existing projects or building new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable results, no installation, setup, or plugins required. Perfect for Rust developers, learners, and enthusiasts alike.",
    keywords: ["rust", "formatter", "beautifier", "code formatter", "rust beautifier"],
  }

  return <FormatterInterface type="rust" formatter={formatter} />
}
