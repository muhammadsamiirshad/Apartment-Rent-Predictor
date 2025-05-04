"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { motion } from "framer-motion";
import { PieChart, CircleDot, Info } from "lucide-react";

interface ClusteringResult {
  cluster_id: number;
  data_points: Array<{[key: string]: number}>;
  centroid: {[key: string]: number};
}

export default function ClusteringPage() {
  const [clusteringResults, setClusteringResults] = useState<ClusteringResult[]>([]);
  const [clusteringImage, setClusteringImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClusteringResults = async () => {
      try {
        // Fetch clustering results
        const response = await fetch('http://localhost:8080/clustering/');
        if (!response.ok) {
          throw new Error('Failed to fetch clustering results');
        }
        const data = await response.json();
        setClusteringResults(data);
        
        // Fetch clustering visualization
        const visResponse = await fetch('http://localhost:8080/visualizations/clustering');
        if (visResponse.ok) {
          const visData = await visResponse.json();
          setClusteringImage(visData.data.image);
        }
      } catch (err) {
        setError('Error fetching clustering results. Please make sure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClusteringResults();
  }, []);

  const getRandomColor = (clusterId: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return colors[clusterId % colors.length];
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout
      title="Apartment Clustering"
      subtitle="K-Means clustering analysis of apartment listings"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="p-6 bg-red-50 border border-red-200 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-red-700">
              <p>{error}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
              variants={item}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Clustering Visualization</h2>
                </div>
                {clusteringImage ? (
                  <div className="bg-secondary/30 p-6 rounded-lg">
                    <Image 
                      src={`data:image/png;base64,${clusteringImage}`} 
                      alt="K-Means Clustering Visualization" 
                      className="mx-auto rounded-md"
                      width={700}
                      height={500}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Visualization not available</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="mb-4 flex items-center gap-2">
                <CircleDot className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Cluster Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusteringResults.map((cluster, index) => (
                  <motion.div 
                    key={cluster.cluster_id}
                    className="bg-card p-5 rounded-xl border border-border shadow-sm"
                    style={{ 
                      borderLeftWidth: '4px', 
                      borderLeftColor: getRandomColor(cluster.cluster_id) 
                    }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <h3 className="text-lg font-medium mb-3">
                      Cluster {cluster.cluster_id}
                    </h3>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Centroid</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {Object.entries(cluster.centroid).slice(0, 6).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-muted-foreground">{key.replace('feature_', 'F')}:</span>{' '}
                            <span className="font-medium">{value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Data Points: {cluster.data_points.length}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        This cluster contains {cluster.data_points.length} apartment listings with similar characteristics.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-900/30"
              variants={item}
            >
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                  Clustering Analysis
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                K-Means clustering has grouped together similar apartment listings based on their features.
                Each cluster represents a distinct segment of the apartment market with similar characteristics.
              </p>
              <p className="mt-3 text-gray-700 dark:text-gray-300">
                These clusters can be used to better understand the apartment rental market segments,
                identify target demographics, and optimize pricing strategies for different types of apartments.
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}