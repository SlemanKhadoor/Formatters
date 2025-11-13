import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "PHP Formatter & Beautifier - Format PHP Code Online",
  description:
    "Professional PHP code formatter and beautifier. Format, validate, and organize PHP code with proper indentation and syntax highlighting.",
  keywords: ["php formatter", "php beautifier", "php code formatter", "format php", "php validator"],
}

export default function PHPFormatterPage() {
  const formatter = {
    name: "PHP",
    description: "Format, validate and beautify PHP code with real-time syntax checking",
    placeholder: `<?php
// PHP example
class User {
    private $id;
    private $name;
    private $email;
    
    public function __construct($id, $name, $email) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }
    
    public function getName() {
        return $this->name;
    }
    
    public function getEmail() {
        return $this->email;
    }
}

function greetUser($user) {
    return "Hello, " . $user->getName() . "! Your email is " . $user->getEmail();
}

$users = [
    new User(1, "John", "john@example.com"),
    new User(2, "Jane", "jane@example.com")
];

foreach ($users as $user) {
    echo greetUser($user) . "\\n";
}`,
    longDescription:
      "Format and beautify your PHP code effortlessly with our professional PHP formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, consistent, and easy to read. It provides syntax highlighting, detects common formatting and structural issues, and organizes your PHP files, classes, and functions efficiently. Whether you’re maintaining existing projects or building new applications, the formatter helps you write production-ready, professional-quality code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable formatting, no installation, setup, or plugins required. Perfect for developers, students, and anyone working with PHP code daily.",
    keywords: ["php", "formatter", "beautifier", "code formatter", "php beautifier"],
  }

  return <FormatterInterface type="php" formatter={formatter} />
}
