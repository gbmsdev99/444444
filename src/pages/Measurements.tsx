import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Measurements as MeasurementsType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getMeasurements, createMeasurement, updateMeasurement, deleteMeasurement } from '../lib/supabase';
import toast from 'react-hot-toast';

const measurementSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  neck: z.number().min(10).max(50),
  chest: z.number().min(50).max(200),
  waist: z.number().min(50).max(180),
  hips: z.number().min(60).max(200),
  arm_length: z.number().min(40).max(100),
  height: z.number().min(100).max(220),
  shoulder: z.number().min(30).max(80),
});

export const Measurements: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [measurements, setMeasurements] = useState<MeasurementsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<MeasurementsType>({
    resolver: zodResolver(measurementSchema)
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const loadData = async () => {
        try {
          await loadMeasurements();
        } catch (error) {
          console.error('Failed to load measurements:', error);
          setLoading(false);
        }
      };
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadMeasurements = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getMeasurements(user.id);
      setMeasurements(data || []);
    } catch (error: any) {
      toast.error('Failed to load measurements');
      console.error('Error loading measurements:', error);
      // Set empty array on error
      setMeasurements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    reset();
  };

  const handleEdit = (measurement: MeasurementsType) => {
    setEditingId(measurement.id || null);
    Object.entries(measurement).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
        setValue(key as keyof MeasurementsType, value);
      }
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    reset();
  };

  const onSubmit = async (data: MeasurementsType) => {
    if (!user) return;

    try {
      if (editingId) {
        // Update existing measurement
        await updateMeasurement(editingId, data);
        toast.success('Measurement updated successfully');
      } else {
        // Add new measurement
        await createMeasurement({ ...data, user_id: user.id });
        toast.success('Measurement saved successfully');
      }
      
      await loadMeasurements();
      handleCancel();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save measurement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this measurement set?')) return;

    try {
      await deleteMeasurement(id);
      toast.success('Measurement deleted successfully');
      await loadMeasurements();
    } catch (error: any) {
      toast.error('Failed to delete measurement');
    }
  };

  const measurementGuide = [
    { name: 'Neck', description: 'Measure around the base of your neck', tip: 'Keep one finger between tape and neck' },
    { name: 'Chest/Bust', description: 'Measure around the fullest part of your chest', tip: 'Keep arms at your sides, tape parallel to floor' },
    { name: 'Waist', description: 'Measure around your natural waistline', tip: 'Usually the narrowest part of your torso' },
    { name: 'Hips', description: 'Measure around the fullest part of your hips', tip: 'Stand with feet together' },
    { name: 'Arm Length', description: 'Measure from shoulder point to wrist', tip: 'Keep arm slightly bent' },
    { name: 'Height', description: 'Measure from head to floor without shoes', tip: 'Stand against a wall for accuracy' },
    { name: 'Shoulder Width', description: 'Measure from shoulder point to shoulder point', tip: 'Across the back, at the widest point' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in</h2>
          <p className="text-slate-600 mb-8">You need to be logged in to manage your measurements.</p>
          <a
            href="/login"
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your measurements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">
            My Measurements
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Save multiple measurement profiles for different fits and occasions. 
            Use these for quick ordering without re-entering measurements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Measurement Sets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <button
                onClick={handleAdd}
                className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-slate-400 hover:text-slate-700 transition-colors"
              >
                <Plus className="h-8 w-8 mx-auto mb-2" />
                <span className="text-lg font-medium">Add New Measurement Set</span>
              </button>
            </motion.div>

            {/* Add/Edit Form */}
            {(isAddingNew || editingId) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-800">
                    {editingId ? 'Edit Measurements' : 'Add New Measurements'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nickname for this set *
                    </label>
                    <input
                      type="text"
                      {...register('nickname')}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="e.g., Formal Wear, Wedding Suit, Casual"
                    />
                    {errors.nickname && (
                      <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Neck (cm) *
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
                        Chest/Bust (cm) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('chest', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="e.g., 102.0"
                      />
                      {errors.chest && (
                        <p className="text-red-500 text-sm mt-1">{errors.chest.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Waist (cm) *
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
                        Hips (cm) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('hips', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="e.g., 96.0"
                      />
                      {errors.hips && (
                        <p className="text-red-500 text-sm mt-1">{errors.hips.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Arm Length (cm) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('arm_length', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="e.g., 63.5"
                      />
                      {errors.arm_length && (
                        <p className="text-red-500 text-sm mt-1">{errors.arm_length.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Height (cm) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        {...register('height', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="e.g., 175.0"
                      />
                      {errors.height && (
                        <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Shoulder Width (cm) *
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

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Measurements
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Existing Measurement Sets */}
            {measurements.map((measurement, index) => (
              <motion.div
                key={measurement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-800">{measurement.nickname}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(measurement)}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(measurement.id!)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Neck</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.neck} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Chest</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.chest} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Waist</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.waist} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Hips</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.hips} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Arm</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.arm_length} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Height</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.height} cm</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600">Shoulder</p>
                    <p className="text-lg font-semibold text-slate-800">{measurement.shoulder} cm</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {measurements.length === 0 && !isAddingNew && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Ruler className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">No measurements saved</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Save your measurements to make future orders faster and more convenient.
                </p>
                <button
                  onClick={handleAdd}
                  className="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                >
                  Add Your First Measurement
                </button>
              </motion.div>
            )}
          </div>

          {/* Measurement Guide */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                Measurement Guide
              </h3>

              <div className="space-y-4">
                {measurementGuide.map((guide, index) => (
                  <div key={guide.name} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <h4 className="font-medium text-slate-800 mb-1">{guide.name}</h4>
                    <p className="text-sm text-slate-600 mb-1">{guide.description}</p>
                    <p className="text-xs text-slate-500 italic">💡 {guide.tip}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📏 Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Measure over light clothing</li>
                  <li>• Keep the tape measure snug but not tight</li>
                  <li>• Take measurements at the same time of day</li>
                  <li>• Ask someone to help for better accuracy</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};