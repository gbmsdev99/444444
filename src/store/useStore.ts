import { create } from 'zustand';
import { Measurements } from '../types';

interface Customization {
  productId?: string;
  fabric?: any;
  options?: Record<string, string>;
  measurements?: Measurements;
  designUpload?: string | null;
}

interface StoreState {
  currentCustomization: Customization;
  measurements: Measurements[];
  updateCustomization: (customization: Partial<Customization>) => void;
  setMeasurements: (measurements: Measurements[]) => void;
  addMeasurement: (measurement: Measurements) => void;
  clearCustomization: () => void;
}

export const useStore = create<StoreState>((set) => ({
  currentCustomization: {},
  measurements: [],
  
  updateCustomization: (customization) =>
    set((state) => ({
      currentCustomization: { ...state.currentCustomization, ...customization },
    })),
  
  setMeasurements: (measurements) =>
    set({ measurements }),
  
  addMeasurement: (measurement) =>
    set((state) => ({
      measurements: [...state.measurements, measurement],
    })),
  
  clearCustomization: () =>
    set({ currentCustomization: {} }),
}));