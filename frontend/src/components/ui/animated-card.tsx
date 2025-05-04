"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface AnimatedCardProps {
  href: string
  icon: ReactNode
  title: string
  description: string
  color: string
}

export function AnimatedCard({ href, icon, title, description, color }: AnimatedCardProps) {
  // Color classes based on the color prop for light and dark mode
  const colorSchemes = {
    blue: {
      background: 'bg-gradient-to-br from-blue-100/20 to-blue-50/10 dark:from-blue-900/20 dark:to-blue-800/5',
      iconBg: 'bg-gradient-to-br from-blue-100 to-blue-50/70 dark:from-blue-800/30 dark:to-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-300',
      highlight: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
      hoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20',
    },
    purple: {
      background: 'bg-gradient-to-br from-purple-100/20 to-purple-50/10 dark:from-purple-900/20 dark:to-purple-800/5',
      iconBg: 'bg-gradient-to-br from-purple-100 to-purple-50/70 dark:from-purple-800/30 dark:to-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-300',
      highlight: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
      hoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-900/20',
    },
    green: {
      background: 'bg-gradient-to-br from-green-100/20 to-green-50/10 dark:from-green-900/20 dark:to-green-800/5',
      iconBg: 'bg-gradient-to-br from-green-100 to-green-50/70 dark:from-green-800/30 dark:to-green-900/20',
      iconColor: 'text-green-600 dark:text-green-300',
      highlight: 'group-hover:text-green-700 dark:group-hover:text-green-300',
      hoverBg: 'hover:bg-green-50/50 dark:hover:bg-green-900/20',
    },
    amber: {
      background: 'bg-gradient-to-br from-amber-100/20 to-amber-50/10 dark:from-amber-900/20 dark:to-amber-800/5',
      iconBg: 'bg-gradient-to-br from-amber-100 to-amber-50/70 dark:from-amber-800/30 dark:to-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-300',
      highlight: 'group-hover:text-amber-700 dark:group-hover:text-amber-300',
      hoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-900/20',
    },
  }[color] || {
    background: 'bg-gradient-to-br from-blue-100/20 to-blue-50/10 dark:from-blue-900/20 dark:to-blue-800/5',
    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-50/70 dark:from-blue-800/30 dark:to-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-300',
    highlight: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
    hoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20',
  }

  return (
    <Link href={href} className="block">
      <motion.div 
        className={`group rounded-xl ${colorSchemes.background} p-6 shadow-sm ${colorSchemes.hoverBg} transition-all duration-200`}
        whileHover={{ 
          y: -5, 
          transition: { duration: 0.2 },
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`${colorSchemes.iconBg} p-3 rounded-full shadow-sm`}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
          >
            <div className={`w-8 h-8 ${colorSchemes.iconColor} flex items-center justify-center`}>
              {icon}
            </div>
          </motion.div>
          <div className="text-left flex-1">
            <h2 className={`text-xl font-semibold mb-1 transition-colors duration-200 ${colorSchemes.highlight}`}>{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className={`${colorSchemes.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
          >
            →
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}