# Message Interactions Guide - WhatsApp-Style Features

## 🎉 What's New

Your Myairy journal now has full WhatsApp-style message interactions! You can edit, delete, reply to messages, and add emoji reactions.

---

## ✨ Features Implemented

### 1. **Persona Management**
- ✅ Edit persona details (name, icon, description, color)
- ✅ Delete personas with confirmation dialog
- ✅ Hover to reveal edit/delete buttons
- ✅ Messages from deleted personas remain in journals

### 2. **Message Context Menu**
- ✅ Right-click (desktop) or long-press (mobile) on messages
- ✅ Shows 4 options: React, Reply, Edit, Delete
- ✅ Edit only available within 15 minutes
- ✅ Clean, minimal design

### 3. **Message Editing**
- ✅ Edit messages within 15 minutes of sending
- ✅ Shows "(edited)" indicator
- ✅ No edit history (WhatsApp-style)
- ✅ Press Escape to cancel editing
- ✅ Input field highlights in orange when editing

### 4. **Message Deletion**
- ✅ Soft delete with 5-second undo window
- ✅ Undo toast appears at bottom of screen
- ✅ Deleted messages show "This message was deleted"
- ✅ Deleted messages have dashed border
- ✅ Context menu hidden on deleted messages

### 5. **Message Replies**
- ✅ Reply to any message
- ✅ Shows quoted preview above your message
- ✅ Click preview to scroll to original message
- ✅ Visual highlight when scrolling to message
- ✅ Cancel reply with Escape key

### 6. **Emoji Reactions**
- ✅ 6 default emojis: 👍 ❤️ 😂 😮 😢 🙏
- ✅ Click any reaction to toggle on/off
- ✅ Reactions grouped by emoji with count
- ✅ Your reactions highlighted in blue
- ✅ Reactions display below message content

---

## 📱 How to Use

### Edit a Message
1. **Right-click** (or long-press on mobile) the message
2. Select **"Edit"** from the menu
3. Message content loads into input field
4. Edit your text and press **Enter** to save
5. Press **Escape** to cancel

**Note**: Only available within 15 minutes of sending

### Delete a Message
1. **Right-click** (or long-press) the message
2. Select **"Delete"** from the menu
3. Message is soft-deleted immediately
4. **Undo toast** appears for 5 seconds at bottom
5. Click **"Undo"** to restore if needed
6. After 5 seconds, message shows as deleted

### Reply to a Message
1. **Right-click** (or long-press) the message
2. Select **"Reply"** from the menu
3. Input field shows preview: "Replying to..."
4. Type your reply and press **Enter**
5. Your message shows with quoted preview above
6. Click the preview to jump to original message

### Add Reactions
1. **Right-click** (or long-press) the message
2. Select **"React"** from the menu
3. **Reaction picker** appears with 6 emojis
4. Click an emoji to react
5. Click **existing reaction bubble** to remove your reaction
6. Reactions appear below message with count

### Edit/Delete Personas
1. Go to **"Personas"** tab in sidebar
2. **Hover over persona card** to reveal buttons
3. Click **✏️ Edit** to modify details
4. Click **🗑️ Delete** to remove (with confirmation)

---

## 🎨 Visual Indicators

### Message States

**Regular Message**
```
┌─────────────────────────────┐
│  👤 persona name            │
│                             │
│  Message content here       │
└─────────────────────────────┘
```

**Edited Message**
```
┌─────────────────────────────┐
│  👤 persona name            │
│                             │
│  Message content (edited)   │
└─────────────────────────────┘
```

**Deleted Message**
```
╭ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╮
┆  👤 persona name            ┆
┆                             ┆
┆  This message was deleted   ┆
╰ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╌ ╯
```

**Message with Reply**
```
┌─────────────────────────────┐
│  👤 persona name            │
│  ┌───────────────────────┐  │
│  │ ↩️ original sender    │  │
│  │ "Original message..." │  │
│  └───────────────────────┘  │
│  Your reply text here       │
└─────────────────────────────┘
```

**Message with Reactions**
```
┌─────────────────────────────┐
│  👤 persona name            │
│                             │
│  Message content here       │
│                             │
│  [👍 2] [❤️ 1] [😂 3]      │
└─────────────────────────────┘
```

---

## 🔧 Technical Details

### Backend Endpoints Added

#### Edit Message
```
PATCH /api/journals/:journalId/messages/:messageId
Body: { content: "new text" }
```
- Validates 15-minute window
- Adds `edited: true` and `editedAt` timestamp
- Returns updated message

#### Delete Message
```
DELETE /api/journals/:journalId/messages/:messageId
```
- Soft delete: adds `deleted: true` flag
- Adds `deletedAt` timestamp
- Keeps message in array for undo

#### Undo Delete
```
POST /api/journals/:journalId/messages/:messageId/undo-delete
```
- Removes `deleted` and `deletedAt` flags
- Restores message display

#### Add/Remove Reaction
```
POST /api/journals/:journalId/messages/:messageId/react
Body: { emoji: "👍", personaId: "xyz" }
```
- Toggles reaction on/off
- Maintains reactions array per message
- Groups reactions by emoji

### Frontend Components

**Context Menu**
- Position: Fixed, follows cursor/touch point
- Z-index: 2500 (above messages, below modals)
- Auto-hides on outside click

**Reaction Picker**
- Appears below context menu
- 6 default emojis in rounded container
- Hover to scale emoji (1.2x)

**Undo Toast**
- Position: Fixed bottom center
- Duration: 5 seconds
- Slide-up animation on appear
- Click "Undo" to restore

**Message Structure**
```javascript
{
  id: "msg_123",
  personaId: "persona_xyz",
  personaName: "thoughtful me",
  personaColor: "#333",
  personaIcon: "👤",
  content: "Message text",
  timestamp: "2024-01-15T10:30:00Z",
  
  // Optional fields
  edited: true,              // If message was edited
  editedAt: "2024-01-15T10:35:00Z",
  deleted: true,             // If soft-deleted
  deletedAt: "2024-01-15T10:40:00Z",
  replyTo: "msg_456",       // ID of replied-to message
  imageUrl: "https://...",  // Cloudinary URL
  reactions: [              // Array of reactions
    { emoji: "👍", personaId: "persona_xyz", timestamp: "..." }
  ]
}
```

---

## 🎯 Best Practices

### Based on Research

**Message Editing**
- ✅ **15-minute window** (WhatsApp standard)
- ✅ **"Edited" indicator** without history
- ✅ **Inline editing** in the same input field
- ✅ **Visual feedback** (orange border during edit)

**Message Deletion**
- ✅ **Undo window** (5 seconds, recommended by UX research)
- ✅ **Clear placeholder** ("This message was deleted")
- ✅ **Soft delete** (keeps data for undo)
- ✅ **Toast notification** (non-intrusive)

**Reactions**
- ✅ **Limited set** (6 emojis for quick selection)
- ✅ **Grouped display** (emoji + count)
- ✅ **Toggle behavior** (click to add/remove)
- ✅ **Visual distinction** (highlight user's own)

**Reply System**
- ✅ **Quoted preview** (shows context)
- ✅ **Click to scroll** (navigate to original)
- ✅ **Visual hierarchy** (indented preview)
- ✅ **Cancel option** (Escape key)

---

## 🚀 Usage Examples

### Example 1: Quick Edit
```
1. You: "Let's meet at 3pm tomorrow"
2. [Oh no, wrong time!]
3. Right-click → Edit
4. Change to: "Let's meet at 4pm tomorrow"
5. Message now shows: "Let's meet at 4pm tomorrow (edited)"
```

### Example 2: Delete with Undo
```
1. You: "I don't like pineapple on pizza"
2. [Actually, I do...]
3. Right-click → Delete
4. Toast appears: "Message deleted [Undo]"
5. Quick! Click "Undo" within 5 seconds
6. Message restored!
```

### Example 3: Reply Thread
```
1. Friend: "What should we do this weekend?"
2. Right-click → Reply
3. You: "How about hiking?" (shows quoted preview)
4. Friend clicks preview → scrolls back to original
5. Creates conversation thread
```

### Example 4: Reactions
```
1. Friend: "I just got promoted! 🎉"
2. Right-click → React
3. Click ❤️ to celebrate
4. Message shows: [❤️ 1]
5. Others add 👍: [❤️ 1] [👍  2]
6. Click your ❤️ again to remove
```

---

## ⚠️ Important Notes

### Edit Limitations
- **15-minute window** is enforced server-side
- Cannot edit **deleted messages**
- Cannot edit **AI messages**
- No edit history is stored

### Delete Behavior
- **Soft delete** for 5-second undo window
- After undo window, message stays but shows as deleted
- **Deleted messages** cannot be edited or reacted to
- Context menu doesn't appear on deleted messages

### Reply Restrictions
- Can reply to **any message** (even deleted ones show preview)
- Reply references stored as message IDs
- If original message is deleted, preview still shows

### Reaction Limits
- **6 default emojis** (can be expanded in code)
- **Toggle behavior** (no stacking same emoji twice)
- Reactions grouped by emoji automatically
- No limit on total reactions per message

---

## 🎨 Customization

### Change Reaction Emojis
Edit `index.html`, find `reaction-picker`:
```html
<div id="reaction-picker" class="reaction-picker hidden">
  <button class="reaction-btn" data-emoji="👍">👍</button>
  <button class="reaction-btn" data-emoji="❤️">❤️</button>
  <!-- Add more emojis here -->
  <button class="reaction-btn" data-emoji="🔥">🔥</button>
</div>
```

### Change Edit Window Duration
Edit `server.ts`, find the edit endpoint:
```typescript
const fifteenMinutes = 15 * 60 * 1000; // Change 15 to desired minutes
```

### Change Undo Toast Duration
Edit `app.js`, find `showUndoToast`:
```javascript
showUndoToast(message.id, 'Message deleted', 5000); // Change 5000 (5 seconds)
```

---

## 🐛 Troubleshooting

### "Cannot edit message" error
**Cause**: Message is older than 15 minutes  
**Solution**: This is by design. Edit immediately after sending.

### Context menu not appearing
**Cause**: JavaScript error or wrong browser  
**Solution**: 
- Check browser console (F12) for errors
- Try refreshing the page
- Ensure browser supports contextmenu events

### Undo button doesn't work
**Cause**: Toast disappeared (after 5 seconds)  
**Solution**: Delete creates soft delete immediately. Undo must be clicked within 5 seconds.

### Reactions not showing
**Cause**: Old messages without reactions array  
**Solution**: Reactions initialize automatically. Try adding a new reaction.

### Reply preview shows wrong content
**Cause**: Replied-to message was edited  
**Solution**: Reply previews are static snapshots. They don't update if original is edited.

---

## 📊 Database Structure

Messages now include these optional fields:
```javascript
{
  // ... existing fields ...
  
  edited: boolean,           // True if edited
  editedAt: ISO8601,        // When edited
  deleted: boolean,          // True if deleted
  deletedAt: ISO8601,       // When deleted
  replyTo: string,          // Message ID
  reactions: [              // Array of reaction objects
    {
      emoji: string,
      personaId: string,
      timestamp: ISO8601
    }
  ]
}
```

---

## 🎓 Implementation Credits

Based on comprehensive UX research of:
- **WhatsApp** (edit window, deletion behavior)
- **Telegram** (reaction system)
- **Slack** (reply threading)
- **Discord** (reaction grouping)

Research sources: Exa web search covering academic papers, UX pattern libraries, and production chat applications.

---

**Enjoy your enhanced journaling experience! 🚀📝**

Questions? Check the main documentation or explore the code in:
- `server.ts` - Backend API endpoints
- `app.js` - Frontend interaction logic
- `style.css` - Visual styling
- `index.html` - HTML structure
