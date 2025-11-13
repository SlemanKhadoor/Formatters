"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, RefreshCw, ShieldCheck, AlertTriangle, Shield, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import LayoutWithAds from "./layout-with-ads"
import { Header } from "@/components/Header"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const { toast } = useToast()

  const generatePassword = useCallback(() => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      })
      return
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(result)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, toast])

  const calculateStrength = useCallback((pwd: string) => {
    let score = 0
    const feedback = []

    // Length check
    if (pwd.length >= 12) score += 2
    else if (pwd.length >= 8) score += 1
    else feedback.push("Use at least 8 characters")

    // Character variety
    if (/[a-z]/.test(pwd)) score += 1
    else feedback.push("Include lowercase letters")

    if (/[A-Z]/.test(pwd)) score += 1
    else feedback.push("Include uppercase letters")

    if (/[0-9]/.test(pwd)) score += 1
    else feedback.push("Include numbers")

    if (/[^a-zA-Z0-9]/.test(pwd)) score += 2
    else feedback.push("Include special characters")

    // Bonus points
    if (pwd.length >= 16) score += 1
    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pwd)) score += 1

    let strength = "Very Weak"
    let color = "text-red-600"
    let bgColor = "bg-red-100"

    if (score >= 7) {
      strength = "Very Strong"
      color = "text-green-600"
      bgColor = "bg-green-100"
    } else if (score >= 5) {
      strength = "Strong"
      color = "text-blue-600"
      bgColor = "bg-blue-100"
    } else if (score >= 3) {
      strength = "Medium"
      color = "text-yellow-600"
      bgColor = "bg-yellow-100"
    } else if (score >= 1) {
      strength = "Weak"
      color = "text-orange-600"
      bgColor = "bg-orange-100"
    }

    return { strength, color, bgColor, score, feedback }
  }, [])

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      })
    }
  }

  const strengthInfo = password ? calculateStrength(password) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header
        formatterName={'Password Generator'}
        icon={<ShieldCheck className="sm:h-5 sm:w-5 h-4 w-4 text-red-600" />}
        statusBadge=
        {strengthInfo && (
          <Badge variant="secondary" className={`${strengthInfo.bgColor} ${strengthInfo.color}`}>
            <Shield className="h-3 w-3 mr-1" />
            {strengthInfo.strength}
          </Badge>
        )}
      />

      <div className="container mx-auto px-4 py-8">
        <LayoutWithAds adPosition="right" showAds={true}>
          <main>
            {/* Page Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Password Generator</h1>
              <p className="text-lg text-gray-600 mb-4">
                Generate secure passwords with custom rules and character sets
              </p>
              <p className="text-gray-500">
                Create strong, unique, and secure passwords instantly with our professional Password Generator. All generation happens locally in your browser, ensuring maximum privacy and security, no data is ever sent to any server. Customize your passwords by adjusting their length and choosing whether to include uppercase letters, lowercase letters, numbers, and special symbols. This tool helps you protect your online accounts, applications, and sensitive data from unauthorized access and brute-force attacks. With one click, you can generate multiple complex passwords that meet strict security standards and best practices. Perfect for developers, system administrators, and everyday users who value safety and reliability. Use it anytime directly in your browser for fast, secure, and hassle-free password creation without installing any software or extensions.
              </p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Generator Section */}
              <section>
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Password Settings</CardTitle>
                    <CardDescription>Customize your password requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Length Slider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Length: {length}</label>
                      <input
                        type="range"
                        min="4"
                        max="128"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>4</span>
                        <span>128</span>
                      </div>
                    </div>

                    {/* Character Options */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Include Characters</h4>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                        <label htmlFor="uppercase" className="text-sm">
                          Uppercase Letters (A-Z)
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                        <label htmlFor="lowercase" className="text-sm">
                          Lowercase Letters (a-z)
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                        <label htmlFor="numbers" className="text-sm">
                          Numbers (0-9)
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                        <label htmlFor="symbols" className="text-sm">
                          Symbols (!@#$%^&*)
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="exclude-similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
                        <label htmlFor="exclude-similar" className="text-sm">
                          Exclude Similar Characters (i, l, 1, L, o, 0, O)
                        </label>
                      </div>
                    </div>

                    {/* Generate Button */}
                    <Button onClick={generatePassword} className="w-full" size="lg">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Password
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* Result Section */}
              <section>
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Password</CardTitle>
                        <CardDescription>Your secure password is ready</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Password Display */}
                    <div className="relative">
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[60px] flex items-center">
                        {password ? (
                          <span className={`font-mono text-lg break-all ${showPassword ? "" : "filter blur-sm"}`}>
                            {password}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Click "Generate Password" to create a password</span>
                        )}
                      </div>
                      {password && (
                        <Button variant="outline" size="sm" onClick={handleCopy} className="absolute top-2 right-2">
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Strength Meter */}
                    {strengthInfo && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Password Strength</span>
                          <Badge variant="secondary" className={`${strengthInfo.bgColor} ${strengthInfo.color}`}>
                            {strengthInfo.strength}
                          </Badge>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.score >= 7
                              ? "bg-green-500"
                              : strengthInfo.score >= 5
                                ? "bg-blue-500"
                                : strengthInfo.score >= 3
                                  ? "bg-yellow-500"
                                  : strengthInfo.score >= 1
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                              }`}
                            style={{ width: `${Math.min(100, (strengthInfo.score / 8) * 100)}%` }}
                          />
                        </div>

                        {strengthInfo.feedback.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-gray-700">Suggestions:</span>
                            {strengthInfo.feedback.map((suggestion, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                <span>{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security Tips */}
                <Card className="border-0 shadow-md mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Security Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Use a unique password for each account</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Store passwords in a reputable password manager</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Enable two-factor authentication when available</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Avoid using personal information in passwords</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </main>
        </LayoutWithAds>
      </div>
    </div>
  )
}
