'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    farmType: '',
    cropPreferences: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: '',
      farmType: '',
      cropPreferences: ''
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = formData.firstName?.charAt(0).toUpperCase() || 'U';
    const last = formData.lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Farmer Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-lime-600 p-8 text-white relative">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-green-700 font-bold text-3xl shadow-xl">
                {getInitials()}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold mb-1">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-green-100 text-lg">{formData.email}</p>
                <div className="mt-3 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                </div>
              </div>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-green-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <PencilIcon className="w-5 h-5" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <UserCircleIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City, State"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Farm Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Farm Type
                </label>
                <div className="relative">
                  <BriefcaseIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="farmType"
                    value={formData.farmType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g., Organic, Commercial"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      isEditing
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Crop Preferences */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Crop Preferences
                </label>
                <textarea
                  name="cropPreferences"
                  value={formData.cropPreferences}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Rice, Wheat, Cotton"
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all resize-none ${
                    isEditing
                      ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-lime-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Your information is secure and will only be used to improve your farming experience.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
