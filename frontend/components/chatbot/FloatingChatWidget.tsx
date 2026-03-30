'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  ArrowsPointingOutIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
}

const QUICK_PROMPTS = [
  '🌾 Best crops for my region?',
  '🐛 How to control pests?',
  '💧 Irrigation tips for rice',
  '🌿 Soil improvement methods',
];

export default function FloatingChatWidget() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! 👋 I\'m your AgriSense AI assistant. Ask me anything about farming, crops, or plant health!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState(() => `widget_${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + 'px';
    }
  }, [input]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return; }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        setInput('How can I improve my crop yield?');
        toast.success('Voice converted to text!');
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() && !selectedImage) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText || 'Please analyze this image',
      timestamp: new Date(),
      image: imagePreview || undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', userMsg.content);
      formData.append('sessionId', sessionId);
      formData.append('conversationHistory', JSON.stringify(messages.slice(-4)));
      if (selectedImage) formData.append('image', selectedImage);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/chatbot`, { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);

        const fullText: string = data.data.response;
        let current = '';
        for (let i = 0; i < fullText.length; i++) {
          current += fullText[i];
          const snap = current;
          setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: snap } : m));
          const delay = ['.', '!', '?'].includes(fullText[i]) ? 80 : 12;
          await new Promise(r => setTimeout(r, delay));
        }
      } else {
        throw new Error(data.message);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Try the full chat page for more options.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Chat cleared! How can I help you? 🌱',
      timestamp: new Date(),
    }]);
  };

  // Only render for authenticated users
  if (!mounted || authLoading || !isAuthenticated) return null;

  const widget = (
    <div
      className="z-[9999] flex flex-col items-end gap-3"
      style={{ position: 'fixed', bottom: '24px', right: '24px' }}
    >
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: 'min(520px, calc(100dvh - 100px))', width: 'min(384px, calc(100vw - 32px))', transformOrigin: 'bottom right' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="22" x2="12" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <ellipse cx="8.5" cy="9" rx="3.2" ry="1.8" transform="rotate(-35 8.5 9)" fill="white" fillOpacity="0.9"/>
                    <ellipse cx="15.5" cy="9" rx="3.2" ry="1.8" transform="rotate(35 15.5 9)" fill="white" fillOpacity="0.9"/>
                    <ellipse cx="7.5" cy="13" rx="3" ry="1.7" transform="rotate(-30 7.5 13)" fill="white" fillOpacity="0.75"/>
                    <ellipse cx="16.5" cy="13" rx="3" ry="1.7" transform="rotate(30 16.5 13)" fill="white" fillOpacity="0.75"/>
                    <ellipse cx="12" cy="5.5" rx="1.8" ry="2.8" fill="white" fillOpacity="0.95"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">AgriSense AI</p>
                  <p className="text-green-100 text-xs">Ask me anything</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <TrashIcon className="w-4 h-4 text-white" />
                </button>
                <Link
                  href="/features/chatbot"
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Open full chat"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
                </Link>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <ChevronDownIcon className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="12" y1="22" x2="12" y2="6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
                        <ellipse cx="8.5" cy="9" rx="3.2" ry="1.8" transform="rotate(-35 8.5 9)" fill="#16a34a" fillOpacity="0.9"/>
                        <ellipse cx="15.5" cy="9" rx="3.2" ry="1.8" transform="rotate(35 15.5 9)" fill="#16a34a" fillOpacity="0.9"/>
                        <ellipse cx="7.5" cy="13" rx="3" ry="1.7" transform="rotate(-30 7.5 13)" fill="#16a34a" fillOpacity="0.75"/>
                        <ellipse cx="16.5" cy="13" rx="3" ry="1.7" transform="rotate(30 16.5 13)" fill="#16a34a" fillOpacity="0.75"/>
                        <ellipse cx="12" cy="5.5" rx="1.8" ry="2.8" fill="#16a34a" fillOpacity="0.95"/>
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-green-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="uploaded" className="rounded-lg mb-2 max-h-32 object-cover w-full" />
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="22" x2="12" y2="6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
                      <ellipse cx="8.5" cy="9" rx="3.2" ry="1.8" transform="rotate(-35 8.5 9)" fill="#16a34a" fillOpacity="0.9"/>
                      <ellipse cx="15.5" cy="9" rx="3.2" ry="1.8" transform="rotate(35 15.5 9)" fill="#16a34a" fillOpacity="0.9"/>
                      <ellipse cx="7.5" cy="13" rx="3" ry="1.7" transform="rotate(-30 7.5 13)" fill="#16a34a" fillOpacity="0.75"/>
                      <ellipse cx="16.5" cy="13" rx="3" ry="1.7" transform="rotate(30 16.5 13)" fill="#16a34a" fillOpacity="0.75"/>
                      <ellipse cx="12" cy="5.5" rx="1.8" ry="2.8" fill="#16a34a" fillOpacity="0.95"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts (only when no messages beyond welcome) */}
            {messages.length <= 1 && (
              <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-hide">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="flex-shrink-0 text-xs bg-white border border-green-200 text-green-700 rounded-full px-3 py-1 hover:bg-green-50 transition-colors whitespace-nowrap"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Image preview */}
            {imagePreview && (
              <div className="px-3 pt-2 bg-white border-t border-gray-100">
                <div className="relative inline-block">
                  <img src={imagePreview} alt="preview" className="h-14 w-14 object-cover rounded-lg border border-gray-200" />
                  <button
                    onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <XMarkIcon className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-400 transition-all px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask about crops, pests, soil..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none ring-0 border-0 focus:ring-0 focus:outline-none focus:border-0 shadow-none max-h-24 p-0"
                />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    title="Upload image"
                  >
                    <PhotoIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-1 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-green-600'}`}
                    title={isRecording ? 'Stop recording' : 'Voice input'}
                  >
                    <MicrophoneIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || (!input.trim() && !selectedImage)}
                    className="p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1.5">
                Powered by Gemini AI ·{' '}
                <Link href="/features/chatbot" className="text-green-600 hover:underline">Full chat →</Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized bar */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className="bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-shadow"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="22" x2="12" y2="6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
              <ellipse cx="8.5" cy="9" rx="3.2" ry="1.8" transform="rotate(-35 8.5 9)" fill="#16a34a" fillOpacity="0.9"/>
              <ellipse cx="15.5" cy="9" rx="3.2" ry="1.8" transform="rotate(35 15.5 9)" fill="#16a34a" fillOpacity="0.9"/>
              <ellipse cx="7.5" cy="13" rx="3" ry="1.7" transform="rotate(-30 7.5 13)" fill="#16a34a" fillOpacity="0.75"/>
              <ellipse cx="16.5" cy="13" rx="3" ry="1.7" transform="rotate(30 16.5 13)" fill="#16a34a" fillOpacity="0.75"/>
              <ellipse cx="12" cy="5.5" rx="1.8" ry="2.8" fill="#16a34a" fillOpacity="0.95"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">AgriSense AI</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="relative flex items-center justify-center group">

        {/* Hover tooltip — absolutely positioned, no layout impact */}
        <div
          className="absolute right-[72px] whitespace-nowrap bg-white text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg pointer-events-none select-none border border-green-200 shadow-md
            opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
            transition-all duration-200 ease-out"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          Ask anything
          {/* arrow */}
          <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-white" />
        </div>

        <motion.button
          onClick={() => { setIsOpen(prev => !prev); setIsMinimized(false); }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
          style={{ background: 'linear-gradient(145deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)' }}
          aria-label="Open AI farming assistant"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <XMarkIcon className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ duration: 0.18 }}>
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="20" y1="36" x2="20" y2="10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  <ellipse cx="14" cy="14" rx="5" ry="3" transform="rotate(-35 14 14)" fill="white" fillOpacity="0.9"/>
                  <ellipse cx="26" cy="14" rx="5" ry="3" transform="rotate(35 26 14)" fill="white" fillOpacity="0.9"/>
                  <ellipse cx="12" cy="20" rx="5" ry="3" transform="rotate(-30 12 20)" fill="white" fillOpacity="0.75"/>
                  <ellipse cx="28" cy="20" rx="5" ry="3" transform="rotate(30 28 20)" fill="white" fillOpacity="0.75"/>
                  <ellipse cx="20" cy="9" rx="3" ry="4.5" fill="white" fillOpacity="0.95"/>
                  <path d="M20 18 Q14 16 12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                  <path d="M20 18 Q26 16 28 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle glow ring — only when closed */}
          {!isOpen && (
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' }}
              animate={{ boxShadow: ['0 0 0 0px rgba(34,197,94,0.45)', '0 0 0 10px rgba(34,197,94,0)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.button>
      </div>
    </div>
  );

  return createPortal(widget, document.documentElement);
}
