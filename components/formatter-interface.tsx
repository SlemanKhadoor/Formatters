"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Code, Zap, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "@/components/layout-with-ads"
import CodeEditor from "@/components/code-editor"
import { Header } from "@/components/Header"
import yaml from "js-yaml"

interface FormatterProps {
  type: string
  formatter: {
    name: string
    description: string
    placeholder: string
    longDescription: string
    keywords: string[]
  }
}

export default function FormatterInterface({ type, formatter }: FormatterProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [indentationType, setIndentationType] = useState<"2-spaces" | "4-spaces" | "tabs">("2-spaces")
  const [formatMode, setFormatMode] = useState<"beautify" | "minify">("beautify")

  // Enhanced validation and formatting logic
  const formatCode = useCallback(
    async (code: string | undefined) => {
      // Add comprehensive null/undefined checks
      if (!code || typeof code !== "string" || !code.trim()) {
        setOutput("")
        setIsValid(true)
        setError("")
        setIsProcessing(false)
        return
      }

      setIsProcessing(true)

      // Simulate processing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 100))

      try {
        let formatted = ""

        // Get indentation string based on user preference
        const getIndent = () => {
          switch (indentationType) {
            case "2-spaces":
              return "  "
            case "4-spaces":
              return "    "
            case "tabs":
              return "\t"
            default:
              return "  "
          }
        }

        const indent = getIndent()

        switch (type) {
          case "json":
            try {
              const trimmed = code.trim()
              if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
                throw new Error("JSON must start with '{' or '['")
              }

              const parsed = JSON.parse(code)

              if (formatMode === "minify") {
                formatted = JSON.stringify(parsed)
              } else {
                formatted = JSON.stringify(
                  parsed,
                  null,
                  indentationType === "tabs" ? "\t" : indentationType === "4-spaces" ? 4 : 2,
                )
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                const match = err.message.match(/position (\d+)/)
                const position = match ? Number.parseInt(match[1]) : null
                const validationError = `JSON Syntax Error${position ? ` at position ${position}` : ""}: ${err.message}`
                throw new Error(validationError)
              } else {
                const validationError = `Invalid JSON: ${err instanceof Error ? err.message : "Unknown error"}`
                throw new Error(validationError)
              }
            }
            break

          case "javascript":
            try {
              new Function(code); // Will throw SyntaxError if invalid JS

              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove line comments
                  .replace(/\s+/g, " ") // Replace multiple spaces with single space
                  .replace(/;\s*}/g, ";}") // Remove space before closing brace
                  .replace(/{\s*/g, "{") // Remove space after opening brace
                  .replace(/\s*}/g, "}") // Remove space before closing brace
                  .replace(/;\s*/g, ";") // Remove space after semicolon
                  .trim()
              } else {
                let indentLevel = 0
                formatted = code
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/\{(?!\s*$)/g, " {\n")
                  .replace(/\}(?!\s*$)/g, "\n}\n")
                  .replace(/,(?![^(]*\))(?!\s*$)/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (trimmed.endsWith("{")) indentLevel++

                    return result
                  })
                  .filter((line) => line.trim())
                  .join("\n")
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`JavaScript Syntax Error: ${err.message}`)
              } else {
                throw new Error(`Invalid JavaScript: ${err instanceof Error ? err.message : "Unknown error"}`)
              }
            }
            break;
          case "typescript":
            try {
              const ts = require("typescript");

              const sourceFile = ts.createSourceFile(
                "temp.ts",
                code,
                ts.ScriptTarget.Latest,
      /*setParentNodes*/ true,
                ts.ScriptKind.TS
              );

              const diagnostics = sourceFile.parseDiagnostics || [];
              if (diagnostics.length > 0) {
                const firstError = diagnostics[0];
                const message = ts.flattenDiagnosticMessageText(firstError.messageText, "\n");
                throw new Error(`TypeScript Syntax Error: ${message}`);
              }

              // If valid, proceed to formatting
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\s+/g, " ")
                  .replace(/;\s*}/g, ";}")
                  .replace(/{\s*/g, "{")
                  .replace(/\s*}/g, "}")
                  .replace(/;\s*/g, ";")
                  .trim();
              } else {
                let indentLevel = 0;
                formatted = code
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/\{(?!\s*$)/g, " {\n")
                  .replace(/\}(?!\s*$)/g, "\n}\n")
                  .replace(/,(?![^(]*\))(?!\s*$)/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;

                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              throw new Error(
                err instanceof Error ? err.message : "TypeScript syntax error"
              );
            }
            break;

          case "html": {
            try {
              const openTags: string[] = [];
              const voidTags = new Set([
                "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"
              ]);

              const tagRegex = new RegExp('</?([a-zA-Z0-9]+)(\\s[^>]*)?>', 'g');
              let match: RegExpExecArray | null;

              // reset lastIndex to be safe if reused
              tagRegex.lastIndex = 0;

              while ((match = tagRegex.exec(code)) !== null) {
                const tagName = match[1].toLowerCase();
                const fullTag = match[0];

                if (fullTag.startsWith("<!") || voidTags.has(tagName)) continue;

                if (fullTag.startsWith("</")) {
                  if (openTags.length === 0 || openTags[openTags.length - 1] !== tagName) {
                    throw new Error(`HTML syntax error: unmatched closing tag </${tagName}>`);
                  }
                  openTags.pop();
                } else {
                  openTags.push(tagName);
                }
              }

              if (openTags.length > 0) {
                throw new Error(`HTML syntax error: unclosed tag <${openTags[openTags.length - 1]}>`);
              }

              if (formatMode === "minify") {
                formatted = code
                  .replace(/>\s+</g, "><")
                  .replace(/\s+/g, " ")
                  .replace(/\s*=\s*/g, "=")
                  .trim();
              } else {
                let indentLevel = 0;
                const indent = "  ";
                formatted = code
                  .replace(/></g, ">\n<")
                  .split("\n")
                  .map(line => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.includes("<!")
                    ) {
                      indentLevel++;
                    }

                    return result;
                  })
                  .filter(line => line)
                  .join("\n");
              }
            } catch (err: unknown) {
              const validationError = err instanceof Error ? err.message : "HTML syntax error";
              throw new Error(validationError);
            }
            break;
          }


          case "css":
            try {
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
                  .replace(/\s+/g, " ") // Replace multiple spaces
                  .replace(/;\s*}/g, ";}") // Remove space before closing brace
                  .replace(/{\s*/g, "{") // Remove space after opening brace
                  .replace(/\s*}/g, "}") // Remove space before closing brace
                  .replace(/;\s*/g, ";") // Remove space after semicolon
                  .replace(/:\s*/g, ":") // Remove space after colon
                  .trim()
              } else {
                formatted = code
                  .replace(/\{/g, " {\n")
                  .replace(/\}/g, "\n}\n")
                  .replace(/;(?!\s*$)/g, ";\n")
                  .replace(/,(?![^{]*})/g, ",\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.endsWith("{") || trimmed.endsWith("}")) {
                      return trimmed
                    } else if (trimmed.includes(":")) {
                      return indent + trimmed
                    }
                    return trimmed
                  })
                  .filter((line) => line)
                  .join("\n")
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "CSS syntax error"
              throw new Error(validationError)
            }
            break

          // case "python":
          //   try {
          //     const keywordsIncrease = /^(if |elif |else:|for |while |def |class |try:|except |finally:|with )/;
          //     const keywordsDecrease = /^(elif |else:|except |finally:)/;

          //     // 🔹 Split inline statements safely
          //     function splitInlineStatements(code: string): string {
          //       const maxAttempts = 5; // أقصى عدد محاولات لكل سطر
          //       return code
          //         .split("\n")
          //         .map((line) => {
          //           let tmp = line.trim();
          //           if (!tmp) return "";

          //           let attempts = 0;
          //           let changed = true;

          //           while (changed && attempts < maxAttempts) {
          //             const newTmp = tmp.replace(/:(?!\s*$)([^\n]+)/, (match, stmt) => ":\n" + stmt.trim());
          //             changed = newTmp !== tmp;
          //             tmp = newTmp;
          //             attempts++;
          //           }

          //           // فصل def/class/if/for/while بعد return أو statement
          //           tmp = tmp.replace(
          //             /(return [^:\n]+)(def|class|if|for|while)/g,
          //             (match, stmt, keyword) => stmt + "\n" + keyword
          //           );

          //           return tmp;
          //         })
          //         .join("\n");
          //     }

          //     const safeCode = splitInlineStatements(code);

          //     // 🔹 Basic syntax validation (strings + brackets)
          //     function basicPythonValidation(code: string): string | null {
          //       let stack: string[] = [];
          //       let inString: string | null = null;

          //       for (let i = 0; i < code.length; i++) {
          //         const ch = code[i];

          //         if ((ch === '"' || ch === "'") && code[i - 1] !== "\\") {
          //           if (inString === ch) inString = null;
          //           else if (!inString) inString = ch;
          //         }

          //         if (!inString) {
          //           if ("([{".includes(ch)) stack.push(ch);
          //           if (")]}".includes(ch)) {
          //             const last = stack.pop();
          //             if (!last || "([{".indexOf(last) !== ")]}".indexOf(ch)) {
          //               return `SyntaxError: unexpected '${ch}' at position ${i}`;
          //             }
          //           }
          //         }
          //       }

          //       if (inString) return `SyntaxError: unterminated string literal`;
          //       if (stack.length) return `SyntaxError: unbalanced brackets`;

          //       return null;
          //     }

          //     const validationErr = basicPythonValidation(safeCode);
          //     if (validationErr) throw new SyntaxError(validationErr);

          //     // 🔹 Indentation formatting
          //     const lines = safeCode.split("\n");
          //     let indentLevel = 0;
          //     const indentStr =
          //       indentationType === "tabs"
          //         ? "\t"
          //         : indentationType === "4-spaces"
          //           ? "    "
          //           : "  ";

          //     const formattedLines = lines.map((line) => {
          //       const trimmed = line.trim();
          //       if (!trimmed) return ""; // سطر فارغ
          //       if (trimmed.startsWith("#")) return indentStr.repeat(indentLevel) + trimmed; // تعليق

          //       if (keywordsDecrease.test(trimmed)) indentLevel = Math.max(indentLevel - 1, 0);

          //       const result = indentStr.repeat(indentLevel) + trimmed;

          //       if (keywordsIncrease.test(trimmed) || trimmed.endsWith(":")) indentLevel++;

          //       return result;
          //     });

          //     // 🔹 Pretty / Minify
          //     if (formatMode === "minify") {
          //       formatted = lines
          //         .map((l) => l.trim())
          //         .filter((l) => l && !l.startsWith("#"))
          //         .join("\n"); // لو بدك يمكن تعمل join("") لسطر واحد فقط
          //     } else {
          //       formatted = formattedLines.filter(Boolean).join("\n");
          //     }

          //     // 🔹 حماية الكود الضخم
          //     const maxLength = 50000;
          //     if (formatted.length > maxLength) {
          //       throw new Error("Python code too large to format safely");
          //     }

          //   } catch (err) {
          //     const validationError = err instanceof Error ? err.message : "Python syntax error";
          //     throw new Error(validationError);
          //   }
          //   break;


          // case "python":
          //   try {
          //     const checkBrackets = (s: string) => {
          //       const stack: string[] = [];
          //       const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
          //       const quoteChars = ['"', "'"];
          //       let inString: string | null = null;

          //       for (const char of s) {
          //         if (quoteChars.includes(char)) {
          //           if (inString === char) { inString = null; }
          //           else if (inString === null) { inString = char; }
          //         }
          //         if (inString) continue;

          //         if (pairs[char]) {
          //           stack.push(char);
          //         } else if (Object.values(pairs).includes(char)) {
          //           if (stack.length === 0 || pairs[stack.pop()!] !== char) {
          //             throw new Error(`Python Syntax Error: Mismatched brackets. Unexpected '${char}'`);
          //           }
          //         }
          //       }
          //       if (stack.length > 0) {
          //         throw new Error(`Python Syntax Error: Mismatched brackets. Unclosed '${stack[stack.length - 1]}'`);
          //       }
          //     };
          //     checkBrackets(code);

          //     // --- Formatting Logic ---
          //     if (formatMode === "minify") {
          //       formatted = code
          //         .split("\n")
          //         .map((line) => line.trim().split("#")[0].trim())
          //         .filter((line) => line)
          //         .join("; ");
          //     } else {
          //       // This is a robust, safe, keyword-based formatter.
          //       let indentLevel = 0;
          //       const formattedLines: string[] = [];
          //       const lines = code.split('\n');

          //       for (const line of lines) {
          //         const trimmed = line.trim();

          //         if (trimmed === "") {
          //           formattedLines.push("");
          //           continue;
          //         }


          //         if (trimmed.startsWith("elif") || trimmed.startsWith("else:") || trimmed.startsWith("except") || trimmed.startsWith("finally:")) {
          //           indentLevel = Math.max(0, indentLevel - 1);
          //         }

          //         const safeIndentLevel = Math.max(0, indentLevel);
          //         formattedLines.push(indent.repeat(safeIndentLevel) + trimmed);

          //         if (trimmed.endsWith(":")) {
          //           indentLevel++;
          //         }
          //       }
          //       const finalLines = [];
          //       let finalIndent = 0;
          //       for (let i = 0; i < formattedLines.length; i++) {
          //         const currentLine = formattedLines[i].trim();
          //         if (!currentLine) {
          //           finalLines.push('');
          //           continue;
          //         }

          //         let nextLineTrimmed = "";
          //         for (let j = i + 1; j < formattedLines.length; j++) {
          //           if (formattedLines[j].trim()) {
          //             nextLineTrimmed = formattedLines[j].trim();
          //             break;
          //           }
          //         }

          //         const shouldDeIndentAfter = (
          //           (nextLineTrimmed.startsWith("elif") || nextLineTrimmed.startsWith("else:")) && currentLine.endsWith(":") ||
          //           (nextLineTrimmed.startsWith("def ") || nextLineTrimmed.startsWith("class ")) && !currentLine.endsWith(":")
          //         );

          //         if (i > 0 && !currentLine.endsWith(":") && formattedLines[i - 1].trim().endsWith(":")) {
          //         }

          //         if (currentLine.startsWith('def ') || currentLine.startsWith('class ')) {
          //           finalIndent = 0;
          //         }
          //         if (currentLine.startsWith('elif ') || currentLine.startsWith('else:') || currentLine.startsWith('except') || currentLine.startsWith('finally:')) {
          //           finalIndent = Math.max(0, finalIndent - 1);
          //         }

          //         finalLines.push(indent.repeat(finalIndent) + currentLine);

          //         if (currentLine.endsWith(':')) {
          //           finalIndent++;
          //         }
          //       }


          //       formatted = finalLines.join('\n');
          //     }
          //   } catch (err) {
          //     const validationError = err instanceof Error ? err.message : "Python syntax error";
          //     throw new Error(validationError);
          //   }
          //   break;

          case "python":
            try {
              const checkBrackets = (s: string) => {
                const stack: string[] = [];
                const pairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
                let inString: string | null = null;
                let tripleQuote: string | null = null;
                let escapeNext = false;

                for (let i = 0; i < s.length; i++) {
                  const char = s[i];

                  if (escapeNext) {
                    escapeNext = false;
                    continue;
                  }

                  if (char === '\\') {
                    escapeNext = true;
                    continue;
                  }

                  // triple quotes """ or '''
                  if (!inString && (s.slice(i, i + 3) === '"""' || s.slice(i, i + 3) === "'''")) {
                    tripleQuote = s.slice(i, i + 3);
                    inString = tripleQuote;
                    i += 2;
                    continue;
                  } else if (inString === tripleQuote && s.slice(i, i + 3) === tripleQuote) {
                    inString = null;
                    tripleQuote = null;
                    i += 2;
                    continue;
                  }

                  // single or double quotes
                  if ((char === '"' || char === "'") && !inString) {
                    inString = char;
                    continue;
                  } else if (char === inString && inString !== tripleQuote) {
                    inString = null;
                    continue;
                  }

                  if (inString) continue;

                  // تعليق
                  if (char === '#') {
                    while (i < s.length && s[i] !== '\n') i++;
                    continue;
                  }

                  if (pairs[char]) stack.push(char);
                  else if (Object.values(pairs).includes(char)) {
                    if (stack.length === 0 || pairs[stack.pop()!] !== char) {
                      throw new Error(`Python Syntax Error: Mismatched brackets. Unexpected '${char}'`);
                    }
                  }
                }

                if (stack.length > 0) {
                  throw new Error(
                    `Python Syntax Error: Mismatched brackets. Unclosed '${stack[stack.length - 1]}' at EOF`
                  );
                }
              };

              checkBrackets(code);

              // --- Formatting Logic ---
              if (formatMode === "minify") {
                formatted = code
                  .split("\n")
                  .map((line) => line.trim().split("#")[0].trim())
                  .filter((line) => line)
                  .join("; ");
              } else {
                let indentLevel = 0;
                const formattedLines: string[] = [];
                const lines = code.split('\n');

                for (const line of lines) {
                  const trimmed = line.trim();

                  if (trimmed === "") {
                    formattedLines.push("");
                    continue;
                  }

                  if (trimmed.startsWith("elif") || trimmed.startsWith("else:") || trimmed.startsWith("except") || trimmed.startsWith("finally:")) {
                    indentLevel = Math.max(0, indentLevel - 1);
                  }

                  formattedLines.push(indent.repeat(Math.max(0, indentLevel)) + trimmed);

                  if (trimmed.endsWith(":")) {
                    indentLevel++;
                  }
                }

                formatted = formattedLines.join('\n');
              }

            } catch (err) {
              const validationError = err instanceof Error ? err.message : "Python syntax error";
              throw new Error(validationError);
            }
            break;


          case "xml":
            try {
              if (!code.trim().startsWith("<")) {
                throw new SyntaxError("XML must start with a root tag");
              }

              // Check for matching opening/closing tags (basic)
              const tagStack = [];
              const tagRegex = /<\/?([a-zA-Z_][\w:\-\.]*)(\s[^>]*)?>/g;
              let match;

              while ((match = tagRegex.exec(code)) !== null) {
                const fullTag = match[0];
                const tagName = match[1];

                if (fullTag.startsWith("</")) {
                  // closing tag
                  const last = tagStack.pop();
                  if (last !== tagName) {
                    throw new SyntaxError(`Mismatched closing tag: expected </${last}> but found </${tagName}>`);
                  }
                } else if (!fullTag.endsWith("/>") && !fullTag.startsWith("<?")) {
                  // opening tag (ignore self-closing <.../> and <?xml ...?>)
                  tagStack.push(tagName);
                }
              }

              if (tagStack.length > 0) {
                throw new SyntaxError(`Unclosed tag(s): ${tagStack.join(", ")}`);
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code.replace(/>\s+</g, "><").trim();
              }
              // --- Pretty Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/></g, ">\n<")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("</")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (
                      trimmed.startsWith("<") &&
                      !trimmed.startsWith("</") &&
                      !trimmed.endsWith("/>") &&
                      !trimmed.startsWith("<?")
                    ) {
                      indentLevel++;
                    }

                    return result;
                  })
                  .filter((line) => line)
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`XML Syntax Error: ${err.message}`);
              } else {
                throw new Error(`Invalid XML: ${err instanceof Error ? err.message : "Unknown error"}`);
              }
            }
            break;

          case "sql":
            try {
              const upperCode: string = code.toUpperCase();
              const requiredKeywords: string[] = ["SELECT", "FROM"];
              const missingKeyword = requiredKeywords.find((kw) => !upperCode.includes(kw));
              if (missingKeyword) {
                throw new SyntaxError(`SQL Syntax Error: missing ${missingKeyword} clause`);
              }

              const openParens: number = (code.match(/\(/g) || []).length;
              const closeParens: number = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("SQL Syntax Error: mismatched parentheses");
              }

              const idxOfWord = (kw: string): number => {
                const m = upperCode.match(new RegExp(`\\b${kw}\\b`, "i"));
                return m ? m.index ?? -1 : -1;
              };

              const pos: Record<string, number> = {
                SELECT: idxOfWord("SELECT"),
                FROM: idxOfWord("FROM"),
                WHERE: idxOfWord("WHERE"),
                GROUP_BY: upperCode.search(/\bGROUP\s+BY\b/i),
                HAVING: idxOfWord("HAVING"),
                ORDER_BY: upperCode.search(/\bORDER\s+BY\b/i),
                LIMIT: idxOfWord("LIMIT"),
              };

              const maxPos = (arr: number[]): number => {
                const valid = arr.filter((x) => x !== -1);
                return valid.length > 0 ? Math.max(...valid) : -1;
              };

              if (pos.FROM !== -1 && pos.SELECT !== -1 && pos.FROM < pos.SELECT) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (FROM appears before SELECT)");
              }

              if (pos.WHERE !== -1 && pos.FROM !== -1 && pos.WHERE < pos.FROM) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (WHERE appears before FROM)");
              }

              const afterWhereOrFrom = pos.WHERE !== -1 ? pos.WHERE : pos.FROM;
              if (pos.GROUP_BY !== -1 && afterWhereOrFrom !== -1 && pos.GROUP_BY < afterWhereOrFrom) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (GROUP BY appears too early)");
              }

              if (pos.HAVING !== -1 && pos.GROUP_BY === -1) {
                throw new SyntaxError("SQL Syntax Error: HAVING used without GROUP BY");
              }
              if (pos.HAVING !== -1 && pos.GROUP_BY !== -1 && pos.HAVING < pos.GROUP_BY) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (HAVING before GROUP BY)");
              }

              const lastBeforeOrder = maxPos([pos.HAVING, pos.GROUP_BY, pos.WHERE, pos.FROM]);
              if (pos.ORDER_BY !== -1 && pos.ORDER_BY < lastBeforeOrder) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (ORDER BY appears too early)");
              }

              const lastBeforeLimit = maxPos([pos.ORDER_BY, pos.HAVING, pos.GROUP_BY, pos.WHERE, pos.FROM]);
              if (pos.LIMIT !== -1 && pos.LIMIT < lastBeforeLimit) {
                throw new SyntaxError("SQL Syntax Error: invalid clause order (LIMIT appears too early)");
              }

              const joinRegex = /\b(?:LEFT|RIGHT|INNER|FULL(?:\s+OUTER)?)?\s+JOIN\b/gi;
              const nextClauseRegex = /\b(WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b|;/gi;

              let m: RegExpExecArray | null;
              while ((m = joinRegex.exec(upperCode)) !== null) {
                const joinIdx = m.index ?? -1;

                if (pos.FROM !== -1 && joinIdx < pos.FROM) {
                  throw new SyntaxError("SQL Syntax Error: invalid clause order (JOIN appears before FROM)");
                }

                nextClauseRegex.lastIndex = joinIdx;
                const next = nextClauseRegex.exec(upperCode);
                const nextIdx = next ? next.index ?? upperCode.length : upperCode.length;

                const joinSegment = upperCode.slice(joinIdx, nextIdx);
                if (!/\bON\b/i.test(joinSegment)) {
                  throw new SyntaxError("SQL Syntax Error: JOIN missing ON condition");
                }
              }

              if (formatMode === "minify") {
                formatted = code.replace(/\s+/g, " ").trim();
              } else {
                const protect = (s: string): string =>
                  s
                    .replace(/\bFULL\s+OUTER\s+JOIN\b/gi, "FULL_OUTER_JOIN")
                    .replace(/\bLEFT\s+JOIN\b/gi, "LEFT_JOIN")
                    .replace(/\bRIGHT\s+JOIN\b/gi, "RIGHT_JOIN")
                    .replace(/\bINNER\s+JOIN\b/gi, "INNER_JOIN")
                    .replace(/\bFULL\s+JOIN\b/gi, "FULL_JOIN");

                const unprotect = (s: string): string =>
                  s
                    .replace(/\bFULL_OUTER_JOIN\b/g, "FULL OUTER JOIN")
                    .replace(/\bLEFT_JOIN\b/g, "LEFT JOIN")
                    .replace(/\bRIGHT_JOIN\b/g, "RIGHT JOIN")
                    .replace(/\bINNER_JOIN\b/g, "INNER JOIN")
                    .replace(/\bFULL_JOIN\b/g, "FULL JOIN");

                let work = protect(code);

                const keywords: string[] = [
                  "SELECT", "FROM",
                  "LEFT_JOIN", "RIGHT_JOIN", "INNER_JOIN", "FULL_OUTER_JOIN", "FULL_JOIN", "JOIN",
                  "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT",
                  "AND", "OR"
                ];

                keywords.forEach((kw: string) => {
                  const regex = new RegExp(`\\b${kw}\\b`, "gi");
                  work = work.replace(regex, "\n" + kw);
                });

                formatted = unprotect(
                  work
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .join("\n")
                );
              }

            } catch (err: unknown) {
              const validationError = err instanceof Error ? err.message : "SQL syntax error";
              throw new Error(validationError);
            }
            break;

          case "markdown":
            try {
              formatted = code
                .split("\n")
                .map((line) => line.trim())
                .join("\n")
                .replace(/\n{3,}/g, "\n\n")
                .replace(/^(#{1,6})\s*/gm, (match, hashes) => `${hashes} `)

              if (formatMode === "minify") {
                formatted = formatted.replace(/\s+/g, " ").trim()
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "Markdown syntax error"
              throw new Error(validationError)
            }
            break

          case "yaml":

            try {
              if (formatMode === "minify") {
                const parsed = yaml.load(code)
                formatted = yaml.dump(parsed, {
                  indent: indentationType === "4-spaces" ? 4 : 2,
                  lineWidth: -1, // disable line wrapping
                  noRefs: true,  // remove YAML anchors
                }).replace(/\n+/g, "\n") // compact blank lines
              } else {
                const parsed = yaml.load(code)
                formatted = yaml.dump(parsed, {
                  indent: indentationType === "4-spaces" ? 4 : 2,
                  lineWidth: -1,
                  noRefs: true,
                })
              }
            } catch (err) {
              const validationError = err instanceof Error ? err.message : "YAML syntax error"
              throw new Error(validationError)
            }
            break

          case "php":
            try {
              // --- Basic Syntax Checks ---
              if (!code.includes("<?php")) {
                throw new SyntaxError("Missing '<?php' opening tag");
              }

              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\s+/g, " ") // Collapse spaces
                  .trim();
              }
              // --- Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("<?php")) return trimmed;
                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;
                    return result;
                  })
                  .filter((line) => line)
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`PHP Syntax Error: ${err.message}`);
              } else {
                throw new Error(`Invalid PHP code: ${err instanceof Error ? err.message : "Unknown error"}`);
              }
            }
            break;


          case "go":
            try {
              // Simple syntax check for braces, parentheses, and main function
              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              if (!/package\s+\w+/.test(code)) {
                throw new SyntaxError("Missing package declaration");
              }

              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\s+/g, " ") // Collapse spaces
                  .trim();
              } else {
                let indentLevel = 0;

                formatted = code
                  .replace(/(package\s+\w+)/g, "$1\n")
                  .replace(/(import\s*\(.*?\))/g, (m) =>
                    m.replace(/\s+/g, "\n").replace(/\(\n+/, "(\n").replace(/\n+\)/, "\n)")
                  )
                  .replace(/(import\s+"[^"]+")/g, "$1\n")
                  .replace(/}\s*func/g, "}\n\nfunc")
                  .replace(/}\s*type/g, "}\n\ntype")
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, "\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;

                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`Go Syntax Error: ${err.message}`);
              } else {
                throw new Error(
                  `Invalid Go code: ${err instanceof Error ? err.message : "Unknown error"}`
                );
              }
            }
            break;
          case "cpp":
            try {
              // --- Basic Syntax Check ---
              const openBraces = (code.match(/{/g) || []).length;
              const closeBraces = (code.match(/}/g) || []).length;
              if (openBraces !== closeBraces) {
                throw new SyntaxError("Mismatched braces");
              }

              const openParens = (code.match(/\(/g) || []).length;
              const closeParens = (code.match(/\)/g) || []).length;
              if (openParens !== closeParens) {
                throw new SyntaxError("Mismatched parentheses");
              }

              const openBrackets = (code.match(/\[/g) || []).length;
              const closeBrackets = (code.match(/\]/g) || []).length;
              if (openBrackets !== closeBrackets) {
                throw new SyntaxError("Mismatched square brackets");
              }

              if (!/#include\s+<.*?>/.test(code) && !/int\s+main\s*\(/.test(code)) {
                throw new SyntaxError("Missing #include or main() function");
              }

              // --- Minify Mode ---
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/\s+/g, " ") // Collapse multiple spaces
                  .replace(/\s*([{}();,])\s*/g, "$1") // Remove spaces around symbols
                  .trim();
              }
              // --- Format Mode ---
              else {
                let indentLevel = 0;
                formatted = code
                  .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
                  .replace(/\/\/.*$/gm, "") // Remove single-line comments
                  .replace(/;/g, ";\n") // Break after semicolons
                  .replace(/{/g, "{\n") // Break after {
                  .replace(/}/g, "\n}") // Break before }
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim();
                    if (!trimmed) return "";

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1);
                    const result = indent.repeat(indentLevel) + trimmed;
                    if (trimmed.endsWith("{")) indentLevel++;
                    return result;
                  })
                  .filter((line) => line.trim())
                  .join("\n");
              }
            } catch (err) {
              if (err instanceof SyntaxError) {
                throw new Error(`C++ Syntax Error: ${err.message}`);
              } else {
                throw new Error(
                  `Invalid C++ code: ${err instanceof Error ? err.message : "Unknown error"}`
                );
              }
            }
            break;

          case "rust":
          case "swift":
          case "kotlin":
            // case "cpp":
            try {
              // Basic syntax validation
              const stack: string[] = [];
              const pairs: Record<string, string> = { "{": "}", "(": ")", "[": "]" };

              for (let i = 0; i < code.length; i++) {
                const char = code[i];
                if (pairs[char]) {
                  stack.push(char);
                } else if (Object.values(pairs).includes(char)) {
                  const last = stack.pop();
                  if (!last || pairs[last] !== char) {
                    throw new Error(`Syntax error: unexpected '${char}' at position ${i}`);
                  }
                }
              }
              if (stack.length > 0) {
                throw new Error(`Syntax error: unclosed '${stack[stack.length - 1]}'`);
              }

              // Formatting
              if (formatMode === "minify") {
                formatted = code
                  .replace(/\/\/.*$/gm, "")
                  .replace(/\/\*[\s\S]*?\*\//g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              } else {
                let indentLevel = 0
                const indent = "    ";
                formatted = code
                  .replace(/\s*{\s*/g, " {\n")
                  .replace(/\s*}\s*/g, "\n}")
                  .replace(/;\s*(?!\s*$)/g, ";\n")
                  .replace(/\)\s*(?=fun|class|let|fn|impl)/g, ")\n")
                  .replace(/\}\s*(?=fun|class|let|fn|impl)/g, "}\n")
                  .split("\n")
                  .map((line) => {
                    const trimmed = line.trim()
                    if (!trimmed) return ""

                    if (trimmed.startsWith("}")) indentLevel = Math.max(0, indentLevel - 1)
                    const result = indent.repeat(indentLevel) + trimmed
                    if (trimmed.endsWith("{")) indentLevel++

                    return result
                  })
                  .filter((line) => line.trim())
                  .join("\n")
              }
            } catch (err) {
              const validationError =
                err instanceof Error ? err.message : `${type} syntax error`;
              throw new Error(validationError);
            }
            break;


          default:
            formatted = code
        }

        setOutput(formatted)
        setIsValid(true)
        setError("")
      } catch (err) {
        setIsValid(false)
        setError(err instanceof Error ? err.message : "Invalid format")
        setOutput("")
      } finally {
        setIsProcessing(false)
      }
    },
    [type, indentationType, formatMode],
  )

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (content) {
          setInput(content)
          setUploadedFileName(file.name)
          formatCode(content)

          toast({
            title: "File uploaded",
            description: `${file.name} loaded successfully`,
          })
        }
      }

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to read the file",
          variant: "destructive",
        })
      }

      reader.readAsText(file)
    },
    [toast, formatCode],
  )

  const handleInputChange = (value: string) => {
    setInput(value)
    formatCode(value)
  }

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "Formatted code copied to clipboard",
      })
    }
  }

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `formatted.${type}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded!",
        description: "Formatted code downloaded successfully",
      })
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setIsValid(true)
    setError("")
  }

  const handleLoadExample = () => {
    if (formatter?.placeholder) {
      setInput(formatter.placeholder)
      formatCode(formatter.placeholder)
    }
  }

  // Safety check for formatter prop
  if (!formatter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Loading Formatter...</h1>
          <p className="text-gray-600">Please wait while we load the formatter interface.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header formatterName={formatter.name + ' Formatter'}
        icon={<Code className="sm:h-5 sm:w-5 h-4 w-4 text-blue-600" />}
        statusBadge={
          isProcessing ? (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <Zap className="h-3 w-3 mr-1 animate-pulse" />
              Processing
            </Badge>
          ) : isValid ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid
            </Badge>
          )
        } />
      <div className="container mx-auto px-2 py-8">
        <LayoutWithAds>
          {/* Page Header */}
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{formatter.name} Formatter</h1>
            <p className="text-base sm:text-lg text-gray-500 mb-4">{formatter.description}</p>
            <p className="text-sm sm:text-base text-gray-500">{formatter.longDescription}</p>
          </header>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <section>
              <Card>
                <CardHeader className="pb-4">
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-lg">Input</CardTitle>
                      <CardDescription className="text-sm">
                        {uploadedFileName
                          ? `File: ${uploadedFileName}`
                          : `Paste or type your ${formatter.name.toLowerCase()} code here`}
                      </CardDescription>
                    </div>

                    {/* Mobile-first responsive controls */}
                    <div className="space-y-3">
                      {/* First row: Upload and Example buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".txt,.js,.jsx,.ts,.tsx,.html,.htm,.css,.json,.py,.xml,.sql,.md,.markdown"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Upload
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLoadExample}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          Load Example
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleClear} className="flex-1 sm:flex-none">
                          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Second row: Dropdowns */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* First select with custom arrow */}
                        <div className="relative flex-1">
                          <select
                            value={indentationType}
                            onChange={(e) => setIndentationType(e.target.value as any)}
                            className="w-full appearance-none px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md bg-white dark:bg-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="2-spaces">2 Spaces</option>
                            <option value="4-spaces">4 Spaces</option>
                            <option value="tabs">Tabs</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Second select with custom arrow */}
                        <div className="relative flex-1">
                          <select
                            value={formatMode}
                            onChange={(e) => setFormatMode(e.target.value as any)}
                            className="w-full appearance-none px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md bg-white dark:bg-background text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                          >
                            <option value="beautify">Beautify</option>
                            <option value="minify">Minify</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-white">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeEditor
                    value={input}
                    onChange={handleInputChange}
                    language={type}
                    placeholder={`Enter your ${formatter.name.toLowerCase()} code here...`}
                    aria-label={`${formatter.name} code input`}
                  />
                  {error && (
                    <div
                      className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs sm:text-sm"
                      role="alert"
                    >
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 inline mr-2" />
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Output Section */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex flex-col items-start sm:items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">Output</CardTitle>
                      <CardDescription className="text-sm">
                        Formatted {formatter.name.toLowerCase()} code
                      </CardDescription>
                    </div>
                    <div className="flex gap-1 w-full sm:w-auto flex-wrap justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!output || !isValid}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!output || !isValid}
                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeEditor
                    value={output}
                    language={type}
                    placeholder="Formatted code will appear here..."
                    readOnly
                    aria-label={`Formatted ${formatter.name} code output`}
                  />
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Tips and Information Section */}
          <section className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Tips & Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="formatting" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="formatting" className="text-xs sm:text-sm">
                      Formatting
                    </TabsTrigger>
                    <TabsTrigger value="validation" className="text-xs sm:text-sm">
                      Validation
                    </TabsTrigger>
                    <TabsTrigger value="shortcuts" className="text-xs sm:text-sm">
                      Shortcuts
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="formatting" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        How {formatter.name} Formatting Works:
                      </h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Paste your {formatter.name.toLowerCase()} code and see it formatted instantly</li>
                        <li>The formatter automatically detects and fixes common formatting issues</li>
                        <li>Proper indentation and spacing are applied according to best practices</li>
                        <li>Use the "Load Example" button to see how the formatter works</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="validation" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">Validation Features:</h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Real-time syntax validation as you type</li>
                        <li>Detailed error messages help you identify and fix issues</li>
                        <li>The status badge shows whether your code is valid</li>
                        <li>Line-by-line error reporting for precise debugging</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="shortcuts" className="mt-4">
                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        Keyboard Shortcuts & Features:
                      </h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                        <li>Copy formatted code with the copy button</li>
                        <li>Download formatted code as a file</li>
                        <li>Clear input with the reset button</li>
                        <li>Load example code to test the formatter</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </section>
        </LayoutWithAds>
      </div>
    </div>
  )
}
