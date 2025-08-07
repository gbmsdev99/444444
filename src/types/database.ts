export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: 'shirt' | 'suit' | 'dress' | 'pants' | 'jacket';
          base_price: number;
          image_url: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'shirt' | 'suit' | 'dress' | 'pants' | 'jacket';
          base_price: number;
          image_url: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'shirt' | 'suit' | 'dress' | 'pants' | 'jacket';
          base_price?: number;
          image_url?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      fabrics: {
        Row: {
          id: string;
          name: string;
          type: string;
          price_multiplier: number;
          image_url: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          price_multiplier?: number;
          image_url: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          price_multiplier?: number;
          image_url?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      product_fabrics: {
        Row: {
          id: string;
          product_id: string;
          fabric_id: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          fabric_id: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          fabric_id?: string;
        };
      };
      measurements: {
        Row: {
          id: string;
          user_id: string;
          nickname: string;
          neck: number;
          chest: number;
          waist: number;
          hips: number;
          arm_length: number;
          height: number;
          shoulder: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
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
        };
        Update: {
          id?: string;
          user_id?: string;
          nickname?: string;
          neck?: number;
          chest?: number;
          waist?: number;
          hips?: number;
          arm_length?: number;
          height?: number;
          shoulder?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: 'confirmed' | 'in-stitching' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          notes?: string | null;
          order_date?: string;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: 'confirmed' | 'in-stitching' | 'shipped' | 'delivered' | 'cancelled';
          total_amount?: number;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          notes?: string | null;
          order_date?: string;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          fabric_id: string;
          measurement_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          customizations: any;
          design_upload_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          fabric_id: string;
          measurement_id: string;
          quantity?: number;
          unit_price: number;
          total_price: number;
          customizations?: any;
          design_upload_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          fabric_id?: string;
          measurement_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          customizations?: any;
          design_upload_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}