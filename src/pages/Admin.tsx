import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  Ruler, 
  Image, 
  BarChart3, 
  Bell,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { 
  getAdminStats, 
  getOrders, 
  getAllCustomers, 
  updateOrderStatus,
  subscribeToOrders 
} from '../lib/supabase';
import { Order, User } from '../types';
import toast from 'react-hot-toast';

export const Admin: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
      
      // Subscribe to real-time order updates
      const subscription = subscribeToOrders((payload) => {
        console.log('Real-time order update:', payload);
        loadOrders(); // Reload orders when there's an update
        toast.success('Orders updated in real-time!');
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      const [statsData, ordersData, customersData] = await Promise.all([
        getAdminStats(),
        getOrders(),
        getAllCustomers()
      ]);

      setStats(statsData);
      setOrders(ordersData || []);
      setCustomers(customersData || []);
    } catch (error: any) {
      toast.error('Failed to load admin data');
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error loading orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      await loadOrders();
    } catch (error: any) {
      toast.error('Failed to update order status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-8">You need admin privileges to access this page.</p>
          <a
            href="/"
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'measurements', name: 'Measurements', icon: Ruler },
    { id: 'designs', name: 'Designs', icon: Image },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

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

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalOrders || 0}</h3>
          <p className="text-slate-600">Total Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-yellow-600 text-sm font-medium">Pending</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.pendingOrders || 0}</h3>
          <p className="text-slate-600">Pending Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalCustomers || 0}</h3>
          <p className="text-slate-600">Total Customers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">+{stats.monthlyGrowth || 0}%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">₹{(stats.totalRevenue || 0).toLocaleString()}</h3>
          <p className="text-slate-600">Total Revenue</p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-slate-600 font-medium">Order Number</th>
                <th className="text-left py-3 text-slate-600 font-medium">Customer</th>
                <th className="text-left py-3 text-slate-600 font-medium">Status</th>
                <th className="text-right py-3 text-slate-600 font-medium">Amount</th>
                <th className="text-center py-3 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-800">{order.order_number}</td>
                  <td className="py-3 text-slate-600">{order.customer_name}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-800">
                    ₹{order.total_amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded px-2 py-1"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="in-stitching">In Stitching</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-800">Order Management</h3>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-800">{order.order_number}</h4>
                <p className="text-slate-600">{order.customer_name}</p>
                <p className="text-sm text-slate-500">{order.customer_email} • {order.customer_phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-slate-800">₹{order.total_amount.toLocaleString()}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Order Date</p>
                <p className="text-sm text-slate-600">{new Date(order.order_date || order.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Shipping Address</p>
                <p className="text-sm text-slate-600">{order.shipping_address}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Update Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="border border-slate-200 rounded px-3 py-1 text-sm"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="in-stitching">In Stitching</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-800">Customer Management</h3>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-slate-600 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-slate-600 font-medium">Email</th>
                <th className="text-center py-4 px-6 text-slate-600 font-medium">Orders</th>
                <th className="text-right py-4 px-6 text-slate-600 font-medium">Total Spent</th>
                <th className="text-center py-4 px-6 text-slate-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-800">{customer.full_name || 'N/A'}</p>
                      <p className="text-sm text-slate-500">Joined {new Date(customer.created_at).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{customer.email}</td>
                  <td className="py-4 px-6 text-center font-semibold text-slate-800">
                    {(customer as any).orders?.length || 0}
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-slate-800">
                    ₹{((customer as any).orders?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="text-slate-600 hover:text-slate-800">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'orders':
        return renderOrders();
      case 'customers':
        return renderCustomers();
      case 'measurements':
        return (
          <div className="text-center py-20">
            <Ruler className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Measurements Management</h3>
            <p className="text-slate-600">Customer measurement profiles and history</p>
          </div>
        );
      case 'designs':
        return (
          <div className="text-center py-20">
            <Image className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Design Uploads</h3>
            <p className="text-slate-600">Customer design uploads and inspiration images</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="text-center py-20">
            <Bell className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Notifications Center</h3>
            <p className="text-slate-600">Manage customer communications and alerts</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

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
            Admin Dashboard
          </h1>
          <p className="text-xl text-slate-600">
            Manage orders, customers, and business operations
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};