'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinForum: (forumId: string) => void;
  leaveForum: (forumId: string) => void;
  sendChatMessage: (message: string) => void;
  subscribeToWeatherAlerts: (location: { lat: number; lon: number }) => void;
  subscribeToPriceAlerts: (crop: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const token = localStorage.getItem('token');
      
      // Only connect if we have a valid token
      if (!token) {
        console.log('No token available, skipping socket connection');
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('⚠️ Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        // Silently handle authentication errors for unauthenticated users
        if (error.message === 'Authentication error') {
          console.log('Socket authentication pending - user may need to log in');
        } else {
          console.error('Connection error:', error);
        }
        setIsConnected(false);
      });

      // Listen for real-time events
      newSocket.on('forum_post_created', (data) => {
        // Handle new forum post
        console.log('New forum post:', data);
      });

      newSocket.on('forum_comment_created', (data) => {
        // Handle new forum comment
        console.log('New forum comment:', data);
      });

      newSocket.on('chat_response', (data) => {
        // Handle chat response
        console.log('Chat response:', data);
      });

      newSocket.on('notification', (data) => {
        // Handle notifications
        console.log('New notification:', data);
      });

      newSocket.on('weather_alert', (data) => {
        // Handle weather alerts
        console.log('Weather alert:', data);
      });

      newSocket.on('price_alert', (data) => {
        // Handle price alerts
        console.log('Price alert:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect socket if not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  const joinForum = (forumId: string) => {
    if (socket) {
      socket.emit('join_forum', forumId);
    }
  };

  const leaveForum = (forumId: string) => {
    if (socket) {
      socket.emit('leave_forum', forumId);
    }
  };

  const sendChatMessage = (message: string) => {
    if (socket) {
      socket.emit('chat_message', { message });
    }
  };

  const subscribeToWeatherAlerts = (location: { lat: number; lon: number }) => {
    if (socket) {
      socket.emit('subscribe_weather_alerts', location);
    }
  };

  const subscribeToPriceAlerts = (crop: string) => {
    if (socket) {
      socket.emit('subscribe_price_alerts', crop);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinForum,
    leaveForum,
    sendChatMessage,
    subscribeToWeatherAlerts,
    subscribeToPriceAlerts,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}