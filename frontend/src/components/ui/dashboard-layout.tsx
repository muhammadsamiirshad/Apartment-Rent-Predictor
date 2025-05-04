"use client"

import { SidebarNav } from "./sidebar-nav"
import { Header } from "./header"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        
        <main className="flex-1 overflow-auto py-6 px-4 sm:px-6 bg-background/90">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        <footer className="py-4 px-6 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              © 2025 <span className="text-primary font-medium">Muhammad Sami</span>
            </p>
            <div className="text-xs text-muted-foreground flex gap-6">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}