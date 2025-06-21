import type { Metadata } from "next"
import FormatterInterface from "@/components/formatter-interface"

export const metadata: Metadata = {
  title: "Go Formatter & Beautifier - Format Go Code Online",
  description:
    "Professional Go language code formatter and beautifier. Format, validate, and organize Go code with proper indentation and syntax highlighting.",
  keywords: ["go formatter", "golang formatter", "go code formatter", "format go", "golang beautifier"],
}

export default function GoFormatterPage() {
  const formatter = {
    name: "Go",
    description: "Format and beautify Go code with proper indentation and syntax highlighting",
    placeholder: `package main

import (
	"fmt"
)

// User represents a user in the system
type User struct {
	ID       int
	Name     string
	Email    string
	IsActive bool
}

// GreetUser returns a greeting for the user
func GreetUser(user User) string {
	return fmt.Sprintf("Hello, %s! Your email is %s", user.Name, user.Email)
}

func main() {
	users := []User{
		{ID: 1, Name: "John", Email: "john@example.com", IsActive: true},
		{ID: 2, Name: "Jane", Email: "jane@example.com", IsActive: false},
	}

	for _, user := range users {
		if user.IsActive {
			fmt.Println(GreetUser(user))
		}
	}
}`,
    longDescription:
      "Format Go code with proper indentation and syntax highlighting. Perfect for cleaning up Go files, structs, and functions.",
    keywords: ["go", "golang", "formatter", "beautifier", "code formatter", "go beautifier"],
  }

  return <FormatterInterface type="go" formatter={formatter} />
}
