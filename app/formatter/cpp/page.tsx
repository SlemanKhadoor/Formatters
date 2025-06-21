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
    description: "Format and beautify C and C++ code with proper indentation and syntax highlighting",
    placeholder: `// C++ example
#include <iostream>
#include <vector>
#include <string>

struct User {
    int id;
    std::string name;
    std::string email;
    bool isActive;
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
      "Format C and C++ code with proper indentation and syntax highlighting. Perfect for cleaning up C/C++ files, classes, and functions.",
    keywords: ["c", "c++", "cpp", "formatter", "beautifier", "code formatter"],
  }

  return <FormatterInterface type="cpp" formatter={formatter} />
}
