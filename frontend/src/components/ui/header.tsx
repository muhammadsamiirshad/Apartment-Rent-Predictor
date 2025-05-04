"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, User, ChevronDown, Search, ExternalLink, X, Settings, LogOut, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New prediction made', description: 'A new apartment prediction was added', time: '2 min ago', read: false },
    { id: 2, title: 'Model performance report', description: 'Weekly model performance report is ready', time: '1 hour ago', read: false },
    { id: 3, title: 'System update', description: 'Platform was updated to version 2.1.0', time: '1 day ago', read: true },
  ]

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (pathname === '/') return []
    
    const paths = pathname.split('/').filter(p => p)
    return paths.map((path, i) => {
      const href = `/${paths.slice(0, i + 1).join('/')}`
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href
      }
    })
  }
  
  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="py-4 px-6 bg-background/80 backdrop-blur-lg sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              {breadcrumbs.map((crumb, i) => (
                <div key={i} className="flex items-center">
                  <ChevronRight size={12} className="mx-1 text-muted-foreground/70" />
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </motion.div>
        
        <div className="flex items-center gap-3">
          {/* Search button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search size={18} />
          </motion.button>
          
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  className="absolute right-0 mt-2 w-80 bg-background/95 rounded-xl shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-3 flex justify-between items-center bg-muted/40">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-primary hover:text-primary/80 transition-colors">Mark all as read</button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-3 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 flex justify-center bg-muted/40">
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                      View all <ExternalLink size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User menu */}
          <div className="relative ml-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/40 cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={16} />
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </motion.div>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  className="absolute right-0 mt-2 w-56 bg-background/95 rounded-xl shadow-lg overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-3 bg-muted/40">
                    <p className="font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground mt-0.5">admin@example.com</p>
                  </div>
                  <div>
                    <button className="w-full text-left px-3 py-2 hover:bg-muted/30 flex items-center gap-2 transition-colors">
                      <Settings size={14} />
                      <span className="text-sm">Account Settings</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-red-500/10 flex items-center gap-2 text-red-500 transition-colors">
                      <LogOut size={14} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-start justify-center pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearch(false)}
          >
            <motion.div 
              className="w-full max-w-2xl bg-background rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center">
                <Search size={18} className="text-primary mr-3" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none outline-none"
                  autoFocus
                />
                <button onClick={() => setShowSearch(false)}>
                  <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
              <div className="p-2 bg-muted/30">
                <p className="text-sm text-muted-foreground p-2">Try searching for predictions, models, or clusters</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}