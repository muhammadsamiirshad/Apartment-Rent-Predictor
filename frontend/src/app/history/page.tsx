"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { motion } from "framer-motion";
import { ClipboardList, Clock, Database, ArrowRight } from "lucide-react";

interface PredictionRecord {
  id: number;
  price: number;
  size: number;
  rooms: number;
  bathroom: number;
  parking: number;
  furnished: number;
  elevator: number;
  balcony: number;
  floor: number;
  age: number;
  location_score: number;
  prediction_result: number;
  model_used: string;
  timestamp: string;
}

// Apartment category labels
const categoryLabels = ['Budget', 'Standard', 'Premium'];

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictionHistory = async () => {
      try {
        const response = await fetch('http://localhost:8080/predictions/');
        if (!response.ok) {
          throw new Error('Failed to fetch prediction history');
        }
        const data = await response.json();
        setPredictions(data);
      } catch (err) {
        setError('Error fetching prediction history. Please make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictionHistory();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getModelBadgeColor = (model: string) => {
    switch (model) {
      case 'random_forest': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'knn': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'naive_bayes': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getModelDisplayName = (model: string) => {
    switch (model) {
      case 'random_forest': return 'Random Forest';
      case 'knn': return 'KNN';
      case 'naive_bayes': return 'Naive Bayes';
      default: return model;
    }
  };

  return (
    <DashboardLayout
      title="Prediction History"
      subtitle="Review past apartment classification predictions"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-red-700 dark:text-red-400">
              <p>{error}</p>
            </div>
          </motion.div>
        ) : predictions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Database className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No prediction history</h3>
            <p className="text-muted-foreground mb-6">Make some predictions to see them here</p>
            <Link href="/predict">
              <motion.button
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-medium text-sm shadow-sm hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Make a Prediction
                <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Recent Predictions</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {predictions.length} {predictions.length === 1 ? 'prediction' : 'predictions'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Size (m²)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Rooms
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Prediction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((prediction, index) => (
                      <motion.tr 
                        key={prediction.id}
                        className={index % 2 === 0 ? '' : 'bg-secondary/30'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {prediction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {formatDateTime(prediction.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModelBadgeColor(prediction.model_used)}`}>
                            {getModelDisplayName(prediction.model_used)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          ${prediction.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {prediction.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {prediction.rooms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 text-xs font-medium rounded-md ${
                              prediction.prediction_result === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                              prediction.prediction_result === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                              'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {categoryLabels[prediction.prediction_result]}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-900/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">
                  Prediction Analysis
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                The table above shows the history of apartment predictions made using different machine learning models.
                Each row represents a past prediction with the apartment features used for prediction and the resulting classification.
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                This history can be used to track prediction patterns over time and evaluate the consistency of different models.
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}