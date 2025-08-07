export interface Product {
  id: string;
  name: string;
  category: 'shirt' | 'suit' | 'dress' | 'pants' | 'jacket';
  base_price: number;
  image_url: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_fabrics?: {
    fabric_id: string;
    fabrics: Fabric;
  }[];
}

export interface Fabric {
  id: string;
  name: string;
  type: string;
  price_multiplier: number;
  image_url: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
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
  user_id?: string;
  nickname: string;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  arm_length: number;
  height: number;
  shoulder: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'confirmed' | 'in-stitching' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string | null;
  order_date: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  fabric_id: string;
  measurement_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations: CustomizationOptions;
  design_upload_url: string | null;
  created_at: string;
  products?: Product;
  fabrics?: Fabric;
  measurements?: Measurements;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}