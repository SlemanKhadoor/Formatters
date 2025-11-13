import { notFound } from "next/navigation"
import FormatterInterface from "@/components/formatter-interface"
import type { Metadata } from "next"

const formatters = {
  json: {
    name: "JSON",
    description: "Format, validate and beautify JSON data with real-time syntax checking",
    placeholder: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "Python", "React"],
  "isActive": true
}`,
    longDescription:
      "Our advanced JSON formatter is carefully designed to help developers and data analysts format, validate, and beautifully beautify JSON data instantly. It provides a clean, intuitive, and user-friendly interface where you can easily paste, edit, and preview your JSON files in real time. The tool automatically highlights syntax errors, ensures proper indentation, and makes complex data structures much easier to read and understand. Whether you’re working with APIs, configuration files, or large datasets, this smart formatter saves you time and effort by improving accuracy and readability. It’s an essential and must-have utility for anyone who regularly handles JSON data in development, data analysis, or software testing.",
    keywords: ["json formatter","json beautifier","json validator","online json formatter","json formatter online","json beautify","beautify json","format json","jsonlint","JSON Checker","JSON Cleaner","json converter","json format","json online format","format json online"],
  },
  javascript: {
    name: "JavaScript",
    description: "Format, validate and beautify JavaScript code with real-time syntax checking",
    placeholder: `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){if(items[i].price&&items[i].quantity){total+=items[i].price*items[i].quantity;}}return total;}const items=[{name:"Product 1",price:29.99,quantity:2},{name:"Product 2",price:15.50,quantity:1}];console.log("Total:",calculateTotal(items));`,
    longDescription:
        "Format and beautify your JavaScript code effortlessly with our professional JavaScript formatter. This powerful tool automatically organizes your code with proper indentation, consistent spacing, and a clean, well-structured layout, making it easier to read, debug, and maintain. It also includes advanced syntax validation and intelligent error detection to help you identify mistakes instantly and improve overall code quality and performance. Whether you’re writing simple scripts or managing complex, large-scale applications, this formatter ensures your JavaScript stays clean, optimized, and production-ready. Perfect for developers who want reliable, efficient, and visually appealing code formatting directly in the browser without installing any additional software or plugins.",
    keywords: [
      "javascript formatter",
      "js beautifier",
      "javascript validator",
      "format javascript",
      "beautify js code",
    ],
  },
  html: {
    name: "HTML",
    description: "Format, validate and beautify HTML markup with real-time syntax checking",
    placeholder: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title></head><body><header><h1>Welcome to My Website</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><main><section><h2>About Us</h2><p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p></section></main><footer><p>&copy; 2024 My Website. All rights reserved.</p></footer></body></html>`,
    longDescription:
      "Format and structure your HTML markup effortlessly with our professional HTML formatter. This tool automatically organizes your code with proper indentation, spacing, and tag alignment, making it easier to read, maintain, and debug. It validates tag nesting, detects unclosed or misplaced tags, and ensures your HTML follows best coding practices. Whether you’re working on simple web pages or complex layouts, the formatter helps you achieve clean, consistent, and well-structured markup. It also improves overall readability, reduces human errors, and enhances your workflow efficiency. Use it directly in your browser for instant, reliable results—no installations, plugins, or setup required. Perfect for developers, designers, and learners alike.",
    keywords: ["html formatter","html beautifier","html validator","online html formatter","html formatter online","html beautify","beautify html","format html","html lint","HTML checker","HTML cleaner","html convert","html format","html online format","format html online"],
  },
  css: {
    name: "CSS",
    description: "Format, validate and beautify CSS code with real-time syntax checking",
    placeholder: `.header{background-color:#333;color:white;padding:1rem;display:flex;justify-content:space-between;align-items:center;}.nav ul{list-style:none;display:flex;gap:1rem;margin:0;padding:0;}.nav a{color:white;text-decoration:none;padding:0.5rem 1rem;border-radius:4px;transition:background-color 0.3s;}.nav a:hover{background-color:rgba(255,255,255,0.1);}.main{max-width:1200px;margin:0 auto;padding:2rem;}.card{background:white;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);padding:1.5rem;margin-bottom:1rem;}`,
    longDescription:
      "Organize and format your CSS styles effortlessly with our professional CSS formatter. This tool automatically arranges your style rules with proper indentation, spacing, and alignment, ensuring your code is clean, readable, and consistent across all files. It validates syntax, detects common mistakes, and organizes properties logically to improve maintainability. Whether you’re managing simple stylesheets or large-scale design systems, the formatter helps keep your CSS structured and professional. It reduces manual cleanup time, prevents formatting inconsistencies, and enhances overall workflow efficiency. Use it directly in your browser to instantly clean and beautify your CSS code, no installations, plugins, or technical setup required. Perfect for front-end developers and designers alike.",
    keywords: ["css formatter","css beautifier","css validator","online css formatter","css formatter online","css beautify","beautify css","format css","css lint","CSS checker","CSS cleaner","css convert","css format","css online format","format css online"],
  },
  python: {
    name: "Python",
    description: "Format, validate and beautify Python code with real-time syntax checking",
    placeholder: `def calculate_fibonacci(n):
                if n <= 1:
return n
           else:
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

                  def main():
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    fibonacci_results = []
    
           for num in numbers:
result = calculate_fibonacci(num)
  fibonacci_results.append(result)
        print(f"Fibonacci({num}) = {result}")
    
  return fibonacci_results

if __name__ == "__main__":
    main()`,
    longDescription:
      "Format and structure your Python code effortlessly with our professional Python formatter. This tool automatically applies proper indentation, spacing, and alignment based on PEP 8 standards, the official style guide for Python code. It validates syntax, highlights common errors, and ensures your code remains clean, consistent, and easy to read. Whether you’re writing simple scripts or managing complex applications, the formatter helps you maintain professional, production-ready code quality. It also enhances collaboration within teams by enforcing consistent formatting rules. Use it directly in your browser for instant, accurate results without needing to install any plugins or software. Perfect for developers, learners, and Python enthusiasts alike.",
    keywords: ["python formatter", "python beautifier", "format python", "python validator", "pep 8 formatter"],
  },
  xml: {
    name: "XML",
    description: "Format, validate and beautify XML documents with real-time syntax checking",
    placeholder: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><genre>Fiction</genre><price currency="USD">12.99</price><publishDate>1925-04-10</publishDate></book><book id="2"><title>To Kill a Mockingbird</title><author>Harper Lee</author><genre>Fiction</genre><price currency="USD">14.99</price><publishDate>1960-07-11</publishDate></book></catalog>`,
    longDescription:
      "Format, validate, and beautify your XML documents effortlessly with our professional XML formatter. This tool automatically applies proper indentation, spacing, and alignment, ensuring your XML files are clean, readable, and consistent. It detects malformed XML, highlights errors, and provides clear, descriptive messages to help you quickly identify and fix issues. Whether you are working on configuration files, data exchange documents, or complex XML structures, the formatter ensures your code is well-structured and professional. It improves readability, reduces debugging time, and enhances workflow efficiency. Use it directly in your browser for instant, reliable, and convenient results, no installation, setup, or plugins required. Ideal for developers, analysts, and XML enthusiasts alike.",
    keywords: ["xml formatter", "xml validator", "format xml", "xml beautifier", "validate xml"],
  },
  sql: {
    name: "SQL",
    description: "Format, validate and beautify SQL queries with real-time syntax checking",
    placeholder: `SELECT u.id, u.name, u.email, p.title as profile_title, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN profiles p ON u.id = p.user_id LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email, p.title HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC, u.name ASC LIMIT 100;`,
    longDescription:
      "Format, beautify, and optimize your SQL queries effortlessly with our professional SQL formatter. This tool automatically applies proper indentation, aligns keywords consistently, and capitalizes SQL commands for better readability. It validates syntax, detects common mistakes, and organizes complex queries, making them easier to read, understand, and maintain. Whether you are working on simple SELECT statements or managing large, multi-join queries in production databases, the formatter helps you produce clean, professional, and error-free SQL code. It reduces debugging time, enhances collaboration within development teams, and improves overall workflow efficiency. Use it directly in your browser for instant, reliable, and convenient results, no installation or plugins required. Ideal for database developers, analysts, and SQL enthusiasts.",
    keywords: ["sql formatter", "sql beautifier", "format sql", "sql validator", "beautify sql query"],
  },
  markdown: {
    name: "Markdown",
    description: "Format, validate and beautify Markdown text with real-time syntax checking",
    placeholder: `# Welcome to Markdown Formatter

This is a comprehensive guide to **Markdown formatting**.

## Features

### Text Formatting
- **Bold text** using double asterisks
- *Italic text* using single asterisks
- ~~Strikethrough~~ using double tildes
- \`Inline code\` using backticks

### Lists
1. Ordered list item 1
2. Ordered list item 2
   - Nested unordered item
   - Another nested item

### Links and Images
[Visit our website](https://example.com)

![Alt text for image](https://via.placeholder.com/300x200)

### Code Blocks
\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

### Tables
| Name | Age | City |
|------|-----|------|
| John | 30  | NYC  |
| Jane | 25  | LA   |

> This is a blockquote with important information.

---

*Thank you for using our Markdown formatter!*`,
    longDescription:
      "Format, preview, and validate your Markdown text effortlessly with our professional Markdown formatter. This tool automatically organizes headings, lists, code blocks, links, and other Markdown elements with proper indentation and spacing, ensuring your content is clean, structured, and readable. It provides real-time syntax validation, detects common formatting mistakes, and highlights errors to help you fix them quickly. Whether you are writing documentation, README files, blog posts, or any other Markdown-based content, this formatter ensures your text looks professional and well-organized. It improves readability, reduces errors, and enhances workflow efficiency. Use it directly in your browser for instant, reliable, and convenient results, no installation or plugins required. Ideal for developers, writers, and content creators.",
    keywords: ["markdown formatter", "markdown editor", "format markdown", "markdown validator", "md formatter"],
  },
}

interface PageProps {
  params: Promise<{ type: string }>
}

export default async function FormatterPage({ params }: PageProps) {
  const { type } = await params
  const formatter = formatters[type as keyof typeof formatters]

  if (!formatter) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${formatter.name} Formatter`,
    description: formatter.longDescription,
    url: `https://formatters.net/formatter/${type}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [`${formatter.name} Formatting`, "Syntax Validation", "Error Detection", "Real-time Processing"],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FormatterInterface type={type} formatter={formatter} />
    </>
  )
}

export function generateStaticParams() {
  return Object.keys(formatters).map((type) => ({
    type,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const formatter = formatters[type as keyof typeof formatters]

  if (!formatter) {
    return {
      title: "Formatter Not Found",
    }
  }

  return {
    title: `${formatter.name} Formatter - Format & Validate ${formatter.name} Code Online`,
    description: formatter.longDescription,
    keywords: formatter.keywords,
    openGraph: {
      title: `${formatter.name} Formatter - Formatters.net`,
      description: formatter.longDescription,
      url: `https://formatters.net/formatter/${type}`,
      type: "website",
      images: [
        {
          url: `/og-${type}.png`,
          width: 1200,
          height: 630,
          alt: `${formatter.name} Formatter`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${formatter.name} Formatter - Formatters.net`,
      description: formatter.longDescription,
      images: [`/og-${type}.png`],
    },
    alternates: {
      canonical: `https://formatters.net/formatter/${type}`,
    },
  }
}
