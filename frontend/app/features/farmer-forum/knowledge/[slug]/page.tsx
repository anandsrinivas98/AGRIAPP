'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { forumService } from '@/services/forumService';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  User,
  Clock,
  Eye,
  Star,
  Calendar
} from 'lucide-react';

export default function KnowledgeArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      loadArticle();
    }
  }, [params.slug]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const data = await forumService.getArticleBySlug(params.slug as string);
      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Article not found');
      router.push('/features/farmer-forum');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/features/farmer-forum"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Forum
        </Link>

        {/* Article Card */}
        <Card className="overflow-hidden">
          {/* Cover Image */}
          {article.coverImage && (
            <div className="h-64 bg-gradient-to-br from-green-400 to-emerald-500 relative">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {article.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-yellow-500 text-white flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Featured Article
                </Badge>
              )}
            </div>
          )}

          <div className="p-8">
            {/* Category Badge */}
            <Badge className="mb-4 bg-green-100 text-green-700 text-sm">
              <BookOpen className="w-4 h-4 mr-1" />
              {article.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Author & Meta Info */}
            <div className="flex items-center gap-6 mb-8 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {article.author?.firstName} {article.author?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {article.author?.role || 'Author'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime || 5} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.viewCount || 0} views
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles Section (Optional) */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                More Articles in {article.category}
              </h3>
              <Link
                href="/features/farmer-forum?tab=knowledge"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
              >
                View all articles
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
