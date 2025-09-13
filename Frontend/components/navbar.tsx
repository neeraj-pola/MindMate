"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Brain } from "lucide-react"

interface NavbarProps {
  onFormSelect: (form: "phq9" | "gad7") => void
}

export function Navbar({ onFormSelect }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindMate
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              About Us
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Forms <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onFormSelect("phq9")} className="cursor-pointer">
                  PHQ-9 Depression Screen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFormSelect("gad7")} className="cursor-pointer">
                  GAD-7 Anxiety Screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
