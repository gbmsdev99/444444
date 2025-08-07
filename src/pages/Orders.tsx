import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, Eye, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Orders: React.FC = () => {
  const { orders, user } = useStore();

  const mockOrders = [
    {
      id: 'ORD-001',
      productName: 'Custom Dress Shirt',
      status: 'delivered' as const,
      orderDate: '2025-01-15',
      deliveryDate: '2025-01-22',
      totalPrice: 1599,
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'ORD-002',
      productName: 'Tailored Suit',
      status: 'in-stitching' as const,
      orderDate: '2025-01-20',
      deliveryDate: '2025-02-03',
      totalPrice: 4299,
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'ORD-003',
      productName: 'Custom Blazer',
      status: 'confirmed' as const,
      orderDate: '2025-01-25',
      deliveryDate: '2025-02-08',
      totalPrice: 2899,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Clock className="h-5 w-5" />;
      case 'in-stitching':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'in-stitching':
        return 'text-yellow-600 bg-yellow-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Please sign in to view your orders</h2>
          <p className="text-slate-600 mb-8">You need to be logged in to access your order history.</p>
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
            My Orders
          </h1>
          <p className="text-xl text-slate-600">
            Track your custom clothing orders and delivery status
          </p>
        </motion.div>

        {/* Order Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">3</h3>
            <p className="text-slate-600">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">2</h3>
            <p className="text-slate-600">In Progress</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">1</h3>
            <p className="text-slate-600">Delivered</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">₹8,797</h3>
            <p className="text-slate-600">Total Spent</p>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="md:flex">
                <div className="md:w-48 flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-1">
                        {order.productName}
                      </h3>
                      <p className="text-sm text-slate-500">Order #{order.id}</p>
                    </div>
                    
                    <div className="flex items-center mt-2 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{formatStatus(order.status)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Order Date</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.orderDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Delivery Date</p>
                      <p className="text-sm text-slate-600">
                        {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Total Amount</p>
                      <p className="text-lg font-semibold text-slate-800">
                        ₹{order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-600">
                        {order.status === 'confirmed' && '25%'}
                        {order.status === 'in-stitching' && '50%'}
                        {order.status === 'shipped' && '75%'}
                        {order.status === 'delivered' && '100%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-slate-800 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: 
                            order.status === 'confirmed' ? '25%' :
                            order.status === 'in-stitching' ? '50%' :
                            order.status === 'shipped' ? '75%' :
                            '100%'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {order.status === 'delivered' && (
                      <button className="flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reorder
                      </button>
                    )}
                    
                    {order.status === 'in-stitching' && (
                      <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Package className="h-4 w-4 mr-2" />
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {mockOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No orders yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Start your custom clothing journey by browsing our collection and placing your first order.
            </p>
            <a
              href="/shop"
              className="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Start Shopping
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};