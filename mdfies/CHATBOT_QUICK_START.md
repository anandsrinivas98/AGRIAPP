# AI Chatbot - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Gemini API Key (2 minutes)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Step 2: Configure Backend (1 minute)

```bash
# Navigate to backend
cd backend

# Create .env file
cp .env.example .env

# Edit .env and add your key
# GEMINI_API_KEY=your_key_here
```

### Step 3: Install Dependencies (1 minute)

```bash
# Already installed! But if needed:
npm install
```

### Step 4: Start Application (1 minute)

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Step 5: Test Chatbot

1. Open http://localhost:3000
2. Go to Dashboard → AI ChatBot
3. Ask: "How do I improve my soil quality?"
4. Upload an image of a plant
5. Try voice input

## ✅ What's Working

- ✅ Real Gemini API responses
- ✅ Vector database (auto-initialized)
- ✅ Image analysis with AI
- ✅ File processing
- ✅ Voice input
- ✅ Quick actions
- ✅ Suggested prompts
- ✅ Conversation history

## 🎯 Key Features

### Text Chat
- Ask any farming question
- Get AI-powered answers
- Context-aware responses

### Image Upload
- Upload crop/pest/soil images
- AI analyzes with Gemini Vision
- Get treatment recommendations

### File Upload
- Upload soil reports (PDF, DOC)
- AI extracts key information
- Get personalized advice

### Voice Input
- Click microphone icon
- Speak your question
- Auto-converts to text

## 💡 Try These Prompts

1. "What are the signs of nitrogen deficiency?"
2. "Best irrigation practices for rice"
3. "How to treat powdery mildew?"
4. [Upload plant image] "What disease is this?"
5. [Upload soil report] "Analyze this report"

## 🔧 Troubleshooting

### "AI service configuration error"
→ Add GEMINI_API_KEY to backend/.env

### "Connection failed"
→ Check backend is running on port 5000

### "Image upload failed"
→ Image must be under 10MB

### "Voice not working"
→ Allow microphone permission in browser

## 📚 Documentation

- Full Guide: `CHATBOT_UPGRADE_GUIDE.md`
- API Docs: `AI_CHATBOT_DOCUMENTATION.md`
- Setup: `CHATBOT_SETUP_GUIDE.md`

## 🎉 You're Ready!

The chatbot is now powered by:
- Google Gemini AI (gemini-pro & gemini-pro-vision)
- ChromaDB vector database
- Intelligent RAG system
- Advanced image analysis
- Smart file processing

Start chatting and help farmers grow better crops! 🌾
