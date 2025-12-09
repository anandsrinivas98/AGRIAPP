'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { forumService } from '@/services/forumService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  User,
  MapPin,
  Tag,
  Send,
  Pin
} from 'lucide-react';

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [thread, setThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.slug) {
      loadThread();
    }
  }, [params.slug]);

  const loadThread = async () => {
    try {
      setLoading(true);
      const data = await forumService.getThreadBySlug(params.slug as string);
      setThread(data);
      // Load replies if available
      if (data.replies) {
        setReplies(data.replies);
      }
    } catch (error) {
      console.error('Error loading thread:', error);
      alert('Thread not found');
      router.push('/features/farmer-forum');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to reply');
      router.push('/auth/login');
      return;
    }

    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      await forumService.createReply({ threadId: thread.id, content: replyContent });
      setReplyContent('');
      await loadThread();
      alert('Reply posted successfully!');
    } catch (error: any) {
      console.error('Error posting reply:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like');
      router.push('/auth/login');
      return;
    }

    try {
      await forumService.toggleLike({ threadId: thread.id });
      await loadThread();
    } catch (error) {
      console.error('Error liking thread:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading discussion...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
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

        {/* Thread Card */}
        <Card className="p-6 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {thread.isPinned && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {thread.isLocked && (
                  <Badge className="bg-red-100 text-red-800">Locked</Badge>
                )}
                <Badge className="bg-green-100 text-green-700">
                  {thread.category?.name}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {thread.title}
              </h1>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {thread.author?.firstName} {thread.author?.lastName}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(thread.createdAt).toLocaleDateString()}
                </span>
                {thread.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {thread.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
          </div>

          {/* Tags */}
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {thread.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {thread.viewCount || 0} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {thread._count?.replies || 0} replies
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {thread._count?.likes || 0} likes
              </span>
            </div>
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              Like
            </button>
          </div>
        </Card>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Replies ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No replies yet. Be the first to reply!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {reply.author?.firstName} {reply.author?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {!thread.isLocked && (
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Post a Reply</h3>
            <form onSubmit={handleSubmitReply}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-4"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </Card>
        )}

        {thread.isLocked && (
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800 text-center">
              🔒 This discussion is locked. No new replies can be added.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
