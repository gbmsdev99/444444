import { create } from 'zustand';
import { User, Order, Measurements, Product } from '../types';

interface AppState {
  user: User | null;
  orders: Order[];
  measurements: Measurements[];
  products: Product[];
  currentCustomization: {
    productId: string | null;
    fabric: any | null;
    options: any;
    measurements: Measurements | null;
    designUpload: string | null;
  };
  setUser: (user: User | null) => void;
  setOrders: (orders: Order[]) => void;
  setMeasurements: (measurements: Measurements[]) => void;
  setProducts: (products: Product[]) => void;
  updateCustomization: (update: Partial<AppState['currentCustomization']>) => void;
  resetCustomization: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  orders: [],
  measurements: [],
  products: [],
  currentCustomization: {
    productId: null,
    fabric: null,
    options: {},
    measurements: null,
    designUpload: null,
  },
  setUser: (user) => set({ user }),
  setOrders: (orders) => set({ orders }),
  setMeasurements: (measurements) => set({ measurements }),
  setProducts: (products) => set({ products }),
  updateCustomization: (update) =>
    set((state) => ({
      currentCustomization: { ...state.currentCustomization, ...update },
    })),
  resetCustomization: () =>
    set({
      currentCustomization: {
        productId: null,
        fabric: null,
        options: {},
        measurements: null,
        designUpload: null,
      },
    }),
}));