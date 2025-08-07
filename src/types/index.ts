export interface Product {
  id: string;
  name: string;
  category: 'shirt' | 'suit' | 'dress' | 'pants' | 'jacket';
  basePrice: number;
  image: string;
  description: string;
  fabrics: Fabric[];
}

export interface Fabric {
  id: string;
  name: string;
  type: string;
  priceMultiplier: number;
  image: string;
  description: string;
}

export interface CustomizationOptions {
  collar?: string;
  sleeve?: string;
  fit?: string;
  length?: string;
  buttons?: string;
  stitching?: string;
}

export interface Measurements {
  id?: string;
  nickname?: string;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  armLength: number;
  height: number;
  shoulder: number;
  userId?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  fabric: Fabric;
  customizations: CustomizationOptions;
  measurements: Measurements;
  designUpload?: string;
  totalPrice: number;
  status: 'confirmed' | 'in-stitching' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
}