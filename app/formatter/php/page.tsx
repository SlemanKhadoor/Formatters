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
    description: "Format and beautify PHP code with proper indentation and syntax highlighting",
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
      "Format PHP code with proper indentation and syntax highlighting. Perfect for cleaning up PHP files, classes, and functions.",
    keywords: ["php", "formatter", "beautifier", "code formatter", "php beautifier"],
  }

  return <FormatterInterface type="php" formatter={formatter} />
}
