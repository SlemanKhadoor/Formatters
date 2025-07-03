"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Palette, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/Header"


interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
  cmyk: { c: number; m: number; y: number; k: number }
}

export function ColorConverter() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#3B82F6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 },
  })
  const [inputValue, setInputValue] = useState("#3B82F6")
  const [palette, setPalette] = useState<string[]>([])
  const { toast } = useToast()

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
      : null
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? "0" + hex : hex
        })
        .join("")
    )
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      v = max

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    }
  }

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, Math.max(g, b))
    const c = (1 - r - k) / (1 - k) || 0
    const m = (1 - g - k) / (1 - k) || 0
    const y = (1 - b - k) / (1 - k) || 0

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  const updateColor = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

    setColor({ hex, rgb, hsl, hsv, cmyk })
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      updateColor(value)
    }
  }

  const generatePalette = () => {
    const baseHue = color.hsl.h
    const newPalette = [
      color.hex,
      rgbToHex(...hslToRgb((baseHue + 30) % 360, color.hsl.s, color.hsl.l)),
      rgbToHex(...hslToRgb((baseHue + 60) % 360, color.hsl.s, color.hsl.l)),
      rgbToHex(...hslToRgb((baseHue + 120) % 360, color.hsl.s, color.hsl.l)),
      rgbToHex(...hslToRgb((baseHue + 180) % 360, color.hsl.s, color.hsl.l)),
    ]
    setPalette(newPalette)
  }

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `Color value copied to clipboard.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy color value.",
        variant: "destructive",
      })
    }
  }

  const generateRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    setInputValue(randomHex)
    updateColor(randomHex)
  }

  useEffect(() => {
    generatePalette()
  }, [color])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header formatterName={'Color Converter'} icon={<Palette className="sm:h-5 sm:w-5 w-4 h-4 text-pink-600" />} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-start mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Color Converter</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert colors between HEX, RGB, HSL, HSV, and CMYK formats with live preview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Input and Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color Input
                  </CardTitle>
                  <CardDescription>Enter a color value or use the color picker</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="#3B82F6"
                      className="font-mono"
                    />
                    <Button onClick={generateRandomColor} variant="outline">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => {
                        setInputValue(e.target.value)
                        updateColor(e.target.value)
                      }}
                      className="w-full h-12 rounded border cursor-pointer"
                    />
                  </div>

                  <div
                    className="w-full h-32 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: color.hex }}
                  />
                </CardContent>
              </Card>

              {/* Color Palette */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Harmony</CardTitle>
                  <CardDescription>Generated color palette based on your selection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {palette.map((paletteColor, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className="w-full h-16 rounded cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                          style={{ backgroundColor: paletteColor }}
                          onClick={() => copyToClipboard(paletteColor)}
                          title={`Click to copy ${paletteColor}`}
                        />
                        <p className="text-xs text-center font-mono">{paletteColor}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Color Values */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Color Values</CardTitle>
                  <CardDescription>All color format representations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="hex" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="hex">HEX</TabsTrigger>
                      <TabsTrigger value="rgb">RGB</TabsTrigger>
                      <TabsTrigger value="hsl">HSL</TabsTrigger>
                      <TabsTrigger value="hsv">HSV</TabsTrigger>
                      <TabsTrigger value="cmyk">CMYK</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hex" className="space-y-4">
                      <div>
                        <Label>HEX Value</Label>
                        <div className="flex gap-2 mt-2">
                          <Input value={color.hex} readOnly className="font-mono" />
                          <Button onClick={() => copyToClipboard(color.hex)} variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rgb" className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Red</Label>
                          <Input value={color.rgb.r} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Green</Label>
                          <Input value={color.rgb.g} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Blue</Label>
                          <Input value={color.rgb.b} readOnly className="font-mono mt-2" />
                        </div>
                      </div>
                      <div>
                        <Label>RGB String</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            onClick={() => copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
                            variant="outline"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="hsl" className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Hue</Label>
                          <Input value={`${color.hsl.h}°`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Saturation</Label>
                          <Input value={`${color.hsl.s}%`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Lightness</Label>
                          <Input value={`${color.hsl.l}%`} readOnly className="font-mono mt-2" />
                        </div>
                      </div>
                      <div>
                        <Label>HSL String</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}
                            readOnly
                            className="font-mono"
                          />
                          <Button
                            onClick={() => copyToClipboard(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
                            variant="outline"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="hsv" className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Hue</Label>
                          <Input value={`${color.hsv.h}°`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Saturation</Label>
                          <Input value={`${color.hsv.s}%`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Value</Label>
                          <Input value={`${color.hsv.v}%`} readOnly className="font-mono mt-2" />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cmyk" className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Cyan</Label>
                          <Input value={`${color.cmyk.c}%`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Magenta</Label>
                          <Input value={`${color.cmyk.m}%`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Yellow</Label>
                          <Input value={`${color.cmyk.y}%`} readOnly className="font-mono mt-2" />
                        </div>
                        <div>
                          <Label>Black</Label>
                          <Input value={`${color.cmyk.k}%`} readOnly className="font-mono mt-2" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
