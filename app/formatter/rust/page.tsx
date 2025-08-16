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
    description: "Format and beautify Rust code with proper indentation and syntax highlighting",
    placeholder: `// Rust example
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];let even_numbers: Vec<i32> = numbers.into_iter().filter(|x| x % 2 == 0).collect();

    for num in even_numbers {
        println!("Even number: {}", num);
    }
}`,
    longDescription:
      "Format Rust code with proper indentation and syntax highlighting. Perfect for cleaning up Rust files, structs, and functions.",
    keywords: ["rust", "formatter", "beautifier", "code formatter", "rust beautifier"],
  }

  return <FormatterInterface type="rust" formatter={formatter} />
}
