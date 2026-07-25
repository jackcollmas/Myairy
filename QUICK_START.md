# Quick Start Guide - Myairy Features

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Edit your `.env` file:

```env
# Security PIN (default: 1234)
PIN_CODE="1234"

# MongoDB (optional - falls back to local JSON file)
MONGODB_URI="your_mongodb_uri_here"

# Groq API for AI Chat
GROQ_API_KEY="gsk_your_groq_api_key_here"

# Cloudinary for Image Uploads
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Start the Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📝 Basic Features

### Creating Personas
1. Click **"Personas"** in sidebar
2. Click **"+ Add Persona"**
3. Enter name and description
4. Click **"Save"**

**Examples:**
- "Thoughtful Me" - For deep reflection
- "Creative Me" - For brainstorming ideas
- "Grateful Me" - For daily gratitude

### Creating Journal Entries
1. Click **"Dashboard"** in sidebar
2. Click **"+ New Entry"**
3. Enter a title (e.g., "Monday Reflections")
4. Click **"Create"**

### Writing Messages
1. Open a journal entry
2. Select a persona from dropdown
3. Type your message
4. Press **Enter** or click **"Send"**

---

## 🤖 AI Chat Feature

### How to Use AI
Simply start any message with **@** symbol:

**Examples:**

```
@What are three things I should focus on today?
```

```
@Can you help me process my feelings about this situation?
```

```
@Give me a creative writing prompt
```

### AI Features
- ✅ Sees last **5 messages** for context
- ✅ Conversational and empathetic
- ✅ Fast responses (~1-2 seconds)
- ✅ Distinguished with **purple gradient** styling

### Setup Required
1. Get API key: https://console.groq.com
2. Add to `.env`: `GROQ_API_KEY="gsk_..."`
3. Restart server
4. Start chatting!

---

## 📷 Image Upload Feature

### How to Upload Images
1. Open a journal entry
2. Click the **📷** camera button
3. Select an image from your device
4. **Preview** appears
5. *(Optional)* Add a caption in the text box
6. Click **"Send Image"**

### Viewing Images
- **In Journal**: Images appear inline with messages
- **Fullscreen**: Click any image to zoom
- **Close**: Click anywhere to exit fullscreen

### Image Features
- ✅ Supports: **JPEG, PNG, GIF, WebP**
- ✅ Max size: **10 MB**
- ✅ Auto-optimized by Cloudinary
- ✅ Fast loading via CDN
- ✅ Add captions to images

### Setup Required
1. Create free account: https://cloudinary.com/users/register_free
2. Get credentials from dashboard
3. Add to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="your_name"
   CLOUDINARY_API_KEY="your_key"
   CLOUDINARY_API_SECRET="your_secret"
   ```
4. Restart server
5. Start uploading!

---

## 💡 Cool Combinations

### Text + AI
```
I had a productive meeting today.

@Can you help me identify what made it successful?
```

### Image + Caption
1. Upload photo of sunset
2. Add caption: "Beautiful ending to a hectic day"

### Image + AI
1. Upload photo
2. Caption: "Made this recipe today"
3. Then ask: `@What side dishes would pair well with this?`

### Multiple Personas + AI
Switch between different personas and use AI to reflect on different perspectives:

```
[Thoughtful Me]: Had a tough conversation at work

[Creative Me]: Maybe I should approach it differently next time

@What are some creative ways to handle difficult conversations?
```

---

## 🎨 Visual Guide

### Entry Composer Layout
```
┌──────────────────────────────────────────────────────┐
│ [Persona Dropdown ▼] [Type message...] [📷] [Send]   │
└──────────────────────────────────────────────────────┘
```

### Message Types

**Regular Message:**
```
╭─────────────────────────────────────╮
│         thoughtful me               │
│                                     │
│  Had a great day at work today!    │
╰─────────────────────────────────────╯
```

**AI Query (@):**
```
╭─────────────────────────────────────╮
│         thoughtful me               │  ← Blue border
│                                     │
│  @What should I focus on tomorrow? │
╰─────────────────────────────────────╯
```

**AI Response:**
```
╭─────────────────────────────────────╮
│      🤖 ai assistant                │  ← Purple gradient
│                                     │
│  Based on your message, I'd        │
│  suggest focusing on...            │
╰─────────────────────────────────────╯
```

**Image Message:**
```
╭─────────────────────────────────────╮
│         creative me                 │
│                                     │
│  Check out this inspiration!       │
│  ┌───────────────────────────┐    │
│  │                           │    │
│  │      [Image Preview]      │    │
│  │                           │    │
│  └───────────────────────────┘    │
╰─────────────────────────────────────╯
```

---

## 🔧 Troubleshooting

### AI Not Working
**Problem**: "Groq API key not configured"  
**Fix**: Add `GROQ_API_KEY` to `.env` and restart server

**Problem**: AI doesn't respond  
**Fix**: Check console (F12) for errors, verify API key is valid

### Images Not Uploading
**Problem**: "Cloudinary not configured"  
**Fix**: Add all three Cloudinary credentials to `.env` and restart

**Problem**: Upload fails  
**Fix**: Check file size (<10 MB) and format (JPEG/PNG/GIF/WebP)

### General Issues
- **Refresh the page** (Ctrl+R or Cmd+R)
- **Check browser console** (F12) for errors
- **Restart the server** after `.env` changes
- **Clear browser cache** if styling looks wrong

---

## 📊 Feature Comparison

| Feature | Basic | With Groq | With Cloudinary | Full Setup |
|---------|-------|-----------|-----------------|------------|
| Text journaling | ✅ | ✅ | ✅ | ✅ |
| Multiple personas | ✅ | ✅ | ✅ | ✅ |
| AI chat | ❌ | ✅ | ❌ | ✅ |
| Image uploads | ❌ | ❌ | ✅ | ✅ |
| Context-aware AI | ❌ | ✅ | ❌ | ✅ |
| Image + AI combo | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Usage Examples

### Daily Journaling
```
[Morning - Grateful Me]: 
☀️ Three things I'm grateful for today:
1. Coffee
2. Good weather
3. Supportive friends

[Afternoon - Productive Me]:
Finished the big project! 📊

@What should I do to celebrate this achievement?

[🤖 AI Assistant]:
Celebrating achievements is important! Here are some ideas...
```

### Reflection with Images
```
[Evening - Thoughtful Me]:
📷 [sunset image]
"What a day. Time to wind down."

@Help me reflect on what went well today

[🤖 AI Assistant]:
Let's reflect together. What moments stood out to you?
```

### Creative Brainstorming
```
[Creative Me]:
Thinking about starting a new project...

@Give me 5 creative project ideas

[🤖 AI Assistant]:
Here are 5 creative project ideas:
1. ...
2. ...

[Creative Me]:
📷 [sketch image]
"Started working on #2!"
```

---

## 📚 Further Documentation

- **AI Setup**: See `AI_CHAT_SETUP.md`
- **Image Setup**: See `CLOUDINARY_SETUP.md`
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Image Implementation**: See `IMAGE_UPLOAD_IMPLEMENTATION.md`

---

## 🎉 Tips & Best Practices

### For Better AI Responses
- Provide context in your messages
- Be specific with questions
- Use follow-up questions
- Mix personas for different perspectives

### For Great Photo Journals
- Add meaningful captions
- Use images to capture moments
- Mix text and images
- Ask AI to help reflect on images

### For Organized Journaling
- Create themed personas
- Use descriptive journal titles
- Regular entries (daily/weekly)
- Review past entries occasionally

---

**Enjoy your enhanced journaling experience! 📝✨📷🤖**
