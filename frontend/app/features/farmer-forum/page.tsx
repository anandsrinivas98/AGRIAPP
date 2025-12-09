'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { forumService } from '@/services/forumService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import CreateThreadModal from '@/components/forum/CreateThreadModal';
import CreateListingModal from '@/components/forum/CreateListingModal';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Filter,
  BookOpen,
  ShoppingBag,
  Calendar,
  Award,
  Eye,
  ThumbsUp,
  MessageCircle,
  Pin,
  Lock,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  Video,
  FileText,
  Star
} from 'lucide-react';

export default function FarmerForumPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [categories, setCategories] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [marketplace, setMarketplace] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [expertSessions, setExpertSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, threadsData, marketplaceData, knowledgeData, sessionsData, statsData] = await Promise.all([
        forumService.getCategories().catch(() => []),
        forumService.getThreads({ limit: 20 }).catch(() => []),
        forumService.getMarketplaceListings({ limit: 12 }).catch(() => []),
        forumService.getKnowledgeArticles({ limit: 12 }).catch(() => []),
        forumService.getExpertSessions({ upcoming: true }).catch(() => []),
        forumService.getForumStats().catch(() => ({ totalThreads: 0, totalReplies: 0, totalUsers: 0, activeToday: 0 }))
      ]);

      setCategories(categoriesData);
      setThreads(threadsData);
      setMarketplace(marketplaceData);
      setKnowledge(knowledgeData);
      setExpertSessions(sessionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (data: any) => {
    try {
      await forumService.createThread(data);
      alert('Discussion created successfully!');
      await loadData();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCreateListing = async (data: any) => {
    try {
      await forumService.createMarketplaceListing(data);
      alert('Listing created successfully!');
      await loadData();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = !searchQuery || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || thread.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Farmer Forum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium group"
        >
          <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Farmer Forum
                  </h1>
                  <p className="text-gray-600">
                    Connect, Learn, and Grow Together
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please login to create a discussion');
                  window.location.href = '/auth/login';
                  return;
                }
                setShowCreateThread(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              New Discussion
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Discussions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalThreads || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Replies</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalReplies || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Community Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white border-2 border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeToday || 0}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'discussions', label: 'Discussions', icon: MessageSquare },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
              { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
              { id: 'experts', label: 'Expert Sessions', icon: Video }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium capitalize transition-colors flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white sticky top-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.icon || '📁'}</span>
                        <span>{category.name}</span>
                      </span>
                      <Badge className="bg-gray-200 text-gray-700">
                        {category._count?.threads || 0}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content - Threads */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <Card className="p-4 bg-white mb-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>Latest</option>
                    <option>Popular</option>
                    <option>Most Liked</option>
                  </select>
                </div>
              </Card>

              {/* Threads List */}
              <div className="space-y-4">
                {filteredThreads.length === 0 ? (
                  <Card className="p-12 bg-white text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Discussions Yet
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Be the first to start a conversation!
                    </p>
                    <Link
                      href="/features/farmer-forum/create-thread"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-5 h-5" />
                      Start Discussion
                    </Link>
                  </Card>
                ) : (
                  filteredThreads.map((thread) => (
                    <Card
                      key={thread.id}
                      className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <Link href={`/features/farmer-forum/thread/${thread.slug}`}>
                        <div className="flex gap-4">
                          {/* Author Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {thread.author.firstName[0]}{thread.author.lastName[0]}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {thread.isPinned && (
                                    <Pin className="w-4 h-4 text-green-600" />
                                  )}
                                  {thread.isLocked && (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  )}
                                  <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600">
                                    {thread.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                  {thread.content}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {thread.author.firstName} {thread.author.lastName}
                                  </span>
                                  {thread.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {thread.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(thread.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700">
                                {thread.category.name}
                              </Badge>
                            </div>

                            {/* Tags */}
                            {thread.tags && thread.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {thread.tags.map((tag: string, index: number) => (
                                  <Badge
                                    key={index}
                                    className="bg-gray-100 text-gray-600 text-xs"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {thread.viewCount} views
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {thread._count?.replies || 0} replies
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {thread._count?.likes || 0} likes
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Please login to post a listing');
                    window.location.href = '/auth/login';
                    return;
                  }
                  setShowCreateListing(true);
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Post Listing
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplace.map((listing) => (
                <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  {listing.images && listing.images[0] && (
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                        {listing.category}
                      </Badge>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {listing.title}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₹{listing.price}
                      {listing.unit && <span className="text-sm text-gray-600">/{listing.unit}</span>}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                    
                    {/* Location and Seller */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {listing.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {listing.seller.firstName}
                      </span>
                    </div>

                    {/* Contact Details */}
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-700 mb-2">📞 Contact Seller:</p>
                      {listing.contactPhone && (
                        <a 
                          href={`tel:${listing.contactPhone}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {listing.contactPhone}
                        </a>
                      )}
                      {listing.contactEmail && (
                        <a 
                          href={`mailto:${listing.contactEmail}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {listing.contactEmail}
                        </a>
                      )}
                      {listing.seller.phone && !listing.contactPhone && (
                        <a 
                          href={`tel:${listing.seller.phone}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {listing.seller.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Hub Tab */}
        {activeTab === 'knowledge' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Hub</h2>
              <p className="text-gray-600">Learn from expert articles and guides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledge.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                  {article.coverImage && (
                    <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 relative">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      {article.isFeatured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <Badge className="mb-3 bg-green-100 text-green-700">
                      {article.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.viewCount} views
                      </span>
                    </div>
                    <Link
                      href={`/features/farmer-forum/knowledge/${article.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expert Sessions Tab */}
        {activeTab === 'experts' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert Sessions</h2>
              <p className="text-gray-600">Join live sessions with agricultural experts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {expertSessions.map((session) => (
                <Card key={session.id} className="p-6 bg-white hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {session.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.expert.firstName} {session.expert.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration} min
                        </span>
                      </div>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Register Now
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateThreadModal
        isOpen={showCreateThread}
        onClose={() => setShowCreateThread(false)}
        onSubmit={handleCreateThread}
        categories={categories}
      />
      <CreateListingModal
        isOpen={showCreateListing}
        onClose={() => setShowCreateListing(false)}
        onSubmit={handleCreateListing}
      />
    </div>
  );
}
