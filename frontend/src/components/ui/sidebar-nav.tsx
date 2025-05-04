"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  BarChart2, 
  PieChart,
  Database,
  History,
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sun,
  Moon,
  LayoutDashboard,
  GanttChart,
  Layers,
  Info
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  isExpanded: boolean
  isActive: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, isExpanded, isActive }) => {
  return (
    <Link href={href}>
      <motion.div
        className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-primary/10 text-primary shadow-sm' 
            : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className={`text-xl flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>{icon}</span>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-sm font-medium truncate ${isActive ? 'text-primary' : ''}`}
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </Link>
  )
}

interface NavGroupProps {
  title: string
  children: React.ReactNode
  icon: React.ReactNode
  isExpanded: boolean
}

const NavGroup: React.FC<NavGroupProps> = ({ title, children, icon, isExpanded }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="mb-2">
      <motion.button
        className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} w-full px-3 py-2 text-sm text-muted-foreground rounded-xl hover:bg-muted/40 hover:text-foreground`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        {isExpanded ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-md flex-shrink-0">{icon}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium"
              >
                {title}
              </motion.span>
            </div>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          </>
        ) : (
          <span className="text-md">{icon}</span>
        )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={isExpanded ? "pl-9 pt-1 space-y-1" : "pt-1 space-y-1"}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Client-side only theme toggle to prevent hydration mismatch
const ThemeToggle = ({ expanded }: { expanded: boolean }) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Only show the UI when mounted on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  if (!mounted) {
    return (
      <motion.button
        className={`flex items-center ${expanded ? 'justify-start' : 'justify-center'} gap-3 w-full px-3 py-3 rounded-xl bg-primary/10 hover:bg-primary/15`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className="text-xl opacity-0">
          <Sun size={20} className="text-primary" />
        </span>
        {expanded && (
          <span className="text-sm font-medium text-foreground opacity-0">
            Theme
          </span>
        )}
      </motion.button>
    )
  }
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`flex items-center ${expanded ? 'justify-start' : 'justify-center'} gap-3 w-full px-3 py-3 rounded-xl ${
        theme === 'dark' 
          ? 'bg-primary/10 hover:bg-primary/15' 
          : 'bg-primary/10 hover:bg-primary/15'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="text-xl">
        {theme === 'dark' ? (
          <Sun size={20} className="text-primary" />
        ) : (
          <Moon size={20} className="text-primary" />
        )}
      </span>
      {expanded && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-sm font-medium text-foreground"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </motion.span>
      )}
    </motion.button>
  )
}

export function SidebarNav() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <motion.aside
      className="h-screen bg-background/80 dark:bg-background/95 flex flex-col backdrop-blur-md"
      animate={{ width: expanded ? '300px' : '80px' }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 flex items-center justify-between">
        {expanded ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-primary/10 dark:bg-primary/15 p-2 rounded-xl">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-primary">
              ApartmentRentPredictor
            </h1>
          </motion.div>
        ) : (
          <div className="mx-auto bg-primary/10 dark:bg-primary/15 p-2 rounded-xl">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-xl hover:bg-muted/40 text-muted-foreground"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        <NavItem 
          href="/" 
          icon={<Home size={20} />} 
          label="Dashboard" 
          isExpanded={expanded}
          isActive={isActive('/')}
        />
        
        <NavGroup title="Analysis" icon={<BarChart2 size={20} />} isExpanded={expanded}>
          <NavItem 
            href="/predict" 
            icon={<Database size={18} />} 
            label="Apartment Prediction" 
            isExpanded={expanded}
            isActive={isActive('/predict')}
          />
          <NavItem 
            href="/models" 
            icon={<GanttChart size={18} />} 
            label="Model Comparison" 
            isExpanded={expanded}
            isActive={isActive('/models')}
          />
          <NavItem 
            href="/clustering" 
            icon={<PieChart size={18} />} 
            label="Clustering" 
            isExpanded={expanded}
            isActive={isActive('/clustering')}
          />
        </NavGroup>
        
        <NavGroup title="Records" icon={<Layers size={20} />} isExpanded={expanded}>
          <NavItem 
            href="/history" 
            icon={<History size={18} />} 
            label="Prediction History" 
            isExpanded={expanded}
            isActive={isActive('/history')}
          />
        </NavGroup>
        
        <div className="px-3 py-2">
          {expanded && <div className="text-xs text-muted-foreground mb-2 uppercase font-medium tracking-wider">System</div>}
          <NavItem 
            href="/about" 
            icon={<Info size={18} />} 
            label="About" 
            isExpanded={expanded}
            isActive={isActive('/about')}
          />
          <NavItem 
            href="/settings" 
            icon={<Settings size={18} />} 
            label="Settings" 
            isExpanded={expanded}
            isActive={isActive('/settings')}
          />
        </div>
      </div>
      
      <div className="p-2 mt-2">
        <ThemeToggle expanded={expanded} />
      </div>
    </motion.aside>
  )
}