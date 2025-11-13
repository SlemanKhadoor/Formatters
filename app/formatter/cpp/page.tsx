import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "C/C++ Formatter & Beautifier - Format C and C++ Code Online",
  description:
    "Professional C and C++ code formatter and beautifier. Format, validate, and organize C/C++ code with proper indentation and syntax highlighting.",
  keywords: ["c formatter", "cpp formatter", "c++ formatter", "c code formatter", "cpp beautifier", "c++ beautifier"],
}

export default function CppFormatterPage() {
  const formatter = {
    name: "C/C++",
    description: "Format, validate and beautify C and C++ code with real-time syntax checking",
    placeholder: `// C++ example
#include <iostream>
#include <vector>
#include <string>

struct User {int id;std::string name;std::string email;bool isActive;
};

std::string greetUser(const User& user) {
    return "Hello, " + user.name + "! Your email is " + user.email;
}

int main() {
    std::vector<User> users = {
        {1, "John", "john@example.com", true},
        {2, "Jane", "jane@example.com", false}
    };
    
    for (const auto& user : users) {
        if (user.isActive) {
            std::cout << greetUser(user) << std::endl;
        }
    }
    
    return 0;
}`,
    longDescription:
      "Format and beautify your C and C++ code effortlessly with our professional C/C++ formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It provides syntax highlighting, detects common mistakes, and organizes your C and C++ files, classes, and functions efficiently. Whether you are maintaining legacy projects or developing new applications, the formatter helps you produce high-quality, production-ready code. It improves readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable, and convenient results, no installation, setup, or plugins required. Perfect for C/C++ developers, learners, and enthusiasts alike.",
    keywords: ["c", "c++", "cpp", "formatter", "beautifier", "code formatter"],
  }

  return <FormatterInterface type="cpp" formatter={formatter} />
}
