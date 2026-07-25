# Testing the AI Chat Feature

## Quick Start Test

### 1. Setup Your API Key
Before testing, make sure your `.env` file has a valid Groq API key:

```env
GROQ_API_KEY="gsk_your_actual_api_key_here"
```

Get your API key from: https://console.groq.com

### 2. Start the Server
Run the development server:

```bash
npm run dev
```

You should see:
```
Persona Journal server running on http://0.0.0.0:3000
```

### 3. Access the Application
Open your browser and go to:
```
http://localhost:3000
```

### 4. Unlock the App
Enter your PIN (default is `1234`)

### 5. Create or Open a Journal
- Click "New Entry" or open an existing journal
- You should see the message input with placeholder: "What's on your mind? (Type @ to ask AI)"

## Test Scenarios

### Test 1: Basic AI Query
1. Type: `@Hello, can you hear me?`
2. Press Enter or click Send
3. Expected result:
   - Your message appears with a light blue background and blue border
   - Below it, an AI response appears with a purple gradient background
   - AI is labeled as "🤖 ai assistant"

### Test 2: Context Awareness
1. Send a regular message: `I had a great day at work`
2. Send another: `I finished my big project`
3. Now ask AI: `@Can you help me celebrate this achievement?`
4. Expected result:
   - AI should reference your previous messages about work and the project
   - Response should acknowledge your accomplishment

### Test 3: Multiple AI Interactions
1. Ask: `@What are 3 things I should be grateful for?`
2. After AI responds, ask: `@Can you explain the first one more?`
3. Expected result:
   - AI remembers the previous response
   - AI elaborates on the first item from its previous list

### Test 4: Context Window (Last 5 Messages)
1. Send 6 regular messages (any content)
2. Ask: `@What did I just say?`
3. Expected result:
   - AI should summarize only the last 5 messages
   - First message should not be included in AI's summary

### Test 5: Error Handling - No API Key
1. Remove or invalidate the `GROQ_API_KEY` in `.env`
2. Restart server
3. Try: `@test`
4. Expected result:
   - Error message: "Groq API key not configured. Please add GROQ_API_KEY to your .env file"

### Test 6: Mixed Conversation
1. Send regular message: `Today was tough`
2. Ask AI: `@Why do I feel this way?`
3. Send regular message: `Thanks for the insight`
4. Ask AI: `@What should I do tomorrow?`
5. Expected result:
   - Regular and AI messages intermixed naturally
   - AI maintains context of the entire conversation

## Visual Verification

### AI Response Styling
✅ Purple gradient background (`#667eea` to `#764ba2`)  
✅ White text color  
✅ Subtle shadow effect  
✅ Centered in the message area  
✅ Name displays as "🤖 ai assistant" in purple  

### User AI Query Styling
✅ Light blue background (`#f0f4ff`)  
✅ Blue border (`#667eea`)  
✅ Dark text color  
✅ Starts with `@` symbol  
✅ Centered in the message area  

### Regular Messages
✅ Standard styling (white background, black border)  
✅ Centered layout  
✅ Persona name displayed  

## Browser Console Inspection

Open browser DevTools (F12) and check for:

### Successful AI Call
```javascript
// Network tab should show:
POST /api/ai-chat
Status: 200 OK

// Response:
{
  "success": true,
  "response": "AI's answer...",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

### Console Logs
No errors should appear. If you see errors, check:
- API key is valid
- Server is running
- Network connection is active

## API Testing (Advanced)

### Direct API Call
You can test the endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "response": "Hello! How can I help you with your journaling today?",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 12,
    "total_tokens": 57
  }
}
```

## Troubleshooting

### Issue: "AI is thinking..." never goes away
**Cause**: API call failed or network issue  
**Fix**: 
- Check browser console for errors
- Verify API key is valid
- Check network connection
- Refresh the page and try again

### Issue: No AI response appears
**Cause**: JavaScript error or API error  
**Fix**:
- Open browser console (F12)
- Look for error messages
- Check if API key is set correctly
- Restart the server

### Issue: AI doesn't remember context
**Cause**: Journal not saving properly  
**Fix**:
- Check if messages are being saved to the journal
- Verify database connection (MongoDB or JSON)
- Try refreshing the page

### Issue: Messages not styled correctly
**Cause**: CSS not loading or class names wrong  
**Fix**:
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check if `style.css` is loading in Network tab
- Inspect element to verify classes are applied

## Performance Testing

### Response Time
Typical response times:
- **Query processing**: <100ms
- **Groq API call**: 500-1500ms
- **Total time**: 600-1600ms

If responses take longer than 3 seconds:
- Check internet connection
- Verify Groq API status
- Consider rate limiting issues

### Token Usage
Monitor token usage in the response:
```json
"usage": {
  "prompt_tokens": 50,    // Your message + context
  "completion_tokens": 100, // AI's response
  "total_tokens": 150      // Total
}
```

Groq free tier limits:
- Check current limits at https://console.groq.com

## Success Criteria

✅ AI responds within 2 seconds  
✅ AI messages have purple gradient styling  
✅ User AI queries have blue styling  
✅ Context of last 5 messages is maintained  
✅ Mixed conversations work seamlessly  
✅ Messages persist in journal  
✅ No console errors  
✅ Loading indicator shows while waiting  

## Next Steps After Testing

Once testing is successful:
1. Experiment with different question types
2. Try using AI for journaling prompts
3. Ask AI for reflection questions
4. Use AI to analyze your mood patterns
5. Get suggestions for personal growth

---

**Happy Testing! 🚀**

Report any issues or unexpected behavior for further refinement.
