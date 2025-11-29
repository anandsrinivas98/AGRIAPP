'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Equipment {
  id: string;
  title: string;
  category: string;
  type: 'sale' | 'rent';
  price: number;
  rentPrice?: number;
  location: string;
  condition: string;
  year: number;
  brand: string;
  description: string;
  seller: {
    name: string;
    rating: number;
    reviews: number;
    phone: string;
    email: string;
    verified: boolean;
  };
  specifications: { [key: string]: string };
  availability: 'available' | 'rented' | 'sold';
}

export default function EquipmentMarketplace() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  const categories = ['all', 'tractors', 'harvesters', 'irrigation', 'planting', 'tillage'];
  const conditions = ['all', 'new', 'excellent', 'good', 'fair'];
  const types = ['all', 'sale', 'rent'];

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, searchTerm, selectedCategory, selectedType, selectedCondition]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      
      const mockEquipment: Equipment[] = [
        {
          id: '1',
          title: 'John Deere 6120M Tractor',
          category: 'tractors',
          type: 'sale',
          price: 85000,
          location: 'Iowa, USA',
          condition: 'excellent',
          year: 2020,
          brand: 'John Deere',
          description: 'Well-maintained tractor with low hours.',
          seller: { name: 'Farm Equipment Co.', rating: 4.8, reviews: 127, phone: '+1-555-0123', email: 'sales@farmequip.com', verified: true },
          specifications: { 'Engine Power': '120 HP', 'Hours': '1,250' },
          availability: 'available'
        },
        {
          id: '2',
          title: 'Case IH Axial-Flow 250 Combine',
          category: 'harvesters',
          type: 'rent',
          price: 450000,
          rentPrice: 2500,
          location: 'Nebraska, USA',
          condition: 'good',
          year: 2018,
          brand: 'Case IH',
          description: 'High-capacity combine harvester.',
          seller: { name: 'Harvest Solutions', rating: 4.6, reviews: 89, phone: '+1-555-0456', email: 'rent@harvestsol.com', verified: true },
          specifications: { 'Engine Power': '473 HP', 'Hours': '2,800' },
          availability: 'available'
        }
      ];
      
      setEquipment(mockEquipment);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipment = () => {
    let filtered = equipment.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
      return matchesSearch && matchesCategory && matchesType && matchesCondition;
    });
    setFilteredEquipment(filtered);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? <StarIconSolid className="w-4 h-4 text-yellow-400" /> : <StarIcon className="w-4 h-4 text-gray-300" />}
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
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Equipment Marketplace</h2>
        <p className="text-gray-600">Buy or rent farming equipment from verified sellers</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
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
              <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          >
            {types.map(type => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type === 'sale' ? 'For Sale' : 'For Rent'}</option>
            ))}
          </select>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          >
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="relative h-48 bg-gray-200">
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {item.type === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                  {item.condition}
                </span>
              </div>
              {item.seller.verified && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <TruckIcon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <MapPinIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{item.location}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{item.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{item.brand}</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">${item.price.toLocaleString()}</div>
                {item.type === 'rent' && item.rentPrice && (
                  <div className="text-sm text-gray-600">${item.rentPrice}/day rental</div>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.seller.name}</span>
                  <div className="flex items-center space-x-1">
                    {renderStars(item.seller.rating)}
                    <span className="text-xs text-gray-600">({item.seller.reviews})</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                    <PhoneIcon className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
