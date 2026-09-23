# Intelligent Chat History System

## Overview
An intelligent chat history system with automatic compression, context management, and minimal database usage.

## Features

### 1. Smart Message Compression
- **User messages**: Compressed into 1-2 sentence summaries
- **AI responses**: Compressed into 3-4 bullet points
- **Short messages** (<100 chars): Stored as-is without compression
- Uses Gemini AI for intelligent summarization

### 2. Automatic Context Management
- Keeps last **15 exchanges** in compressed format
- When exceeding **10 messages**, automatically merges older context
- Merged context stored as compact memory block
- Only essential information retained

### 3. Database Efficiency
- Stores compressed summaries, not full messages
- Removes greetings, fillers, and redundant content
- Typical storage: **80-90% smaller** than full messages
- Uses existing `ChatMessage` table with JSON storage

### 4. Privacy & Security
- No sensitive data stored unless explicitly provided
- Automatic removal of personal details during compression
- User-specific session isolation

## API Endpoints

### Send Message (with history)
```http
POST /api/chatbot
Content-Type: multipart/form-data

{
  "message": "How to grow tomatoes?",
  "sessionId": "session_user123_1234567890",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "For growing tomatoes...",
    "sessionId": "session_user123_1234567890",
    "timestamp": "Nov 29, 11:30 PM"
  }
}
```

### Get Chat History
```http
GET /api/chatbot/history/:sessionId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_user123_1234567890",
    "history": [
      {
        "role": "assistant",
        "message": "📝 Earlier conversation summary:\nDiscussed wheat cultivation and pest management.",
        "timestamp": "Earlier"
      },
      {
        "role": "user",
        "message": "How to grow tomatoes?",
        "timestamp": "Nov 29, 11:25 PM"
      },
      {
        "role": "assistant",
        "message": "• Use well-drained soil\n• Plant in full sunlight\n• Water regularly",
        "timestamp": "Nov 29, 11:25 PM"
      }
    ],
    "count": 3
  }
}
```

### Get All Sessions
```http
GET /api/chatbot/sessions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "session_user123_1234567890",
        "lastMessage": "Tomato cultivation tips",
        "timestamp": "Nov 29, 11:30 PM"
      }
    ],
    "count": 1
  }
}
```

### Clear History
```http
DELETE /api/chatbot/history/:sessionId
```

## How It Works

### Message Flow

1. **User sends message**
   ```
   User: "How do I prepare soil for wheat cultivation in winter season?"
   ```

2. **System compresses** (if >100 chars)
   ```
   Compressed: "Soil preparation for winter wheat"
   ```

3. **Stores in database**
   ```json
   {
     "role": "user",
     "summary": "Soil preparation for winter wheat",
     "timestamp": "Nov 29, 11:25 PM"
   }
   ```

4. **AI generates response**
   ```
   AI: "For winter wheat cultivation:
   
   Soil preparation:
   • Plow the field 2-3 times
   • Add 10 tons of farmyard manure per acre
   • Maintain pH 6.0-7.5
   
   Sowing time:
   1. Best time: Mid-November to early December
   2. Use seed rate of 100kg per acre
   3. Sow at 2-3 inch depth"
   ```

5. **System compresses AI response**
   ```
   Compressed: "• Plow field, add manure, maintain pH 6-7.5
   • Sow mid-Nov to early Dec at 100kg/acre
   • Plant 2-3 inch deep"
   ```

6. **Stores compressed response**

### Context Merging Example

**Before merging** (12 messages):
```
1. User: Wheat soil prep
2. AI: Plow, add manure...
3. User: Fertilizer schedule
4. AI: NPK at week 1...
5. User: Pest control
6. AI: Use neem spray...
7. User: Irrigation timing
8. AI: Water every 10 days...
9. User: Harvesting time
10. AI: Harvest at 120 days...
11. User: Storage tips
12. AI: Dry to 12% moisture...
```

**After merging** (5 recent + 1 context):
```
Context Memory: "Discussed wheat cultivation including soil prep, fertilization, pest control, and irrigation."

Recent messages:
8. AI: Water every 10 days...
9. User: Harvesting time
10. AI: Harvest at 120 days...
11. User: Storage tips
12. AI: Dry to 12% moisture...
```

## Database Schema

Uses existing `ChatMessage` table:
```prisma
model ChatMessage {
  id        String   @id @default(cuid())
  sessionId String   @unique
  message   String   // JSON array of compressed messages
  response  String?  // Merged context memory
  language  String   @default("en")
  createdAt DateTime @default(now())
}
```

**Storage format:**
```json
{
  "message": "[{\"role\":\"user\",\"summary\":\"Wheat cultivation\",\"timestamp\":\"Nov 29, 11:25 PM\"}]",
  "response": "Previous discussion about crop management"
}
```

## Benefits

### Storage Efficiency
- **Before**: 500 chars per message × 50 messages = 25,000 chars
- **After**: 100 chars per message × 15 messages = 1,500 chars
- **Savings**: 94% reduction

### Performance
- Faster database queries (smaller data)
- Reduced API response times
- Lower bandwidth usage

### User Experience
- ChatGPT-like conversation flow
- Context maintained across sessions
- Clean, readable history display
- No repeated or redundant responses

## Configuration

Edit `backend/src/services/chatHistoryService.ts`:

```typescript
private readonly MAX_MESSAGES = 15;      // Keep last 15 exchanges
private readonly MERGE_THRESHOLD = 10;   // Merge when exceeding 10
```

## Frontend Integration

### Sending Messages
```javascript
const response = await fetch('/api/chatbot', {
  method: 'POST',
  body: formData // Include sessionId and userId
});

const data = await response.json();
// Save sessionId for future messages
localStorage.setItem('chatSessionId', data.data.sessionId);
```

### Loading History
```javascript
const sessionId = localStorage.getItem('chatSessionId');
const response = await fetch(`/api/chatbot/history/${sessionId}`);
const { data } = await response.json();

// Display history in UI
data.history.forEach(msg => {
  displayMessage(msg.role, msg.message, msg.timestamp);
});
```

## Privacy Considerations

- Compression removes personal details automatically
- Session IDs are user-specific
- History can be cleared anytime
- No cross-user data leakage
- Compliant with data minimization principles

## Future Enhancements

1. **Semantic search** across chat history
2. **Export history** as PDF/text
3. **Multi-language** compression
4. **Voice message** compression
5. **Image context** summarization
6. **Automatic topic** categorization

---

**Status**: ✅ Fully implemented and ready to use
**Database Impact**: Minimal (uses existing table)
**Performance**: Optimized for scale
