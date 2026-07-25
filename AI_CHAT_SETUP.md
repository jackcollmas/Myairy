# AI Chat Feature Setup Guide

## Overview
Your Myairy journal app now has AI chat functionality powered by Groq! You can have conversations with an AI assistant directly within your journal entries by simply typing `@` followed by your question.

## Features
✅ **@-trigger**: Type `@` at the start of your message to activate AI chat  
✅ **Context-aware**: AI has access to the last 5 messages in the conversation  
✅ **Clean JSON structure**: Messages are properly formatted and sent to Groq API  
✅ **Visual distinction**: AI messages have a beautiful purple gradient background  
✅ **Seamless integration**: Works within your existing journal interface  

## Setup Instructions

### 1. Get Your Groq API Key
1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure Your Environment
Open your `.env` file and replace `your_groq_api_key_here` with your actual API key:

```env
GROQ_API_KEY="gsk_your_actual_api_key_here"
```

### 3. Start the Server
Run the development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

## How to Use

### Starting an AI Conversation
1. Open or create a journal entry
2. In the message input box, type `@` followed by your question
3. Example: `@What are some healthy breakfast ideas?`
4. Press Send or hit Enter

### How It Works
- **User message**: Your `@question` is saved to the journal with a blue border
- **AI response**: The AI's answer appears with a purple gradient background
- **Context**: The AI can see your last 5 messages for better context
- **Persona**: The AI appears as "🤖 AI Assistant" in your journal

### Example Conversation
```
You: @Can you help me reflect on my day?
AI Assistant: I'd be happy to help you reflect! What aspects of your day would you like to explore?
You: @I felt really productive today
AI Assistant: That's wonderful! Feeling productive is energizing. What specific accomplishments are you most proud of?
```

## Technical Details

### API Endpoint
- **URL**: `/api/ai-chat`
- **Method**: POST
- **Body**: 
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your question here"
    }
  ]
}
```

### Response Format
```json
{
  "success": true,
  "response": "AI's answer here",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

### Context Structure
The AI receives the last 5 messages in this format:
```json
[
  {
    "role": "user",
    "content": "PersonaName: Message content",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

## Model Information
- **Model**: llama-3.3-70b-versatile
- **Provider**: Groq (ultra-fast inference)
- **Max Tokens**: 1024
- **Temperature**: 0.7 (balanced creativity)

## Troubleshooting

### "Groq API key not configured" error
- Make sure you've added `GROQ_API_KEY` to your `.env` file
- Restart the server after updating `.env`

### AI not responding
- Check your API key is valid
- Verify you have internet connection
- Check the browser console for errors
- Ensure the message starts with `@`

### Rate limiting
- Groq has generous rate limits on their free tier
- If you hit limits, wait a few minutes and try again

## Cost & Limits
- Groq offers a **free tier** with generous limits
- llama-3.3-70b-versatile is one of their fastest models
- Check [Groq Pricing](https://groq.com/pricing) for current limits

## Privacy Note
- Your journal messages are sent to Groq's API for AI processing
- Only the last 5 messages are sent for context
- Messages are not stored by Groq beyond processing
- Your journal data remains in your local database

## Future Enhancements
Potential features to add:
- [ ] Adjust number of context messages (currently fixed at 5)
- [ ] Choose different AI models
- [ ] AI suggestions based on mood/sentiment
- [ ] Export AI conversations
- [ ] AI-powered journal prompts

---

**Enjoy your AI-powered journaling experience! 🚀**
