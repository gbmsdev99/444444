import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Search, Grid, List } from 'lucide-react';
import { getProducts } from '../lib/supabase';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'shirt', name: 'Shirts' },
    { id: 'suit', name: 'Suits' },
    { id: 'dress', name: 'Dresses' },
    { id: 'pants', name: 'Trousers' },
    { id: 'jacket', name: 'Blazers' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadProducts();
      } catch (error) {
        console.error('Failed to load products:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
      // Set empty array on error to prevent infinite loading
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.base_price - b.base_price;
        case 'price-high':
          return b.base_price - a.base_price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
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
            Custom Clothing Collection
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover our range of premium clothing, each piece tailored to your exact specifications
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search clothing..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="h-5 w-5 text-slate-600" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-slate-600">
            Showing {filteredProducts.length} of {products.length} items
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group ${
                viewMode === 'list' 
                  ? 'flex bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300' 
                  : 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300'
              }`}
            >
              <Link to={`/customize/${product.id}`} className={viewMode === 'list' ? 'flex w-full' : 'block'}>
                <div className={viewMode === 'list' ? 'w-80 flex-shrink-0' : 'relative'}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`${
                      viewMode === 'list' 
                        ? 'w-full h-64 object-cover' 
                        : 'w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300'
                    }`}
                  />
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-800">
                      ₹{product.base_price.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-500">
                      From
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No products found</h3>
            <p className="text-slate-600 mb-8">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};