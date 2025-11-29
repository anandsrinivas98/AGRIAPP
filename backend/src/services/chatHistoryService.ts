import { PrismaClient } from '@prisma/client';
import { geminiService } from './geminiService';

const prisma = new PrismaClient();

interface CompressedMessage {
  role: 'user' | 'assistant';
  summary: string;
  timestamp: string;
}

interface ChatSession {
  sessionId: string;
  userId: string;
  messages: CompressedMessage[];
  contextMemory?: string; // Merged old context
}

class ChatHistoryService {
  private readonly MAX_MESSAGES = 15; // Keep last 15 exchanges
  private readonly MERGE_THRESHOLD = 10; // Merge when exceeding 10 messages

  /**
   * Compress a message (simple truncation for reliability)
   */
  private async compressMessage(message: string, role: 'user' | 'assistant'): Promise<string> {
    try {
      // Don't compress very short messages
      if (message.length < 150) {
        return message;
      }

      // Simple compression: truncate long messages
      // For user messages: keep first 150 chars
      // For assistant messages: keep first 300 chars
      const maxLength = role === 'user' ? 150 : 300;
      
      if (message.length > maxLength) {
        return message.substring(0, maxLength) + '...';
      }
      
      return message;
    } catch (error) {
      console.error('Compression error:', error);
      return message.substring(0, 200) + '...';
    }
  }

  /**
   * Get current timestamp in 12-hour format
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Merge old messages into compact context memory
   */
  private async mergeOldContext(messages: CompressedMessage[]): Promise<string> {
    try {
      const messagesToMerge = messages.slice(0, -5); // Keep last 5, merge the rest
      
      // Simple merge: just list the topics
      const topics = messagesToMerge
        .filter(m => m.role === 'user')
        .map(m => m.summary)
        .join(', ');
      
      return `Previous topics discussed: ${topics}`;
    } catch (error) {
      console.error('Merge error:', error);
      return 'Previous conversation about farming topics.';
    }
  }

  /**
   * Save a message to chat history with compression
   */
  async saveMessage(
    sessionId: string,
    userId: string,
    message: string,
    role: 'user' | 'assistant'
  ): Promise<void> {
    try {
      console.log(`💾 Saving message for session: ${sessionId}, role: ${role}`);
      
      // Compress the message
      const summary = await this.compressMessage(message, role);
      const timestamp = this.getTimestamp();

      // Get existing session or create new
      let session = await this.getSession(sessionId, userId);
      
      if (!session) {
        console.log(`📝 Creating new session: ${sessionId}`);
        session = {
          sessionId,
          userId,
          messages: [],
        };
      } else {
        console.log(`📂 Found existing session with ${session.messages.length} messages`);
      }

      // Add new compressed message
      session.messages.push({
        role,
        summary,
        timestamp,
      });

      // Check if we need to merge old context
      if (session.messages.length > this.MERGE_THRESHOLD) {
        console.log(`🔄 Merging old context (${session.messages.length} messages)`);
        const contextMemory = await this.mergeOldContext(session.messages);
        session.contextMemory = contextMemory;
        // Keep only last 5 messages
        session.messages = session.messages.slice(-5);
      }

      // Save to database (store as JSON)
      const result = await prisma.chatMessage.upsert({
        where: { sessionId },
        update: {
          message: JSON.stringify(session.messages),
          response: session.contextMemory || null,
        },
        create: {
          sessionId,
          message: JSON.stringify(session.messages),
          response: session.contextMemory || null,
        },
      });
      
      console.log(`✅ Message saved successfully for session: ${sessionId}`);
    } catch (error) {
      console.error('❌ Save message error:', error);
      throw error; // Re-throw to see the error in the API response
    }
  }

  /**
   * Get chat session
   */
  private async getSession(sessionId: string, userId: string): Promise<ChatSession | null> {
    try {
      const record = await prisma.chatMessage.findUnique({
        where: { sessionId },
      });

      if (!record) return null;

      return {
        sessionId,
        userId,
        messages: JSON.parse(record.message),
        contextMemory: record.response || undefined,
      };
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get conversation history for context (compressed format)
   */
  async getContextHistory(sessionId: string, userId: string): Promise<Array<{ role: 'user' | 'model'; parts: string }>> {
    try {
      const session = await this.getSession(sessionId, userId);
      if (!session) return [];

      const history: Array<{ role: 'user' | 'model'; parts: string }> = [];

      // Add context memory if exists
      if (session.contextMemory) {
        history.push({
          role: 'user',
          parts: `Previous context: ${session.contextMemory}`,
        });
        history.push({
          role: 'model',
          parts: 'Understood. I remember our previous conversation.',
        });
      }

      // Add recent compressed messages
      for (const msg of session.messages) {
        history.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: msg.summary,
        });
      }

      return history;
    } catch (error) {
      console.error('Get context history error:', error);
      return [];
    }
  }

  /**
   * Get full readable chat history for display
   */
  async getReadableHistory(sessionId: string, userId: string): Promise<Array<{
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }>> {
    try {
      const session = await this.getSession(sessionId, userId);
      if (!session) return [];

      const readable: Array<{ role: 'user' | 'assistant'; message: string; timestamp: string }> = [];

      // Add context memory as a summary card
      if (session.contextMemory) {
        readable.push({
          role: 'assistant',
          message: `📝 Earlier conversation summary:\n${session.contextMemory}`,
          timestamp: 'Earlier',
        });
      }

      // Add recent messages (these are already compressed summaries)
      for (const msg of session.messages) {
        readable.push({
          role: msg.role,
          message: msg.summary,
          timestamp: msg.timestamp,
        });
      }

      return readable;
    } catch (error) {
      console.error('Get readable history error:', error);
      return [];
    }
  }

  /**
   * Clear chat history for a session
   */
  async clearHistory(sessionId: string): Promise<void> {
    try {
      console.log(`🗑️  Deleting session: ${sessionId}`);
      const result = await prisma.chatMessage.delete({
        where: { sessionId },
      });
      console.log(`✅ Session deleted successfully: ${sessionId}`);
      return;
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log(`⚠️  Session not found: ${sessionId}`);
        // Session doesn't exist, that's okay
        return;
      }
      console.error('❌ Clear history error:', error);
      throw error;
    }
  }

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId: string): Promise<Array<{
    sessionId: string;
    lastMessage: string;
    timestamp: string;
  }>> {
    try {
      // Get all sessions (we'll filter by userId later if needed)
      // For now, return all sessions since sessionId doesn't include userId
      const sessions = await prisma.chatMessage.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });

      console.log(`Found ${sessions.length} sessions in database`);

      return sessions.map(s => {
        try {
          const messages = JSON.parse(s.message) as CompressedMessage[];
          const lastMsg = messages[messages.length - 1];
          
          return {
            sessionId: s.sessionId,
            lastMessage: lastMsg?.summary || 'New conversation',
            timestamp: lastMsg?.timestamp || 'Unknown',
          };
        } catch (error) {
          console.error('Error parsing session:', error);
          return {
            sessionId: s.sessionId,
            lastMessage: 'Error loading message',
            timestamp: 'Unknown',
          };
        }
      });
    } catch (error) {
      console.error('Get user sessions error:', error);
      return [];
    }
  }
}

export const chatHistoryService = new ChatHistoryService();
