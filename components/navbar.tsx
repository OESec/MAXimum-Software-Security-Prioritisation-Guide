"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Settings, Shield, Grid3X3, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-8 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl ml-16 lg:ml-24">
          <div className="relative">
            <Shield
              className="h-8 w-8 text-yellow-500 drop-shadow-lg filter"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full drop-shadow-sm" />
            </div>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <span className="hidden sm:inline">
              MAXimum Security <span className="text-sm">Prioritisation Calculator</span>
            </span>
            <span className="sm:hidden">MAX SEC</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-2 flex-1 justify-center">
          <Button asChild variant={pathname === "/criteria-reference" ? "default" : "ghost"} size="sm">
            <Link href="/criteria-reference">
              <FileText className="mr-2 h-4 w-4" />
              Criteria Reference
            </Link>
          </Button>
          <Button asChild variant={pathname === "/calculator" ? "default" : "ghost"} size="sm">
            <Link href="/calculator">
              <Calculator className="mr-2 h-4 w-4" />
              Calculator
            </Link>
          </Button>
          <Button asChild variant={pathname === "/risk-matrix" ? "default" : "ghost"} size="sm">
            <Link href="/risk-matrix">
              <Grid3X3 className="mr-2 h-4 w-4" />
              Risk Matrix
            </Link>
          </Button>
          <Button asChild variant={pathname === "/admin" ? "default" : "ghost"} size="sm">
            <Link href="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 mr-4 lg:mr-8">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
