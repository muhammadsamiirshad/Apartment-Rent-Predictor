"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Home, BarChart2, PieChart, History, TrendingUp, Building, Users, Award, Layers } from "lucide-react"
import { motion } from "framer-motion"

// Create analytics dashboard components
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
  description: string;
  color?: "blue" | "purple" | "green" | "amber";
}

const StatCard = ({ title, value, icon, trend, description, color = "blue" }: StatCardProps) => {
  const colorSchemes = {
    blue: {
      background: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/20 dark:to-blue-900/5",
      text: "text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/25"
    },
    purple: {
      background: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-500/20 dark:to-purple-900/5",
      text: "text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-500/10 dark:bg-purple-500/25"
    },
    green: {
      background: "bg-gradient-to-br from-green-500/10 to-green-600/5 dark:from-green-500/20 dark:to-green-900/5",
      text: "text-green-700 dark:text-green-300",
      iconBg: "bg-green-500/10 dark:bg-green-500/25"
    },
    amber: {
      background: "bg-gradient-to-br from-amber-500/10 to-amber-600/5 dark:from-amber-500/20 dark:to-amber-900/5",
      text: "text-amber-700 dark:text-amber-300",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/25"
    }
  }

  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${scheme.background} rounded-xl p-5 flex flex-col justify-between shadow-sm`}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${scheme.text}`}>{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${scheme.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium">
        <span className={`flex items-center ${trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} mr-2`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
        <span className="opacity-70">{description}</span>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  interface ModelMetric {
    algorithm: string;
    accuracy: number;
    precision: number;
    f1_score: number;
  }
  const [modelMetrics, setModelMetrics] = useState<ModelMetric[] | null>(null);
  const [counts, setCounts] = useState({
    predictions: 0,
    clusters: 0,
    bestModel: { name: '', accuracy: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch model metrics
        const metricsResponse = await fetch('http://localhost:8080/model-metrics/');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setModelMetrics(metricsData);
          
          // Find best model
          if (metricsData.length > 0) {
            interface ModelMetrics {
              algorithm: string;
              accuracy: number;
              precision: number;
              f1_score: number;
            }

            const best: ModelMetrics = metricsData.reduce((prev: ModelMetrics, current: ModelMetrics) => 
              (current.f1_score > prev.f1_score) ? current : prev
            );
            
            setCounts(prev => ({
              ...prev, 
              bestModel: { 
                name: best.algorithm, 
                accuracy: Math.round(best.accuracy * 100) 
              }
            }));
          }
        }
        
        // Fetch predictions count
        const predictionsResponse = await fetch('http://localhost:8080/predictions/');
        if (predictionsResponse.ok) {
          const predictionsData = await predictionsResponse.json();
          setCounts(prev => ({ ...prev, predictions: predictionsData.length }));
        }
        
        // Fetch clusters count
        const clusteringResponse = await fetch('http://localhost:8080/clustering/');
        if (clusteringResponse.ok) {
          const clusteringData = await clusteringResponse.json();
          setCounts(prev => ({ ...prev, clusters: clusteringData.length }));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      subtitle="Apartment rental market analysis and machine learning insights"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-8"
      >
        {/* Analytics Overview */}
        <div>
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Analytics Overview
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Prediction Accuracy" 
              value={`${counts.bestModel.accuracy || 0}%`}
              icon={<Award className="h-5 w-5" />}
              trend={3.2}
              description="vs previous model"
              color="blue"
            />
            
            <StatCard 
              title="Predictions Made" 
              value={counts.predictions}
              icon={<Layers className="h-5 w-5" />}
              trend={12.5}
              description="this month"
              color="purple"
            />
            
            <StatCard 
              title="Apartment Clusters" 
              value={counts.clusters || 0}
              icon={<Building className="h-5 w-5" />}
              trend={0}
              description="steady segmentation"
              color="green"
            />
            
            <StatCard 
              title="Best Model" 
              value={counts.bestModel.name || 'N/A'}
              icon={<Users className="h-5 w-5" />}
              trend={5.8}
              description="performance gain"
              color="amber"
            />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedCard 
              href="/predict" 
              icon={<Home size={24} />} 
              title="Apartment Prediction" 
              description="Input apartment details and get predictions" 
              color="blue"
            />
            
            <AnimatedCard 
              href="/models" 
              icon={<BarChart2 size={24} />} 
              title="Model Comparison" 
              description="Compare KNN, Naive Bayes, and Random Forest models" 
              color="purple"
            />
            
            <AnimatedCard 
              href="/clustering" 
              icon={<PieChart size={24} />} 
              title="Apartment Clustering" 
              description="K-Means clustering visualization" 
              color="green"
            />
            
            <AnimatedCard 
              href="/history" 
              icon={<History size={24} />} 
              title="Prediction History" 
              description="View past prediction results" 
              color="amber"
            />
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Project summary card */}
          <div className="bg-card/50 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">About This Project</h2>
            <p className="mb-4 text-muted-foreground">
              This application demonstrates a full-stack machine learning solution for apartment rental analysis.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">Frontend</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Next.js 15 with React 19
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Tailwind CSS for styling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Framer Motion animations
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-base font-medium">Backend & ML</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    FastAPI with SQLite database
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Machine learning models: KNN, NB, RF
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    K-Means for apartment clustering
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Model performance preview card */}
          <div className="bg-card/50 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Model Performance</h2>
              <a href="/models" className="text-sm text-primary hover:underline">View details →</a>
            </div>
            
            {loading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : modelMetrics ? (
              <div className="space-y-4">
                {modelMetrics.map((model, index) => (
                  <div key={model.algorithm} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{model.algorithm}</span>
                      <span>{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2.5">
                      <motion.div 
                        className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/70"
                        initial={{ width: "0%" }}
                        animate={{ width: `${model.accuracy * 100}%` }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precision: {(model.precision * 100).toFixed(1)}%</span>
                      <span>F1: {(model.f1_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No model metrics available
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
