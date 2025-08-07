import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createOrder, createOrderItem } from '../lib/supabase';
import { CustomerDetails } from '../types';
import toast from 'react-hot-toast';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(10, 'Please enter a complete address'),
});

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerDetails>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: user?.full_name || '',
      email: user?.email || '',
    }
  });

  // Mock order data - in real app, this would come from cart/customization state
  const mockOrderData = {
    productName: 'Custom Clothing Item',
    fabricName: 'Premium Fabric',
    totalAmount: 2499,
    customizations: {
      style: 'Custom Design',
      fit: 'Tailored Fit',
      finish: 'Premium'
    }
  };

  const onSubmit = async (customerData: CustomerDetails) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to place an order');
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate estimated delivery (7-14 business days)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 10);

      // Create order
      const order = await createOrder({
        total_amount: mockOrderData.totalAmount,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        shipping_address: customerData.address,
        estimated_delivery: estimatedDelivery.toISOString(),
        status: 'confirmed'
      });

      // In a real app, you would create order items based on cart contents
      // For demo purposes, we'll create a mock order item
      // Note: In production, this would use actual product, fabric, and measurement IDs
      // For demo purposes, we're skipping the order items creation
      // since we don't have valid foreign key references

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to checkout</h2>
          <p className="text-slate-600 mb-8">You need to be logged in to place an order.</p>
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
            Checkout
          </h1>
          <p className="text-xl text-slate-600">
            Complete your order with secure payment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Customer Details</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                    Shipping Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                    <textarea
                      id="address"
                      rows={4}
                      {...register('address')}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                      placeholder="Enter your complete shipping address"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* Payment Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                      In production, this would integrate with payment gateways like Stripe or Razorpay.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="radio" name="payment" value="card" defaultChecked className="mr-3" />
                      <CreditCard className="h-5 w-5 mr-2 text-slate-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="radio" name="payment" value="upi" className="mr-3" />
                      <span className="font-medium">UPI Payment</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input type="radio" name="payment" value="cod" className="mr-3" />
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-800 text-white py-4 rounded-lg font-semibold text-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </span>
                  ) : (
                    `Place Order - ₹${mockOrderData.totalAmount.toLocaleString()}`
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Product</span>
                  <span className="font-medium">{mockOrderData.productName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Fabric</span>
                  <span className="font-medium">{mockOrderData.fabricName}</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-slate-800 mb-2">Customizations:</h4>
                  {Object.entries(mockOrderData.customizations).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600 capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{mockOrderData.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    <strong>Estimated Delivery:</strong> 7-14 business days
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};