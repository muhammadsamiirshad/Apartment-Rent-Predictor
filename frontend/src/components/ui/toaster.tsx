"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export function Toast({ message, type = 'info', duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const getToastClasses = () => {
    const baseClasses = 'fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg z-50'
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-600 text-white`
      case 'error':
        return `${baseClasses} bg-red-600 text-white`
      case 'info':
      default:
        return `${baseClasses} bg-blue-600 text-white`
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={getToastClasses()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toaster() {
  return null
}