'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Supplier {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviews: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  products: string[];
  certifications: string[];
  yearsInBusiness: number;
}

export default function SupplierDirectory() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'seeds', 'fertilizers', 'equipment', 'pesticides', 'irrigation'];

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, selectedCategory]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'AgriSupply Pro',
          category: 'seeds',
          description: 'Premium seed supplier with over 500 varieties of crops',
          location: 'Iowa, USA',
          coordinates: { lat: 41.8780, lng: -93.0977 },
          rating: 4.8,
          reviews: 234,
          verified: true,
          contact: {
            phone: '+1-555-0123',
            email: 'info@agrisupplypro.com',
            website: 'www.agrisupplypro.com'
          },
          products: ['Corn Seeds', 'Wheat Seeds', 'Soybean Seeds'],
          certifications: ['Organic Certified', 'ISO 9001'],
          yearsInBusiness: 15
        },
        {
          id: '2',
          name: 'GreenGrow Fertilizers',
          category: 'fertilizers',
          description: 'Eco-friendly fertilizer solutions for sustainable farming',
          location: 'California, USA',
          coordinates: { lat: 36.7783, lng: -119.4179 },
          rating: 4.6,
          reviews: 189,
          verified: true,
          contact: {
            phone: '+1-555-0456',
            email: 'sales@greengrow.com',
            website: 'www.greengrow.com'
          },
          products: ['Organic Fertilizers', 'NPK Blends', 'Micronutrients'],
          certifications: ['OMRI Listed', 'EPA Registered'],
          yearsInBusiness: 12
        },
        {
          id: '3',
          name: 'FarmTech Equipment',
          category: 'equipment',
          description: 'Modern farming equipment and machinery dealer',
          location: 'Nebraska, USA',
          coordinates: { lat: 41.4925, lng: -99.9018 },
          rating: 4.9,
          reviews: 312,
          verified: true,
          contact: {
            phone: '+1-555-0789',
            email: 'contact@farmtech.com',
            website: 'www.farmtech.com'
          },
          products: ['Tractors', 'Harvesters', 'Irrigation Systems'],
          certifications: ['Authorized Dealer', 'Service Certified'],
          yearsInBusiness: 20
        }
      ];
      
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredSuppliers(filtered);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? (
          <StarIconSolid className="w-4 h-4 text-yellow-400" />
        ) : (
          <StarIcon className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Supplier Directory</h2>
          <p className="text-gray-600">Connect with verified agricultural suppliers</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredSuppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <BuildingStorefrontIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-600 capitalize">{supplier.category}</span>
                    {supplier.verified && (
                      <span className="text-green-600 text-xs">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{supplier.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{supplier.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {renderStars(supplier.rating)}
                  <span className="text-sm text-gray-600 ml-1">
                    ({supplier.reviews} reviews)
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {supplier.yearsInBusiness} years
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-medium text-gray-700 mb-2">Products:</div>
              <div className="flex flex-wrap gap-1">
                {supplier.products.slice(0, 3).map((product, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {product}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <a href={`tel:${supplier.contact.phone}`} className="flex items-center space-x-2 text-sm text-gray-700 hover:text-green-600">
                <PhoneIcon className="w-4 h-4" />
                <span>{supplier.contact.phone}</span>
              </a>
              <a href={`mailto:${supplier.contact.email}`} className="flex items-center space-x-2 text-sm text-gray-700 hover:text-green-600">
                <EnvelopeIcon className="w-4 h-4" />
                <span>{supplier.contact.email}</span>
              </a>
              <a href={`https://${supplier.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-green-600">
                <GlobeAltIcon className="w-4 h-4" />
                <span>{supplier.contact.website}</span>
              </a>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
              Contact Supplier
            </button>
          </motion.div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
