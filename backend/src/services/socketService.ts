import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketIO = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Handle forum real-time updates
    socket.on('join_forum', (forumId: string) => {
      socket.join(`forum:${forumId}`);
    });

    socket.on('leave_forum', (forumId: string) => {
      socket.leave(`forum:${forumId}`);
    });

    // Handle chat messages
    socket.on('chat_message', (data: { message: string; [key: string]: any }) => {
      // Broadcast to AI assistant or other users
      socket.broadcast.emit('chat_response', {
        message: data.message,
        timestamp: new Date().toISOString(),
        userId: socket.userId,
      });
    });

    // Handle notifications
    socket.on('mark_notification_read', (notificationId: string) => {
      // Update notification status
      socket.to(`user:${socket.userId}`).emit('notification_updated', {
        id: notificationId,
        read: true,
      });
    });

    // Handle weather alerts
    socket.on('subscribe_weather_alerts', (location: { lat: number; lon: number }) => {
      socket.join(`weather:${location.lat}:${location.lon}`);
    });

    // Handle price alerts
    socket.on('subscribe_price_alerts', (crop: string) => {
      socket.join(`price:${crop}`);
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
};

// Utility functions for emitting events
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

export const emitToForum = (io: Server, forumId: string, event: string, data: any) => {
  io.to(`forum:${forumId}`).emit(event, data);
};

export const emitWeatherAlert = (io: Server, lat: number, lon: number, alert: any) => {
  io.to(`weather:${lat}:${lon}`).emit('weather_alert', alert);
};

export const emitPriceAlert = (io: Server, crop: string, priceData: any) => {
  io.to(`price:${crop}`).emit('price_alert', priceData);
};