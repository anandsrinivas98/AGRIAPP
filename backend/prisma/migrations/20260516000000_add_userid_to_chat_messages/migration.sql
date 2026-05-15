-- Add userId column to chat_messages table
ALTER TABLE "chat_messages" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'guest';

-- Create index for fast per-user lookups
CREATE INDEX "chat_messages_userId_idx" ON "chat_messages"("userId");
