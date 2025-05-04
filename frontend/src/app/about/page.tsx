"use client"

import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { motion } from "framer-motion"
import { 
  Info, 
  Github, 
  Code, 
  Database, 
  RefreshCcw, 
  Server, 
  Cpu, 
  Braces, 
  BarChart4,
  BookOpen
} from "lucide-react"

export default function AboutPage() {
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

  const technologies = [
    {
      category: "Frontend",
      color: "blue",
      items: [
        { name: "Next.js 15", description: "React framework with server components" },
        { name: "React 19", description: "UI component library" },
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
        { name: "Framer Motion", description: "Animation library for React" },
      ]
    },
    {
      category: "Backend",
      color: "green",
      items: [
        { name: "FastAPI", description: "Modern Python web framework" },
        { name: "SQLite", description: "Lightweight database engine" },
        { name: "Pydantic", description: "Data validation and settings management" },
        { name: "Uvicorn", description: "ASGI server implementation" },
      ]
    },
    {
      category: "Machine Learning",
      color: "purple",
      items: [
        { name: "Scikit-learn", description: "Machine learning library" },
        { name: "Pandas", description: "Data manipulation and analysis" },
        { name: "NumPy", description: "Numerical computing" },
        { name: "Matplotlib", description: "Data visualization" },
      ]
    }
  ]


  return (
    <DashboardLayout 
      title="About" 
      subtitle="Details about the ApartmentRentPredictor"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-12"
      >
        {/* Project Description Section */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Project Overview</h2>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <p className="text-lg leading-relaxed mb-6">
              The ApartmentRentPredictor is a comprehensive solution for analyzing apartment rental properties 
              using machine learning algorithms. This platform helps predict apartment rent prices, identify 
              similar properties through clustering, and provides comparative analysis of different 
              machine learning models.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3">
                  <RefreshCcw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">ML Pipeline</h3>
                <p className="text-sm text-muted-foreground">
                  End-to-end machine learning workflow from data processing to model deployment
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-3">
                  <BarChart4 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Data Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive insights into apartment rental market trends and patterns
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                  <Cpu className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Model Comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Side-by-side evaluation of multiple classification algorithms
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold">Technologies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <div 
                key={tech.category} 
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden"
              >
                <div className={`p-4 border-b border-border bg-${tech.color}-50 dark:bg-${tech.color}-900/10`}>
                  <h3 className={`text-xl font-semibold text-${tech.color}-700 dark:text-${tech.color}-400`}>
                    {tech.category}
                  </h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {tech.items.map((item) => (
                      <li key={item.name} className="flex items-start">
                        <div className={`w-2 h-2 rounded-full bg-${tech.color}-500 mt-2 mr-3 flex-shrink-0`} />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Architecture Section */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">System Architecture</h2>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-4">Architecture Overview</h3>
                <p className="text-muted-foreground mb-4">
                  The ApartmentRentPredictor follows a modern microservices architecture with clear separation between 
                  frontend, backend API, and machine learning components.
                </p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                      <Braces className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Frontend Layer</h4>
                      <p className="text-sm text-muted-foreground">Next.js application with React components and Tailwind CSS</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                      <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Backend API</h4>
                      <p className="text-sm text-muted-foreground">FastAPI server with RESTful endpoints and data validation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-3">
                      <Database className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Layer</h4>
                      <p className="text-sm text-muted-foreground">SQLite database for storing predictions and user data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                      <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">ML Service</h4>
                      <p className="text-sm text-muted-foreground">Scikit-learn models for prediction and clustering tasks</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md bg-background/50 rounded-xl p-6 border border-border">
                  <div className="relative">
                    {/* Simple architecture diagram using divs and borders */}
                    <div className="border-2 border-blue-500 rounded-lg p-4 mb-4 bg-blue-50 dark:bg-blue-950/30">
                      <div className="text-center font-medium text-blue-700 dark:text-blue-400">Frontend (Next.js)</div>
                    </div>
                    <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500 to-green-500 mx-auto"></div>
                    <div className="border-2 border-green-500 rounded-lg p-4 mb-4 bg-green-50 dark:bg-green-950/30">
                      <div className="text-center font-medium text-green-700 dark:text-green-400">Backend API (FastAPI)</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="h-8 w-0.5 bg-gradient-to-b from-green-500 to-amber-500 mx-auto"></div>
                        <div className="border-2 border-amber-500 rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30">
                          <div className="text-center font-medium text-amber-700 dark:text-amber-400">Database (SQLite)</div>
                        </div>
                      </div>
                      <div>
                        <div className="h-8 w-0.5 bg-gradient-to-b from-green-500 to-purple-500 mx-auto"></div>
                        <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50 dark:bg-purple-950/30">
                          <div className="text-center font-medium text-purple-700 dark:text-purple-400">ML Models</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Documentation Section */}
        <motion.section variants={item} className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Documentation & Resources</h2>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <p className="mb-6">
              Explore these resources to learn more about the ApartmentRentPredictor and its implementation details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="https://github.com/muhammadsamiirshad/Apartment-Rent-Predictor" 
                className="flex items-center p-4 bg-background/50 rounded-lg border border-border transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <Github className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">GitHub Repository</h3>
                  <p className="text-sm text-muted-foreground">Source code and documentation</p>
                </div>
              </a>
              
              <a 
                href="https://github.com/muhammadsamiirshad/Apartment-Rent-Predictor" 
                className="flex items-center p-4 bg-background/50 rounded-lg border border-border transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">API Docs</h3>
                  <p className="text-sm text-muted-foreground">Backend API documentation</p>
                </div>
              </a>
              
              <a 
                href="https://archive.ics.uci.edu/dataset/555/apartment+for+rent+classified" 
                className="flex items-center p-4 bg-background/50 rounded-lg border border-border transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                  <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Dataset</h3>
                  <p className="text-sm text-muted-foreground">Information about the training data</p>
                </div>
              </a>
            </div>
          </div>
        </motion.section>
        
        {/* Version Info */}
        <motion.div 
          variants={item}
          className="mt-16 text-center text-sm text-muted-foreground"
        >
          <p>ApartmentRentPredictor v1.0.0</p>
          <p className="mt-1">© 2025 | Muhammad Sami</p>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}