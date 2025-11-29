'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  DocumentIcon,
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
  SunIcon,
  BeakerIcon,
  BugAntIcon,
  CloudIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/shared/PageHeader';
import ChatHistoryModal from '@/components/chatbot/ChatHistoryModal';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  image?: string;
  file?: { name: string; type: string };
  isStreaming?: boolean;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! 🙏 Welcome to your advanced AI farming assistant!\n\nI\'m powered by Gemini AI and understand your questions naturally - even short messages, spelling mistakes, or mixed languages.\n\n**🌾 What I can do:**\n• **Complete crop guides** - Step-by-step cultivation from seed to harvest\n• **Smart problem solving** - Disease, pest, and soil issues\n• **Cost & yield planning** - Detailed financial analysis\n• **Image analysis** - Upload photos for instant diagnosis\n• **Document processing** - Analyze farming reports and data\n• **Context memory** - Remember our conversation for follow-ups\n\n**💡 Try asking:**\n• "How to grow tomatoes for 1 acre?"\n• "My wheat leaves are turning yellow"\n• "Best fertilizer schedule for rice"\n\nJust ask naturally - I\'ll understand! 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}`;
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.parentElement;
      if (scrollContainer) {
        // Smooth scroll to bottom
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Show typing indicator
  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
      // Ctrl/Cmd + L to clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearChat();
      }
      // Escape to blur input
      if (e.key === 'Escape') {
        textareaRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [messages]);

  // Quick action buttons
  const quickActions = [
    { icon: CloudIcon, label: 'Weather', prompt: 'What\'s the weather forecast for farming this week?' },
    { icon: BeakerIcon, label: 'Soil', prompt: 'How can I improve my soil quality?' },
    { icon: SparklesIcon, label: 'Crops', prompt: 'Which crops are best for my region?' },
    { icon: BugAntIcon, label: 'Pests', prompt: 'How do I identify and control common pests?' }
  ];

  // Suggested prompts with categories
  const suggestedPrompts = [
    { text: 'How do I prepare soil for wheat cultivation?', category: '🌾 Crops' },
    { text: 'What are the signs of nitrogen deficiency in plants?', category: '🧪 Soil' },
    { text: 'Best irrigation practices for rice farming', category: '💧 Water' },
    { text: 'How to identify and treat leaf blight disease?', category: '🔬 Disease' },
    { text: 'Organic pest control methods for vegetables', category: '🐛 Pests' },
    { text: 'When is the best time to plant tomatoes?', category: '🌾 Crops' },
    { text: 'How to improve clay soil for farming?', category: '🧪 Soil' }
  ];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB', {
          icon: '⚠️',
          duration: 4000,
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file', {
          icon: '⚠️',
          duration: 4000,
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('📸 Image ready! Add your question and send.', {
        duration: 3000,
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB', {
          icon: '⚠️',
          duration: 4000,
        });
        return;
      }
      
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.csv'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        toast.error('Please select a valid document file', {
          icon: '⚠️',
          duration: 4000,
        });
        return;
      }
      
      setSelectedFile(file);
      toast.success('📄 File ready! Add your question and send.', {
        duration: 3000,
      });
    }
  };

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would send to speech-to-text API
        toast.success('Voice recorded! Converting to text...');
        // Simulated transcription
        setTimeout(() => {
          setInput('How can I improve my crop yield?');
          toast.success('Voice converted to text!');
        }, 1000);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started...');
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() && !selectedImage && !selectedFile) {
      toast.error('Please enter a message or upload an image/file', {
        icon: '💬',
        duration: 3000,
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || 'Please analyze this image/file',
      timestamp: new Date(),
      image: imagePreview || undefined,
      file: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Clear uploads
    const hasImage = !!selectedImage;
    const hasFile = !!selectedFile;
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);

    try {
      // Call backend API with Gemini + RAG
      const formData = new FormData();
      formData.append('message', userMessage.content);
      formData.append('sessionId', sessionId); // Include session ID for history
      formData.append('conversationHistory', JSON.stringify(messages.slice(-5))); // Last 5 messages for context
      
      if (hasImage && selectedImage) {
        formData.append('image', selectedImage);
      }
      if (hasFile && selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.success) {
        // Simulate streaming effect
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Stream the response with variable speed for natural feel
        const fullResponse = data.data.response;
        let currentText = '';
        
        for (let i = 0; i < fullResponse.length; i++) {
          currentText += fullResponse[i];
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: currentText }
                : msg
            )
          );
          // Variable delay for more natural typing
          const delay = fullResponse[i] === '.' || fullResponse[i] === '!' || fullResponse[i] === '?' ? 100 : 15;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Mark streaming as complete
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        
        // Success notification
        toast.success('✨ Response received!', {
          duration: 2000,
        });
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try again in a moment. In the meantime, you can:\n\n• Check the Weather page for current conditions\n• Visit Crop Recommendation for planting advice\n• Explore Disease Detection for plant health issues\n\nIs there anything specific I can help you with using the information I have available?',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      toast.error('⚠️ Connection issue. Using offline mode.', {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick action
  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
    toast.success('💡 Prompt added!', {
      duration: 2000,
    });
  };

  // Clear chat
  const clearChat = () => {
    if (messages.length <= 1) {
      toast('Chat is already empty', {
        icon: 'ℹ️',
        duration: 2000,
      });
      return;
    }
    
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Chat cleared! 🔄 Ready for fresh farming questions!\n\n**🚀 I\'m your advanced AI assistant:**\n• Complete crop cultivation guides with costs\n• Smart disease & pest identification\n• Fertilizer schedules and soil advice\n• Image analysis for instant diagnosis\n• Context-aware follow-up conversations\n\n**Ask me anything like:**\n• "Banana farming guide for 2 acres"\n• "Why are my tomato leaves curling?"\n• "NPK schedule for wheat crop"\n\nWhat farming challenge can I solve for you?',
      timestamp: new Date()
    }]);
    setInput('');
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    toast.success('🗑️ Chat history cleared', {
      duration: 2000,
    });
  };

  // Start new chat session
  const startNewChat = () => {
    // Generate new session ID
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    localStorage.setItem('chatSessionId', newSessionId);
    
    // Reset messages
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Namaste! 🙏 Welcome to your advanced AI farming assistant!\n\nI\'m powered by Gemini AI and understand your questions naturally - even short messages, spelling mistakes, or mixed languages.\n\n**🌾 What I can do:**\n• **Complete crop guides** - Step-by-step cultivation from seed to harvest\n• **Smart problem solving** - Disease, pest, and soil issues\n• **Cost & yield planning** - Detailed financial analysis\n• **Image analysis** - Upload photos for instant diagnosis\n• **Document processing** - Analyze farming reports and data\n• **Context memory** - Remember our conversation for follow-ups\n\n**💡 Try asking:**\n• "How to grow tomatoes for 1 acre?"\n• "My wheat leaves are turning yellow"\n• "Best fertilizer schedule for rice"\n\nJust ask naturally - I\'ll understand! 😊',
      timestamp: new Date()
    }]);
    
    // Clear inputs
    setInput('');
    setSelectedImage(null);
    setSelectedFile(null);
    setImagePreview(null);
    
    toast.success('✨ New chat started!', {
      duration: 2000,
    });
  };

  // Copy message to clipboard
  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('📋 Copied to clipboard!', {
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="AI Farming Assistant"
          description="Get instant answers to your farming questions with AI-powered guidance"
          icon="🤖"
          backLink="/dashboard"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200"
            >
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-green-600" />
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="w-full flex items-center space-x-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all border border-green-200 text-sm"
                  >
                    <action.icon className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Suggested Prompts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200 max-h-96 overflow-y-auto"
            >
              <h3 className="text-sm font-bold text-gray-800 mb-3">💡 Suggested Questions</h3>
              <div className="space-y-1.5">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(prompt.text)}
                    className="w-full text-left text-xs hover:bg-green-50 p-2 rounded-lg transition-all border border-transparent hover:border-green-200 group"
                  >
                    <div className="text-xs text-green-600 font-semibold mb-0.5">{prompt.category}</div>
                    <div className="text-gray-700 group-hover:text-green-700 leading-tight">{prompt.text}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* New Chat Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all border border-green-200 hover:scale-105 active:scale-95 text-sm"
              title="Start a new conversation"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="font-semibold">New Chat</span>
            </motion.button>

            {/* Chat History Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => setIsHistoryOpen(true)}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all border border-blue-200 hover:scale-105 active:scale-95 text-sm"
              title="View chat history"
            >
              <ClockIcon className="w-4 h-4" />
              <span className="font-semibold">Chat History</span>
            </motion.button>

            {/* Clear Chat */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={clearChat}
              className="w-full flex items-center justify-center space-x-2 p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all border border-red-200 hover:scale-105 active:scale-95 text-sm"
              title="Clear chat history (Ctrl+L)"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="font-semibold">Clear Chat</span>
            </motion.button>
          </div>

          {/* Chat History Modal */}
          <ChatHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            currentSessionId={sessionId}
            onLoadSession={(newSessionId) => {
              setSessionId(newSessionId);
              localStorage.setItem('chatSessionId', newSessionId);
              toast.success('Session loaded! Continue your conversation.');
            }}
          />

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
              style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center animate-pulse">
                      <SparklesIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Assistant</h2>
                      <p className="text-sm text-green-100">Powered by Gemini AI • {messages.length - 1} messages</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold">Online</span>
                    </div>
                    {/* Keyboard shortcuts hint */}
                    <button
                      onClick={() => toast('⌨️ Shortcuts:\n• Ctrl+K: Focus input\n• Ctrl+L: Clear chat\n• Esc: Blur input', {
                        duration: 5000,
                      })}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all"
                      title="Keyboard shortcuts"
                    >
                      ⌨️
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-green-50 scroll-smooth">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow group relative ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-800'
                          }`}
                        >
                          {/* Copy button */}
                          {message.role === 'assistant' && !message.isStreaming && (
                            <button
                              onClick={() => copyMessage(message.content)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                              title="Copy message"
                            >
                              <DocumentIcon className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                          {/* Image Preview */}
                          {message.image && (
                            <div className="mb-3">
                              <img
                                src={message.image}
                                alt="Uploaded"
                                className="rounded-xl max-w-full h-auto"
                              />
                            </div>
                          )}

                          {/* File Info */}
                          {message.file && (
                            <div className="mb-3 flex items-center space-x-2 bg-white/10 p-2 rounded-lg">
                              <DocumentIcon className="w-5 h-5" />
                              <span className="text-sm">{message.file.name}</span>
                            </div>
                          )}

                          {/* Message Content */}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                            {message.isStreaming && (
                              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
                            )}
                          </p>

                          {/* Timestamp */}
                          {isMounted && (
                            <p className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading Indicator with AI thinking message */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border-2 border-green-200 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-medium">AI is analyzing...</span>
                          <p className="text-xs text-gray-400 mt-0.5">Using Gemini AI & Vector Database</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t-2 border-gray-200 p-4 bg-white">
                {/* Image/File Preview */}
                {(imagePreview || selectedFile) && (
                  <div className="mb-3 flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="flex items-center space-x-2 flex-1">
                        <DocumentIcon className="w-6 h-6 text-green-600" />
                        <span className="text-sm font-semibold text-gray-700">{selectedFile.name}</span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="ml-auto text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Input Box */}
                <div className="flex items-end space-x-3">
                  {/* Attachment Buttons */}
                  <div className="flex flex-col space-y-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isLoading}
                      className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Upload Image (for disease detection)"
                      aria-label="Upload image"
                    >
                      <PhotoIcon className="w-5 h-5" />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Upload Document"
                      aria-label="Upload document"
                    >
                      <DocumentIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Text Input */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Ask me anything about farming..."
                      rows={1}
                      maxLength={2000}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none resize-none transition-all max-h-32 overflow-y-auto"
                      style={{ minHeight: '48px' }}
                    />
                    {/* Character count */}
                    {input.length > 1800 && (
                      <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                        {input.length}/2000
                      </div>
                    )}
                  </div>

                  {/* Voice Button */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-200'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                    }`}
                    title={isRecording ? 'Stop Recording' : 'Voice Input'}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                  >
                    <MicrophoneIcon className="w-5 h-5" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || (!input.trim() && !selectedImage && !selectedFile)}
                    className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg"
                    title="Send message (Enter)"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Helper Text */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Shift+Enter</kbd> for new line
                  </p>
                  {isTyping && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                      <span>Typing...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
