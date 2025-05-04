"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { motion } from "framer-motion";
import { BarChart2, LineChart, PieChart, TrendingUp } from "lucide-react";

interface ModelMetrics {
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export default function ModelsPage() {
  const [metrics, setMetrics] = useState<ModelMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonImage, setComparisonImage] = useState<string | null>(null);
  const [featureImportanceImage, setFeatureImportanceImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelMetrics = async () => {
      try {
        const response = await fetch('http://localhost:8080/model-metrics/');
        if (!response.ok) {
          throw new Error('Failed to fetch model metrics');
        }
        const data = await response.json();
        setMetrics(data);
        
        // Fetch model comparison visualization
        const comparisonResponse = await fetch('http://localhost:8080/visualizations/model_comparison');
        if (comparisonResponse.ok) {
          const comparisonData = await comparisonResponse.json();
          setComparisonImage(comparisonData.data.image);
        }
        
        // Fetch feature importance visualization
        const importanceResponse = await fetch('http://localhost:8080/visualizations/feature_importance');
        if (importanceResponse.ok) {
          const importanceData = await importanceResponse.json();
          setFeatureImportanceImage(importanceData.data.image);
        }
      } catch (err) {
        setError('Error fetching model metrics. Please make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelMetrics();
  }, []);

  const getBestModel = () => {
    if (metrics.length === 0) return null;
    return metrics.reduce((best, current) => 
      current.f1_score > best.f1_score ? current : best
    );
  };

  const bestModel = getBestModel();
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <DashboardLayout
      title="Model Comparison"
      subtitle="Performance metrics and visualizations for different machine learning models"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="p-6 bg-red-50 border border-red-200 rounded-xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-red-700">
              <p>{error}</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              className="bg-card border border-border rounded-xl shadow-sm"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Evaluation Metrics</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Algorithm</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Accuracy</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Precision</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">Recall</th>
                        <th className="py-3 px-4 text-left font-medium text-muted-foreground">F1 Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((model, index) => (
                        <motion.tr 
                          key={model.algorithm}
                          className={`${index % 2 === 0 ? '' : 'bg-secondary/30'} ${
                            bestModel && model.algorithm === bestModel.algorithm ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <td className="py-3 px-4 border-b border-border">
                            <div className="flex items-center">
                              {model.algorithm}
                              {bestModel && model.algorithm === bestModel.algorithm && (
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                                  Best Model
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 border-b border-border">{(model.accuracy * 100).toFixed(2)}%</td>
                          <td className="py-3 px-4 border-b border-border">{(model.precision * 100).toFixed(2)}%</td>
                          <td className="py-3 px-4 border-b border-border">{(model.recall * 100).toFixed(2)}%</td>
                          <td className="py-3 px-4 border-b border-border">{(model.f1_score * 100).toFixed(2)}%</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {comparisonImage && (
              <motion.div 
                className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Models Performance Comparison</h2>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <Image 
                      src={`data:image/png;base64,${comparisonImage}`} 
                      alt="Model Comparison Visualization" 
                      className="mx-auto"
                      width={800}
                      height={600}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {featureImportanceImage && (
              <motion.div 
                className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Feature Importance</h2>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <Image 
                      src={`data:image/png;base64,${featureImportanceImage}`} 
                      alt="Feature Importance Visualization" 
                      className="mx-auto"
                      width={800}
                      height={600}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {bestModel && (
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-900/30"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                    Model Recommendation
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Based on the evaluation metrics, the <span className="font-semibold">{bestModel.algorithm}</span> model 
                  performs best with an F1 score of {(bestModel.f1_score * 100).toFixed(2)}%.
                </p>
                <p className="mt-3 text-gray-700 dark:text-gray-300">
                  This model balances precision ({(bestModel.precision * 100).toFixed(2)}%) and 
                  recall ({(bestModel.recall * 100).toFixed(2)}%) well, making it optimal for apartment rental classification.
                  The F1 score is used as the main metric because it provides a balance between precision and recall.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}