'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { formatINR } from '@/lib/utils/currencyFormatter';
import { CropListing } from '@/lib/types/marketData';
// @ts-ignore
import { marketDataService } from '@/lib/services/marketDataService';

const CropTrading = React.memo(function CropTrading() {
  const [listings, setListings] = useState<CropListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');

  const cropTypes = useMemo(() => ['all', 'wheat', 'corn', 'soybeans', 'rice', 'cotton'], []);
  const qualities = useMemo(() => ['all', 'premium', 'grade-a', 'grade-b', 'standard'], []);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch real crop listings from Indian market APIs
      const realListings = await marketDataService.getCropListings({
        cropType: selectedCrop === 'all' ? undefined : selectedCrop,
        quality: selectedQuality === 'all' ? undefined : selectedQuality,
      });
      
      setListings(realListings);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCrop, selectedQuality]);

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = listing.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCrop = selectedCrop === 'all' || listing.cropType === selectedCrop;
      const matchesQuality = selectedQuality === 'all' || listing.quality === selectedQuality;
      return matchesSearch && matchesCrop && matchesQuality;
    });
  }, [listings, searchTerm, selectedCrop, selectedQuality]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
        <h2 className="text-2xl font-bold text-gray-800">Crop Trading</h2>
        <p className="text-gray-600">Buy and sell crops directly from farmers</p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops or sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          {cropTypes.map(crop => (
            <option key={crop} value={crop}>
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedQuality}
          onChange={(e) => setSelectedQuality(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          {qualities.map(quality => (
            <option key={quality} value={quality}>
              {quality.charAt(0).toUpperCase() + quality.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                  {listing.cropType}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.quality === 'premium' ? 'bg-purple-100 text-purple-800' :
                    listing.quality === 'grade-a' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.quality}
                  </span>
                  {listing.seller.verified && (
                    <span className="text-green-600 text-xs">✓ Verified</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatINR(listing.pricePerUnit)}
                </div>
                <div className="text-sm text-gray-600">per {listing.unit}</div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{listing.quantity.toLocaleString()} {listing.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium text-green-600">{formatINR(listing.totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{listing.location}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Harvest Date:</span>
                <span className="font-medium">{new Date(listing.harvestDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{listing.seller.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{listing.seller.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{listing.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-orange-600">
                <ClockIcon className="w-4 h-4" />
                <span>Expires in {listing.expiresIn}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm">
                  <ChatBubbleLeftIcon className="w-4 h-4 inline mr-1" />
                  Message
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm">
                  Make Offer
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
});

export default CropTrading;
