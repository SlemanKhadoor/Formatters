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
      "Our JSON formatter helps you format, validate, and beautify JSON data instantly. Perfect for developers working with APIs, configuration files, and data structures.",
    keywords: ["json formatter", "json validator", "json beautifier", "format json online", "validate json"],
  },
  javascript: {
    name: "JavaScript",
    description: "Format and beautify JavaScript code with syntax validation",
    placeholder: `function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){if(items[i].price&&items[i].quantity){total+=items[i].price*items[i].quantity;}}return total;}const items=[{name:"Product 1",price:29.99,quantity:2},{name:"Product 2",price:15.50,quantity:1}];console.log("Total:",calculateTotal(items));`,
    longDescription:
      "Format and beautify your JavaScript code with our professional JavaScript formatter. Includes syntax validation, error detection, and proper indentation.",
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
    description: "Format and structure HTML markup with tag validation",
    placeholder: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title></head><body><header><h1>Welcome to My Website</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><main><section><h2>About Us</h2><p>This is a sample paragraph with <strong>bold text</strong> and <em>italic text</em>.</p></section></main><footer><p>&copy; 2024 My Website. All rights reserved.</p></footer></body></html>`,
    longDescription:
      "Format and structure your HTML markup with our HTML formatter. Validates tag nesting, detects unclosed tags, and provides proper indentation.",
    keywords: ["html formatter", "html beautifier", "format html", "html validator", "structure html"],
  },
  css: {
    name: "CSS",
    description: "Format and organize CSS styles with syntax validation",
    placeholder: `.header{background-color:#333;color:white;padding:1rem;display:flex;justify-content:space-between;align-items:center;}.nav ul{list-style:none;display:flex;gap:1rem;margin:0;padding:0;}.nav a{color:white;text-decoration:none;padding:0.5rem 1rem;border-radius:4px;transition:background-color 0.3s;}.nav a:hover{background-color:rgba(255,255,255,0.1);}.main{max-width:1200px;margin:0 auto;padding:2rem;}.card{background:white;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);padding:1.5rem;margin-bottom:1rem;}`,
    longDescription:
      "Organize and format your CSS styles with our CSS formatter. Validates syntax, organizes properties, and provides consistent formatting.",
    keywords: ["css formatter", "css beautifier", "format css", "css validator", "organize css"],
  },
  python: {
    name: "Python",
    description: "Format and structure Python code with PEP 8 compliance",
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
      "Format your Python code with proper indentation and PEP 8 compliance. Validates syntax and provides clean, readable code structure.",
    keywords: ["python formatter", "python beautifier", "format python", "python validator", "pep 8 formatter"],
  },
  xml: {
    name: "XML",
    description: "Format and validate XML documents with proper structure",
    placeholder: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><genre>Fiction</genre><price currency="USD">12.99</price><publishDate>1925-04-10</publishDate></book><book id="2"><title>To Kill a Mockingbird</title><author>Harper Lee</author><genre>Fiction</genre><price currency="USD">14.99</price><publishDate>1960-07-11</publishDate></book></catalog>`,
    longDescription:
      "Format and validate XML documents with proper structure and indentation. Detects malformed XML and provides clear error messages.",
    keywords: ["xml formatter", "xml validator", "format xml", "xml beautifier", "validate xml"],
  },
  sql: {
    name: "SQL",
    description: "Format and beautify SQL queries with syntax validation",
    placeholder: `SELECT u.id, u.name, u.email, p.title as profile_title, COUNT(o.id) as order_count, SUM(o.total) as total_spent FROM users u LEFT JOIN profiles p ON u.id = p.user_id LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at >= '2024-01-01' AND u.status = 'active' GROUP BY u.id, u.name, u.email, p.title HAVING COUNT(o.id) > 0 ORDER BY total_spent DESC, u.name ASC LIMIT 100;`,
    longDescription:
      "Format and beautify SQL queries with proper indentation and keyword capitalization. Validates syntax and improves query readability.",
    keywords: ["sql formatter", "sql beautifier", "format sql", "sql validator", "beautify sql query"],
  },
  markdown: {
    name: "Markdown",
    description: "Format and preview Markdown text with syntax validation",
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
      "Format and preview Markdown text with syntax validation. Perfect for documentation, README files, and content creation.",
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
