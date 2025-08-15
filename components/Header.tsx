"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, RotateCcw, CheckCircle, AlertCircle, Code, Zap, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

interface Props {
    formatterName: string;
    icon?: React.ReactNode;
    statusBadge?: React.ReactNode
}
export function Header({ formatterName, icon, statusBadge }: Props) {

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-2 py-4">
                <div className="flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 ml-0">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/" className="!px-1">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Back to Home</span>
                            </Link>
                        </Button>
                        <div className="flex items-center space-x-2">
                            {icon}
                            <h1 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-gray-100 text-nowrap">{formatterName}</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <div>{statusBadge}</div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}
