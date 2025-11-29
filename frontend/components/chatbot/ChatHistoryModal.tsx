'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  ClockIcon, 
  TrashIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface HistoryMessage {
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

interface ChatSession {
  sessionId: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSessionId?: string;
  onLoadSession?: (sessionId: string) => void;
}

export default function ChatHistoryModal({ 
  isOpen, 
  onClose, 
  currentSessionId,
  onLoadSession 
}: ChatHistoryModalProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'sessions' | 'history'>('sessions');

  // Load user sessions
  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/chatbot/sessions', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Sessions loaded:', data);
        setSessions(data.data.sessions || []);
      } else {
        console.error('Failed to load sessions:', response.status);
        toast.error('Failed to load chat history');
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionHistory = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/chatbot/history/${sessionId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('History loaded:', data);
        setHistory(data.data.history || []);
        setSelectedSession(sessionId);
        setView('history');
      } else {
        console.error('Failed to load history:', response.status);
        toast.error('Failed to load conversation');
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chatbot/history/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        toast.success('Conversation deleted');
        loadSessions();
        if (selectedSession === sessionId) {
          setView('sessions');
          setSelectedSession(null);
        }
      } else {
        console.error('Failed to delete session:', response.status);
        toast.error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete conversation');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {view === 'sessions' ? 'Chat History' : 'Conversation'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {view === 'sessions' 
                      ? `${sessions.length} conversation${sessions.length !== 1 ? 's' : ''}`
                      : 'View your chat messages'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : view === 'sessions' ? (
                /* Sessions List */
                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="relative inline-block">
                        <ChatBubbleLeftRightIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-xl">💬</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No chat history yet
                      </h3>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto">
                        Your conversations will appear here. Start chatting with the AI assistant to build your history!
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Start Chatting
                      </button>
                    </div>
                  ) : (
                    sessions.map((session, index) => (
                      <motion.div
                        key={session.sessionId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative p-4 bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-white rounded-xl cursor-pointer transition-all border border-gray-200 hover:border-green-300 hover:shadow-md"
                        onClick={() => loadSessionHistory(session.sessionId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                              {session.lastMessage}
                            </p>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {session.timestamp}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.sessionId);
                            }}
                            className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-2 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete conversation"
                          >
                            <TrashIcon className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                /* History View */
                <div className="space-y-4">
                  <button
                    onClick={() => setView('sessions')}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    ← Back to all conversations
                  </button>
                  
                  <div className="space-y-3">
                    {history.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-xs mt-2 ${
                            msg.role === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {view === 'history' && selectedSession && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    if (onLoadSession) {
                      onLoadSession(selectedSession);
                    }
                    onClose();
                  }}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                >
                  Continue this conversation
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
