"use client";

import { useState, FormEvent } from 'react';
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { motion } from "framer-motion";
import { 
  Building, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ChevronDown,
  Home,
  Ruler,
  Bath,
  Car,
  Sofa,
  ArrowUpDown,
  Wind,
  Layers,
  Calendar,
  MapPin
} from "lucide-react";

interface ApartmentFeatures {
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
}

interface PredictionResult {
  prediction: number;
  probability: { [key: string]: number };
}

// Default data for form
const defaultApartment: ApartmentFeatures = {
  price: 1000,
  size: 80,
  rooms: 2,
  bathroom: 1,
  parking: 1,
  furnished: 1,
  elevator: 1,
  balcony: 1,
  floor: 2,
  age: 5,
  location_score: 7
};

// Apartment category labels
const categoryLabels = ['Budget', 'Standard', 'Premium'];

export default function PredictPage() {
  const [apartment, setApartment] = useState<ApartmentFeatures>(defaultApartment);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelType, setModelType] = useState<string>("random_forest");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    
    setApartment((prev) => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/predict/?model_name=${modelType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apartment),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error making prediction. Please make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getModelIcon = (model: string) => {
    switch(model) {
      case "random_forest": return <Layers className="h-5 w-5" />;
      case "knn": return <Building className="h-5 w-5" />;
      case "naive_bayes": return <ChevronDown className="h-5 w-5" />;
      default: return <Layers className="h-5 w-5" />;
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch(feature) {
      case "price": return <span className="text-emerald-500">$</span>;
      case "size": return <Ruler className="h-4 w-4 text-sky-500" />;
      case "rooms": return <Home className="h-4 w-4 text-indigo-500" />;
      case "bathroom": return <Bath className="h-4 w-4 text-cyan-500" />;
      case "parking": return <Car className="h-4 w-4 text-violet-500" />;
      case "furnished": return <Sofa className="h-4 w-4 text-amber-500" />;
      case "elevator": return <ArrowUpDown className="h-4 w-4 text-rose-500" />;
      case "balcony": return <Wind className="h-4 w-4 text-blue-500" />;
      case "floor": return <Layers className="h-4 w-4 text-orange-500" />;
      case "age": return <Calendar className="h-4 w-4 text-red-500" />;
      case "location_score": return <MapPin className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout
      title="Apartment Prediction"
      subtitle="Enter apartment details to get classification predictions"
    >
      <div className="grid gap-6 md:grid-cols-5">
        {/* Left column - input form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-3 space-y-6"
        >
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-medium flex items-center">
                <Building className="inline-block mr-2 text-primary" />
                Apartment Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fill in apartment characteristics to get a classification prediction
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  className="bg-card p-5 rounded-lg border border-border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-base font-medium mb-3 flex items-center">
                    <span className="bg-primary/10 p-1 rounded-md mr-2">
                      {getModelIcon(modelType)}
                    </span>
                    Select Prediction Model
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`flex items-center justify-between p-3 border ${modelType === "random_forest" ? 'border-primary/50 bg-primary/5' : 'border-border'} rounded-lg hover:bg-muted/40 cursor-pointer transition-all duration-200`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="model"
                          value="random_forest"
                          checked={modelType === "random_forest"}
                          onChange={() => setModelType("random_forest")}
                          className="form-radio h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-2 text-sm">Random Forest</span>
                      </div>
                      <Layers className={`h-4 w-4 ${modelType === "random_forest" ? 'text-primary' : 'text-muted-foreground'}`} />
                    </label>
                    
                    <label className={`flex items-center justify-between p-3 border ${modelType === "knn" ? 'border-primary/50 bg-primary/5' : 'border-border'} rounded-lg hover:bg-muted/40 cursor-pointer transition-all duration-200`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="model"
                          value="knn"
                          checked={modelType === "knn"}
                          onChange={() => setModelType("knn")}
                          className="form-radio h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-2 text-sm">KNN</span>
                      </div>
                      <Building className={`h-4 w-4 ${modelType === "knn" ? 'text-primary' : 'text-muted-foreground'}`} />
                    </label>
                    
                    <label className={`flex items-center justify-between p-3 border ${modelType === "naive_bayes" ? 'border-primary/50 bg-primary/5' : 'border-border'} rounded-lg hover:bg-muted/40 cursor-pointer transition-all duration-200`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="model"
                          value="naive_bayes"
                          checked={modelType === "naive_bayes"}
                          onChange={() => setModelType("naive_bayes")}
                          className="form-radio h-4 w-4 text-primary accent-primary"
                        />
                        <span className="ml-2 text-sm">Naive Bayes</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 ${modelType === "naive_bayes" ? 'text-primary' : 'text-muted-foreground'}`} />
                    </label>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="price" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("price")}
                      <span className="ml-2">Price ($)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={apartment.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      min="0"
                      step="100"
                      required
                    />
                    <span className="absolute left-3 bottom-2.5 text-muted-foreground">$</span>
                  </div>

                  <div>
                    <label htmlFor="size" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("size")}
                      <span className="ml-2">Size (m²)</span>
                    </label>
                    <input
                      type="number"
                      name="size"
                      id="size"
                      value={apartment.size}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      min="10"
                      step="5"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="rooms" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("rooms")}
                      <span className="ml-2">Rooms</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="rooms"
                        id="rooms"
                        value={apartment.rooms}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                        min="1"
                        max="10"
                        step="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bathroom" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("bathroom")}
                      <span className="ml-2">Bathrooms</span>
                    </label>
                    <input
                      type="number"
                      name="bathroom"
                      id="bathroom"
                      value={apartment.bathroom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      min="0"
                      max="5"
                      step="1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="parking" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("parking")}
                      <span className="ml-2">Parking Available</span>
                    </label>
                    <select
                      name="parking"
                      id="parking"
                      value={apartment.parking}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      required
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="furnished" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("furnished")}
                      <span className="ml-2">Furnished</span>
                    </label>
                    <select
                      name="furnished"
                      id="furnished"
                      value={apartment.furnished}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      required
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="elevator" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("elevator")}
                      <span className="ml-2">Elevator</span>
                    </label>
                    <select
                      name="elevator"
                      id="elevator"
                      value={apartment.elevator}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      required
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="balcony" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("balcony")}
                      <span className="ml-2">Balcony</span>
                    </label>
                    <select
                      name="balcony"
                      id="balcony"
                      value={apartment.balcony}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      required
                    >
                      <option value={1}>Yes</option>
                      <option value={0}>No</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="floor" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("floor")}
                      <span className="ml-2">Floor</span>
                    </label>
                    <input
                      type="number"
                      name="floor"
                      id="floor"
                      value={apartment.floor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      min="0"
                      max="50"
                      step="1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("age")}
                      <span className="ml-2">Building Age (years)</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      value={apartment.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                      min="0"
                      max="100"
                      step="1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="location_score" className="flex items-center text-sm font-medium mb-1">
                      {getFeatureIcon("location_score")}
                      <span className="ml-2">Location Score (1-10)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        name="location_score"
                        id="location_score"
                        value={apartment.location_score}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        min="1"
                        max="10"
                        step="1"
                        required
                      />
                      <div className="flex justify-between text-xs text-gray-600 px-2 mt-1">
                        <span>Poor</span>
                        <span className="font-medium">{apartment.location_score}</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Prediction
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Right column - results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="sticky top-24">
            {!result && !error && (
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col items-center justify-center h-96">
                <div className="bg-muted/30 p-4 rounded-full mb-4">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-center">Apartment Prediction</h3>
                <p className="text-muted-foreground text-center">
                  Fill in the apartment details and click &quot;Get Prediction&quot; to see the classification result.
                </p>
              </div>
            )}

            {error && (
              <motion.div 
                className="bg-card border border-border border-l-4 border-l-red-500 rounded-xl shadow-sm p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-medium">Error</h3>
                </div>
                <p className="text-muted-foreground">{error}</p>
                <button 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            {result && !error && (
              <motion.div 
                className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="ml-3 text-lg font-medium text-blue-800">Prediction Result</h2>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {modelType === 'random_forest' ? 'Random Forest' : modelType === 'knn' ? 'KNN' : 'Naive Bayes'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-muted-foreground text-sm">Apartment Category:</p>
                    <div className="flex items-center mt-1">
                      {result.prediction === 0 ? (
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      ) : result.prediction === 1 ? (
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                      )}
                      <p className="text-2xl font-bold">
                        {categoryLabels[result.prediction]}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Probability Distribution:</p>
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(result.probability).map(([category, prob]) => {
                        const catIndex = parseInt(category);
                        return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <div className="flex items-center">
                              {catIndex === 0 ? (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                              ) : catIndex === 1 ? (
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                              )}
                              <span className="font-medium">{categoryLabels[catIndex]}</span>
                            </div>
                            <span className={`font-semibold ${catIndex === result.prediction ? 'text-primary' : 'text-muted-foreground'}`}>
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                            {catIndex === 0 ? (
                              <motion.div
                                className="bg-blue-500 h-2.5 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              ></motion.div>
                            ) : catIndex === 1 ? (
                              <motion.div
                                className="bg-green-500 h-2.5 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              ></motion.div>
                            ) : (
                              <motion.div
                                className="bg-amber-500 h-2.5 rounded-full"
                                initial={{ width: '0%' }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              ></motion.div>
                            )}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Interpretation</p>
                    <p className="text-sm">
                      {result.prediction === 0 ? (
                        <>This apartment is classified as <span className="font-semibold text-blue-600">Budget</span>, indicating an affordable option with basic amenities.</>
                      ) : result.prediction === 1 ? (
                        <>This apartment is classified as <span className="font-semibold text-green-600">Standard</span>, offering a good balance between cost and quality.</>
                      ) : (
                        <>This apartment is classified as <span className="font-semibold text-amber-600">Premium</span>, representing a high-end option with superior features and location.</>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}