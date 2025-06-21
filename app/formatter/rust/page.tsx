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
struct User {
    id: u32,
    name: String,
    email: String,
    is_active: bool,
}

impl User {
    fn new(id: u32, name: &str, email: &str, is_active: bool) -> Self {
        User {
            id,
            name: name.to_string(),
            email: email.to_string(),
            is_active,
        }
    }
}

fn greet_user(user: &User) -> String {
    format!("Hello, {}! Your email is {}", user.name, user.email)
}

fn main() {
    let users = vec![
        User::new(1, "John", "john@example.com", true),
        User::new(2, "Jane", "jane@example.com", false),
    ];
    
    for user in users.iter().filter(|u| u.is_active) {
        println!("{}", greet_user(user));
    }
}`,
    longDescription:
      "Format Rust code with proper indentation and syntax highlighting. Perfect for cleaning up Rust files, structs, and functions.",
    keywords: ["rust", "formatter", "beautifier", "code formatter", "rust beautifier"],
  }

  return <FormatterInterface type="rust" formatter={formatter} />
}
