'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { 
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function DiseaseDetectionPage() {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock result
      setResult({
        disease: 'Leaf Blight',
        confidence: 92,
        severity: 'Moderate',
        description: 'Leaf blight is a fungal disease that affects the leaves of plants, causing brown spots and eventual leaf death.',
        symptoms: [
          'Brown or yellow spots on leaves',
          'Wilting or drooping leaves',
          'Premature leaf drop'
        ],
        treatment: [
          'Remove and destroy infected leaves',
          'Apply fungicide spray',
          'Improve air circulation',
          'Avoid overhead watering'
        ],
        prevention: [
          'Use disease-resistant varieties',
          'Practice crop rotation',
          'Maintain proper spacing',
          'Keep foliage dry'
        ]
      });

      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Disease Detection"
          description="Upload a plant image to identify diseases and get treatment recommendations"
          icon="🔬"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Plant Image</h2>

            {!selectedImage ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-3xl p-12 text-center transition-all ${
                  dragActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <CloudArrowUpIcon className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <p className="text-sm text-gray-400">
                  Supports: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-4 border-green-200">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full h-auto"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {!result && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzeImage}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <PhotoIcon className="w-5 h-5" />
                        <span>Analyze Image</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

            {loading ? (
              <LoadingSpinner message="Analyzing image..." />
            ) : result ? (
              <div className="space-y-6">
                {/* Disease Info */}
                <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">{result.disease}</h3>
                    <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full">
                      {result.confidence}% Confidence
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-700 font-semibold">Severity: {result.severity}</span>
                  </div>
                  <p className="text-gray-700">{result.description}</p>
                </div>

                {/* Symptoms */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Symptoms</h4>
                  <div className="space-y-2">
                    {result.symptoms.map((symptom: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                        <span className="text-gray-700">{symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Treatment</h4>
                  <div className="space-y-2">
                    {result.treatment.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Prevention</h4>
                  <div className="space-y-2">
                    {result.prevention.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔬</div>
                <p className="text-gray-600">
                  Upload an image to detect plant diseases
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
