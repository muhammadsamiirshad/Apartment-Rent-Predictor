"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { motion } from "framer-motion"
import { 
  Moon, 
  Sun, 
  Monitor, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  Database,
  Save,
  RefreshCw,
  X
} from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8080")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [dataRetention, setDataRetention] = useState("30")
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Available color themes
  const colorThemes = [
    { name: "blue", color: "bg-blue-500" },
    { name: "emerald", color: "bg-emerald-500" },
    { name: "violet", color: "bg-violet-500" },
    { name: "amber", color: "bg-amber-500" },
    { name: "rose", color: "bg-rose-500" }
  ]
  
  const [selectedColorTheme, setSelectedColorTheme] = useState("blue")
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const handleSaveSettings = () => {
    setIsLoading(true)
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsLoading(false)
      setSavedSuccessfully(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSavedSuccessfully(false)
      }, 3000)
    }, 800)
  }
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Configure application preferences and account settings"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-10 max-w-5xl"
      >
        {/* Appearance Settings */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Appearance</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-8">
            {/* Theme selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme Mode</h3>
              <p className="text-sm text-muted-foreground">
                Choose how ML Analytics appears to you. Select a theme preference.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/50 bg-background/50'
                  }`}
                >
                  <Sun className={`h-8 w-8 mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={theme === 'light' ? 'font-medium text-primary' : 'text-muted-foreground'}>Light</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    theme === 'dark' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/50 bg-background/50'
                  }`}
                >
                  <Moon className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={theme === 'dark' ? 'font-medium text-primary' : 'text-muted-foreground'}>Dark</span>
                </button>
                
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    theme === 'system' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-muted-foreground/50 bg-background/50'
                  }`}
                >
                  <Monitor className={`h-8 w-8 mb-2 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={theme === 'system' ? 'font-medium text-primary' : 'text-muted-foreground'}>System</span>
                </button>
              </div>
            </div>
            
            {/* Color theme selection */}
            <div className="border-t border-border pt-8 space-y-4">
              <h3 className="text-lg font-medium">Color Theme</h3>
              <p className="text-sm text-muted-foreground">
                Select the primary color theme for the application.
              </p>
              
              <div className="flex gap-4 mt-4">
                {colorThemes.map(colorTheme => (
                  <button
                    key={colorTheme.name}
                    onClick={() => setSelectedColorTheme(colorTheme.name)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${colorTheme.color} ${
                      selectedColorTheme === colorTheme.name ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''
                    }`}
                    title={colorTheme.name}
                  >
                    {selectedColorTheme === colorTheme.name && (
                      <span className="text-white">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Color theme changes will be available in a future update.
              </p>
            </div>
          </div>
        </motion.section>
        
        {/* API Settings */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">API Connection</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">API Endpoint</h3>
              <p className="text-sm text-muted-foreground">
                Configure the backend API connection for ML predictions and data storage.
              </p>
              
              <div className="mt-2">
                <label htmlFor="apiEndpoint" className="text-sm font-medium block mb-1.5">
                  Backend URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                    placeholder="http://localhost:8080"
                  />
                  <button
                    onClick={() => setApiEndpoint("http://localhost:8080")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    title="Reset to default"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  The FastAPI endpoint for ML model predictions and data access
                </p>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-lg font-medium">Connection Status</h3>
              
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Connected to backend</span>
              </div>
              
              <button
                className="inline-flex items-center mt-2 px-4 py-2 text-sm font-medium rounded-md bg-background border border-border hover:bg-muted transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </button>
            </div>
          </div>
        </motion.section>
        
        {/* Data Settings */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold">Data Management</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Retention</h3>
              <p className="text-sm text-muted-foreground">
                Configure how long prediction history data is stored.
              </p>
              
              <div className="mt-2">
                <label htmlFor="retention" className="text-sm font-medium block mb-1.5">
                  Keep history for
                </label>
                <select
                  id="retention"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="px-4 py-2 rounded-md bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="0">Forever</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-lg font-medium">Clear Data</h3>
              <p className="text-sm text-muted-foreground">
                Delete prediction history and application data.
              </p>
              
              <div className="mt-2 space-y-3">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-background border border-border hover:bg-muted transition-colors">
                  Clear prediction history
                </button>
                <button className="block text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  Reset all application data
                </button>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Notifications Settings */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">Enable notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive notifications about predictions and model updates.
                </p>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled} 
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {notificationsEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-border pt-6 space-y-4"
              >
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model prediction alerts</span>
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System updates</span>
                    <input 
                      type="checkbox" 
                      defaultChecked={true} 
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New feature announcements</span>
                    <input 
                      type="checkbox" 
                      defaultChecked={false} 
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
        
        {/* Privacy Settings */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold">Privacy & Security</h2>
          </div>
          
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Analytics consent</h3>
                  <p className="text-sm text-muted-foreground mt-1">Allow anonymous usage data collection to improve the application</p>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <button className="text-sm text-primary hover:underline">
                  View Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Save Settings Button */}
        <motion.div 
          variants={item} 
          className="sticky bottom-6 flex justify-end pt-6 mt-10"
        >
          {savedSuccessfully && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mr-4 flex items-center text-green-600 dark:text-green-400"
            >
              <span className="text-sm font-medium">Settings saved successfully!</span>
              <button 
                onClick={() => setSavedSuccessfully(false)} 
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
          
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 font-medium rounded-xl text-white bg-primary hover:bg-primary/90 shadow-sm transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}