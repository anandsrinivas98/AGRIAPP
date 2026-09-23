# Chatbot Full Documentation

This document provides a comprehensive overview of the chatbot feature, including its architecture, features, and API.

## 1. Overview

The AgriSense AI Chatbot is an intelligent farming assistant designed to provide users with instant, AI-powered guidance on a wide range of agricultural topics. It is a full-featured chatbot that supports real-time conversation, chat history, file uploads, voice input, and more.

Key features include:
-   **Conversational AI:** Powered by Google's Gemini Pro and other LLMs through OpenRouter.
-   **Rich Media Support:** Allows users to upload images for disease detection and other analyses. It also supports document uploads (.pdf, .doc, .docx, .txt, .csv).
-   **Voice Input:** Integrated with the Web Speech API for speech-to-text functionality.
-   **Chat History:** Saves conversation history, allowing users to pick up where they left off.
-   **Retrieval-Augmented Generation (RAG):** Utilizes a knowledge base to provide more accurate and context-aware responses.
-   **Rate Limiting:** Protects the backend from abuse with rate limiting on API endpoints.
-   **Real-time UI:** Built with React and Next.js for a modern and responsive user experience.

## 2. Architecture

The chatbot is built with a modern tech stack, featuring a React-based frontend and a Node.js backend.

### 2.1. Frontend

The frontend is a Next.js application written in TypeScript. The main components related to the chatbot are:

-   **`FloatingChatWidget`:** A floating widget that appears on all pages for authenticated users, providing easy access to the chatbot. It offers a more compact interface for quick questions.
-   **`ChatbotPage`:** A dedicated page for the full-featured chatbot interface, offering more space and features like suggested prompts and quick actions.
-   **`ChatHistoryModal`:** A modal component that allows users to view their past conversations and resume them.

The UI is built with Tailwind CSS and uses Framer Motion for animations.

### 2.2. Backend

The backend is a Node.js application built with Express and TypeScript. It uses Prisma as the ORM to interact with the database.

-   **`chatbot.ts`:** This is the core of the chatbot backend. It defines the API endpoints, handles incoming requests, and orchestrates the different services.
-   **Gemini Service:** A dedicated service to interact with the Google Gemini API for generating AI responses and analyzing images.
-   **Vector Service:** This service is responsible for creating and storing vector embeddings of images for similarity searches (though the full implementation seems to be a work in progress).
-   **Chat History Service:** Manages the storage and retrieval of chat history from the database.
-   **Cache Service:** Uses Redis to cache responses to common questions, reducing latency and API costs.
-   **Document Service:** Handles the processing of uploaded documents, chunking them into smaller pieces for easier analysis by the AI.

### 2.3. LLM Fallback Chain

To ensure high availability and minimize costs, the chatbot uses a fallback chain for its language models:

1.  **Redis Cache:** Checks for a cached response to the user's query first.
2.  **Gemini 1.5 Flash (primary):** The primary model for generating responses.
3.  **OpenRouter (fallback):** If the Gemini API fails or exceeds its quota, it falls back to a series of models on OpenRouter, such as Llama 3 and Mistral.
4.  **Static Fallback Response:** If all LLMs fail, a predefined static response is sent to the user.

## 3. Features in Detail

### 3.1. Real-time Chat

The chat interface provides a real-time experience, with messages appearing instantly. The streaming of AI responses is simulated on the frontend for a more natural feel.

### 3.2. Chat History

User conversations are saved to the database, linked to their session. Users can access their chat history through the "Chat History" modal and resume any previous conversation.

### 3.3. Image and File Upload

Users can upload images (e.g., of a diseased plant) or documents. The backend processes these files and uses them as context for the AI.
-   **Images:** Analyzed using Gemini Vision.
-   **Documents:** Processed by the `documentService`, which chunks the text and can use it in a RAG pipeline.

### 3.4. Voice Input

The chatbot supports voice input using the browser's Web Speech API. This allows users to speak their questions instead of typing them.

### 3.5. Retrieval-Augmented Generation (RAG)

The backend has a built-in agricultural knowledge base. When a user asks a question, the system can retrieve relevant information from this knowledge base and provide it to the LLM as context, resulting in more accurate and specific answers.

### 3.6. Rate Limiting

The `/api/chatbot` endpoint is rate-limited to 20 requests per 10 minutes per IP address to prevent abuse.

## 4. API Endpoints

The following API endpoints are defined in `backend/src/routes/chatbot.ts`:

-   `POST /api/chatbot`: The main endpoint for sending a message to the chatbot. It accepts a `multipart/form-data` request with the user's message, conversation history, and optional image or file uploads.
-   `GET /api/chatbot/history/:sessionId`: Retrieves the chat history for a given session.
-   `GET /api/chatbot/sessions`: Retrieves all chat sessions for the current user.
-   `DELETE /api/chatbot/history/:sessionId`: Clears the chat history for a given session.

## 5. Setup and Configuration

To run the chatbot, the following environment variables must be set in the backend's `.env` file:

-   `GEMINI_API_KEY`: Your API key for the Google Gemini API.
-   `OPENROUTER_API_KEY`: Your API key for OpenRouter.
-   `REDIS_URL`: The URL for your Redis instance (e.g., from Upstash).
-   `DISABLE_REDIS`: Set to `true` to disable Redis caching.

These variables are essential for the AI and caching functionalities of the chatbot.
