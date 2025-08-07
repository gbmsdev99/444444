import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, fullName: string) => {
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
    
    if (profileError) throw profileError;
  }
  
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentProfile = async () => {
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
            role: 'customer'
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

// Real-time subscriptions
export const subscribeToOrders = (callback: (payload: any) => void) => {
  return supabase
    .channel('orders')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'orders' }, 
      callback
    )
    .subscribe();
};

export const subscribeToOrderItems = (callback: (payload: any) => void) => {
  return supabase
    .channel('order_items')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'order_items' }, 
      callback
    )
    .subscribe();
};

// Product functions
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name');
    
  if (error) throw error;
  return data;
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();
    
  if (error) throw error;
  return data;
};

// Measurements functions
export const getMeasurements = async (userId: string) => {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const createMeasurement = async (measurement: any) => {
  const { data, error } = await supabase
    .from('measurements')
    .insert(measurement)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateMeasurement = async (id: string, measurement: any) => {
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
  const { error } = await supabase
    .from('measurements')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Orders functions
export const createOrder = async (orderData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Generate order number
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

export const createOrderItem = async (orderItem: any) => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItem)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const getOrders = async (userId?: string) => {
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
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
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

// Admin functions
export const getAdminStats = async () => {
  const [ordersResult, customersResult, revenueResult] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount'),
    supabase.from('profiles').select('id').eq('role', 'customer'),
    supabase.from('orders').select('total_amount').eq('status', 'delivered')
  ]);

  if (ordersResult.error) throw ordersResult.error;
  if (customersResult.error) throw customersResult.error;
  if (revenueResult.error) throw revenueResult.error;

  const orders = ordersResult.data || [];
  const customers = customersResult.data || [];
  const revenue = revenueResult.data || [];

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'confirmed' || o.status === 'in-stitching').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    totalCustomers: customers.length,
    totalRevenue: revenue.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    monthlyGrowth: 12.5 // This would be calculated based on historical data
  };
};

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      orders (id, total_amount, created_at)
    `)
    .eq('role', 'customer')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};