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
		description: "Format, validate and beautify Go code with real-time syntax checking",
		placeholder: `package main;import("fmt");type User struct{ID int;Name string;Email string;IsActive bool};func GreetUser(user User)string{return fmt.Sprintf("Hello, %s! Your email is %s",user.Name,user.Email)};func main(){users:=[]User{{1,"John","john@example.com",true},{2,"Jane","jane@example.com",false}};for _,user:=range users{if user.IsActive{fmt.Println(GreetUser(user))}}}`,

		longDescription:
			"Format and beautify your Go code effortlessly with our professional Go formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent. It provides syntax highlighting, detects common errors, and organizes your Go files, structs, and functions efficiently. Whether you are maintaining existing projects or building new applications, the formatter helps you produce professional, production-ready code. It improves code readability, reduces debugging time, and enhances collaboration within development teams. Use it directly in your browser for instant, reliable results, no installation, setup, or plugins required. Perfect for developers, learners, and Go enthusiasts alike.",
		keywords: ["go", "golang", "formatter", "beautifier", "code formatter", "go beautifier"],
	}

	return <FormatterInterface type="go" formatter={formatter} />
}
