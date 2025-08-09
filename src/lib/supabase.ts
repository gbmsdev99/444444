import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using demo mode.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers with fallbacks
export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    // Demo mode - simulate successful login for admin
    if (email === 'admin@etailor.com' && password === 'admin123456') {
      return {
        user: {
          id: 'demo-admin-id',
          email: 'admin@etailor.com',
          user_metadata: { full_name: 'Admin User' }
        },
        session: { access_token: 'demo-token' }
      };
    }
    // Regular user demo
    return {
      user: {
        id: 'demo-user-id',
        email: email,
        user_metadata: { full_name: 'Demo User' }
      },
      session: { access_token: 'demo-token' }
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  if (!supabase) {
    // Demo mode
    return {
      user: {
        id: 'demo-new-user-id',
        email: email,
        user_metadata: { full_name: fullName }
      },
      session: { access_token: 'demo-token' }
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  
  if (error) throw error;
  
  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        role: 'customer'
      });
    
    if (profileError) console.warn('Profile creation failed:', profileError);
  }
  
  return data;
};

export const signOut = async () => {
  if (!supabase) {
    // Demo mode - just clear local state
    return;
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  if (!supabase) {
    // Demo mode - return null (not authenticated)
    return null;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentProfile = async () => {
  if (!supabase) {
    // Demo mode - return demo profile based on stored auth
    const demoUser = localStorage.getItem('demo-user');
    if (demoUser) {
      const user = JSON.parse(demoUser);
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Demo User',
        role: user.email === 'admin@etailor.com' ? 'admin' : 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: null,
        address: null
      };
    }
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      // If profile doesn't exist, create one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            role: user.email === 'admin@etailor.com' ? 'admin' : 'customer'
          })
          .select()
          .single();
          
        if (createError) throw createError;
        return newProfile;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in getCurrentProfile:', error);
    throw error;
  }
};

// Product functions with demo data
const demoProducts = [
  {
    id: '1',
    name: 'Classic Dress Shirt',
    category: 'shirt' as const,
    base_price: 1299,
    image_url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Premium cotton dress shirt with classic fit and professional styling.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Business Suit',
    category: 'suit' as const,
    base_price: 4999,
    image_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tailored business suit with modern cut and premium finish.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Evening Dress',
    category: 'dress' as const,
    base_price: 2999,
    image_url: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Elegant evening dress perfect for special occasions.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Formal Trousers',
    category: 'pants' as const,
    base_price: 1599,
    image_url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Perfectly tailored formal trousers for professional wear.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Blazer Jacket',
    category: 'jacket' as const,
    base_price: 3499,
    image_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Stylish blazer jacket for business and casual occasions.',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getProducts = async () => {
  if (!supabase) {
    // Demo mode - return demo products
    return demoProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');
    
  if (error) throw error;
  return data || demoProducts;
};

export const getProduct = async (id: string) => {
  if (!supabase) {
    // Demo mode
    return demoProducts.find(p => p.id === id) || null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
    
  if (error) {
    // Fallback to demo data
    return demoProducts.find(p => p.id === id) || null;
  }
  return data;
};

// Demo orders data
const demoOrders = [
  {
    id: 'demo-order-1',
    user_id: 'demo-user-id',
    order_number: 'ORD-2025001',
    status: 'confirmed' as const,
    total_amount: 2499,
    customer_name: 'Demo Customer',
    customer_email: 'demo@example.com',
    customer_phone: '+91 98765 43210',
    shipping_address: '123 Demo Street, Mumbai, India',
    notes: null,
    order_date: new Date().toISOString(),
    estimated_delivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    actual_delivery: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order_items: []
  }
];

// Orders functions
export const createOrder = async (orderData: any) => {
  if (!supabase) {
    // Demo mode
    const newOrder = {
      ...orderData,
      id: 'demo-order-' + Date.now(),
      order_number: 'ORD-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newOrder;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const orderNumber = `ORD-${Date.now()}`;
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      user_id: user.id,
      order_number: orderNumber,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getOrders = async (userId?: string) => {
  if (!supabase) {
    // Demo mode
    return demoOrders;
  }

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*),
        fabrics (*),
        measurements (*)
      )
    `)
    .order('created_at', { ascending: false });
    
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.warn('Orders fetch failed, using demo data:', error);
    return demoOrders;
  }
  return data || demoOrders;
};

// Measurements functions
export const getMeasurements = async (userId: string) => {
  if (!supabase) {
    // Demo mode
    return [];
  }

  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.warn('Measurements fetch failed:', error);
    return [];
  }
  return data || [];
};

export const createMeasurement = async (measurement: any) => {
  if (!supabase) {
    // Demo mode
    return { ...measurement, id: 'demo-measurement-' + Date.now() };
  }

  const { data, error } = await supabase
    .from('measurements')
    .insert(measurement)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateMeasurement = async (id: string, measurement: any) => {
  if (!supabase) {
    // Demo mode
    return { ...measurement, id };
  }

  const { data, error } = await supabase
    .from('measurements')
    .update(measurement)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteMeasurement = async (id: string) => {
  if (!supabase) {
    // Demo mode
    return;
  }

  const { error } = await supabase
    .from('measurements')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Admin functions with demo data
export const getAdminStats = async () => {
  if (!supabase) {
    // Demo mode
    return {
      totalOrders: 25,
      pendingOrders: 8,
      completedOrders: 17,
      totalCustomers: 150,
      totalRevenue: 125000,
      monthlyGrowth: 12.5
    };
  }

  try {
    const [ordersResult, customersResult, revenueResult] = await Promise.all([
      supabase.from('orders').select('id, status, total_amount'),
      supabase.from('profiles').select('id').eq('role', 'customer'),
      supabase.from('orders').select('total_amount').eq('status', 'delivered')
    ]);

    const orders = ordersResult.data || [];
    const customers = customersResult.data || [];
    const revenue = revenueResult.data || [];

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'confirmed' || o.status === 'in-stitching').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalCustomers: customers.length,
      totalRevenue: revenue.reduce((sum, order) => sum + (order.total_amount || 0), 0),
      monthlyGrowth: 12.5
    };
  } catch (error) {
    console.warn('Admin stats fetch failed, using demo data:', error);
    return {
      totalOrders: 25,
      pendingOrders: 8,
      completedOrders: 17,
      totalCustomers: 150,
      totalRevenue: 125000,
      monthlyGrowth: 12.5
    };
  }
};

export const getAllCustomers = async () => {
  if (!supabase) {
    // Demo mode
    return [
      {
        id: 'demo-customer-1',
        email: 'customer1@example.com',
        full_name: 'John Doe',
        role: 'customer',
        created_at: new Date().toISOString(),
        orders: [{ id: '1', total_amount: 2500 }]
      },
      {
        id: 'demo-customer-2',
        email: 'customer2@example.com',
        full_name: 'Jane Smith',
        role: 'customer',
        created_at: new Date().toISOString(),
        orders: [{ id: '2', total_amount: 3500 }]
      }
    ];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        orders (id, total_amount, created_at)
      `)
      .eq('role', 'customer')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.warn('Customers fetch failed, using demo data:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  if (!supabase) {
    // Demo mode
    return { id: orderId, status };
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'delivered' ? { actual_delivery: new Date().toISOString() } : {})
    })
    .eq('id', orderId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Real-time subscriptions (only if Supabase is available)
export const subscribeToOrders = (callback: (payload: any) => void) => {
  if (!supabase) {
    // Demo mode - no real-time updates
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('orders')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, 
      callback
    )
    .subscribe();
};

export const subscribeToOrderItems = (callback: (payload: any) => void) => {
  if (!supabase) {
    // Demo mode - no real-time updates
    return { unsubscribe: () => {} };
  }

  return supabase
    .channel('order_items')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'order_items' }, 
      callback
    )
    .subscribe();
};