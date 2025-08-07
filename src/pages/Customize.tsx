import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Check, Ruler, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { products, customizationOptions } from '../data/mockData';
import { useStore } from '../store/useStore';
import { Measurements } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getMeasurements } from '../lib/supabase';
import toast from 'react-hot-toast';

const measurementSchema = z.object({
  neck: z.number().min(10).max(50),
  chest: z.number().min(50).max(200),
  waist: z.number().min(50).max(180),
  hips: z.number().min(60).max(200),
  armLength: z.number().min(40).max(100),
  height: z.number().min(100).max(220),
  shoulder: z.number().min(30).max(80),
});

export const Customize: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { currentCustomization, updateCustomization, measurements } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [customOptions, setCustomOptions] = useState<Record<string, string>>({});
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurements | null>(null);
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === productId);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<Measurements>({
    resolver: zodResolver(measurementSchema),
    defaultValues: selectedMeasurement || undefined
  });

  useEffect(() => {
    if (productId) {
      updateCustomization({ productId });
      loadUserMeasurements();
    }
  }, [productId, updateCustomization]);

  const loadUserMeasurements = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      setLoading(true);
      const data = await getMeasurements(user.id);
      // Update store with user measurements
      // For now, we'll use the mock measurements from the store
    } catch (error: any) {
      console.error('Error loading measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMeasurement) {
      Object.entries(selectedMeasurement).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'nickname' && key !== 'userId') {
          setValue(key as keyof Measurements, value as number);
        }
      });
    }
  }, [selectedMeasurement, setValue]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: 'Select Fabric', description: 'Choose your preferred material' },
    { id: 2, name: 'Customize Style', description: 'Select collar, sleeves, and fit' },
    { id: 3, name: 'Upload Design', description: 'Share your vision (optional)' },
    { id: 4, name: 'Measurements', description: 'Enter your body measurements' },
    { id: 5, name: 'Review & Order', description: 'Final review and payment' }
  ];

  const calculatePrice = () => {
    let price = product.basePrice;
    if (selectedFabric) {
      price *= selectedFabric.priceMultiplier;
    }
    return Math.round(price);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDesignFile(file);
    }
  };

  const onSubmitMeasurements = (data: Measurements) => {
    updateCustomization({ 
      measurements: data,
      fabric: selectedFabric,
      options: customOptions,
      designUpload: designFile ? URL.createObjectURL(designFile) : null
    });
    handleNext();
  };

  const handleFinalOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order');
      navigate('/login');
      return;
    }
    
    // Store the customization data for checkout
    updateCustomization({
      fabric: selectedFabric,
      options: customOptions,
      designUpload: designFile ? URL.createObjectURL(designFile) : null
    });
    
    navigate('/checkout');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 text-center">
              Select Your Fabric
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.fabrics.map((fabric) => (
                <motion.div
                  key={fabric.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedFabric(fabric)}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedFabric?.id === fabric.id
                      ? 'ring-4 ring-slate-500 shadow-xl'
                      : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <img
                    src={fabric.image}
                    alt={fabric.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-slate-800 mb-1">{fabric.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{fabric.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{fabric.type}</span>
                      <span className="text-lg font-bold text-slate-800">
                        ₹{Math.round(product.basePrice * fabric.priceMultiplier).toLocaleString()}
                      </span>
                    </div>
                    {selectedFabric?.id === fabric.id && (
                      <div className="mt-2 flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 text-center">
              Customize Your Style
            </h2>
            <div className="grid gap-8">
              {Object.entries(customizationOptions).map(([key, options]) => (
                <div key={key} className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setCustomOptions(prev => ({ ...prev, [key]: option }))}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          customOptions[key] === option
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 text-center">
              Upload Your Design
            </h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto">
              Have a specific design in mind? Upload an image or sketch to help our tailors understand your vision better.
            </p>
            
            <div className="max-w-md mx-auto">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </label>
              
              {designFile && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700">{designFile.name}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Skip This Step
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 text-center">
              Enter Your Measurements
            </h2>
            
            {/* Saved Measurements */}
            {measurements.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Use Saved Measurements</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {measurements.map((measurement) => (
                    <button
                      key={measurement.id}
                      onClick={() => setSelectedMeasurement(measurement)}
                      className={`p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedMeasurement?.id === measurement.id
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="font-medium">{measurement.nickname || 'Measurement Set'}</div>
                      <div className="text-sm opacity-75">
                        Chest: {measurement.chest}cm, Waist: {measurement.waist}cm
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitMeasurements)} className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <Ruler className="h-6 w-6 text-slate-600 mr-2" />
                  <h3 className="text-lg font-semibold text-slate-800">Body Measurements (in cm)</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Neck Circumference *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('neck', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 38.5"
                    />
                    {errors.neck && (
                      <p className="text-red-500 text-sm mt-1">{errors.neck.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Chest/Bust *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('chest', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 102.5"
                    />
                    {errors.chest && (
                      <p className="text-red-500 text-sm mt-1">{errors.chest.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Waist *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('waist', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 86.0"
                    />
                    {errors.waist && (
                      <p className="text-red-500 text-sm mt-1">{errors.waist.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Hips *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('hips', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 96.5"
                    />
                    {errors.hips && (
                      <p className="text-red-500 text-sm mt-1">{errors.hips.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Arm Length *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('armLength', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 63.5"
                    />
                    {errors.armLength && (
                      <p className="text-red-500 text-sm mt-1">{errors.armLength.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Height *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('height', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 175.5"
                    />
                    {errors.height && (
                      <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Shoulder Width *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('shoulder', { valueAsNumber: true })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., 45.5"
                    />
                    {errors.shoulder && (
                      <p className="text-red-500 text-sm mt-1">{errors.shoulder.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="submit"
                    className="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                  >
                    Save Measurements & Continue
                  </button>
                </div>
              </div>
            </form>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Measurement Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Measure over light clothing or undergarments</li>
                <li>• Keep the tape measure parallel to the ground</li>
                <li>• Take measurements in front of a mirror if possible</li>
                <li>• Ask someone to help you for more accurate measurements</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        const totalPrice = calculatePrice();
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 text-center">
              Review Your Order
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <h3 className="text-2xl font-semibold text-slate-800 mb-4">{product.name}</h3>
                  
                  {selectedFabric && (
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-700 mb-2">Selected Fabric:</h4>
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedFabric.image}
                          alt={selectedFabric.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{selectedFabric.name}</p>
                          <p className="text-sm text-slate-600">{selectedFabric.description}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {Object.keys(customOptions).length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-700 mb-2">Customizations:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(customOptions).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="capitalize font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentCustomization.measurements && (
                    <div className="mb-6">
                      <h4 className="font-medium text-slate-700 mb-2">Measurements (cm):</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Chest: {currentCustomization.measurements.chest}</div>
                        <div>Waist: {currentCustomization.measurements.waist}</div>
                        <div>Hips: {currentCustomization.measurements.hips}</div>
                        <div>Height: {currentCustomization.measurements.height}</div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between text-2xl font-bold text-slate-800">
                      <span>Total:</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Estimated delivery: 7-14 business days
                    </p>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handleFinalOrder}
                      className="w-full bg-slate-800 text-white py-4 rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/shop')}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Shop
        </motion.button>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="ml-4 hidden sm:block">
                  <h3 className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </h3>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-24 h-0.5 ml-8 ${
                    currentStep > step.id ? 'bg-slate-800' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !selectedFabric}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  (currentStep === 1 && !selectedFabric)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};