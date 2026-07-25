# Search Feature Guide

## 🔍 Overview

Your Myairy journal now has a powerful search feature that lets you find any message across all your journals instantly!

---

## ✨ Features

### **Full-Text Search**
- Search across all journal messages
- Searches content, persona names, and dates
- Real-time results as you type
- Relevance-based ranking

### **Advanced Filters**
- **By Persona** - Filter messages from specific personas
- **By Journal** - Search within a specific journal
- **Images Only** - Show only messages with images
- **With Reactions** - Show only messages that have reactions

### **Rich Results Display**
Each result shows:
- ✅ Message content with highlighted matches
- ✅ Who sent it (persona with avatar)
- ✅ Which journal it's in
- ✅ When it was sent
- ✅ Badges (edited, image, reply)
- ✅ Reply preview (if it's a reply)
- ✅ All reactions with counts
- ✅ Image thumbnail (if present)
- ✅ "Go to message" button

---

## 📱 How to Use

### Basic Search
1. Click **"Search"** tab in sidebar
2. Type your query in the search bar
3. Results appear instantly as you type
4. Click any result to see full details
5. Click **"Go to message →"** to jump to original

### Using Filters
1. **Persona Filter**: Select a persona to see only their messages
2. **Journal Filter**: Select a journal to search within it
3. **Images Only**: Check to see only messages with photos
4. **With Reactions**: Check to see only messages people reacted to

### Clearing Search
- Click the **✕** button next to search input
- Or clear the search box manually
- Filters will reset automatically

---

## 🎯 Search Examples

### Find a Specific Quote
```
Search: "pineapple on pizza"
Results: All messages containing that phrase
```

### Find All Messages from a Persona
```
Filter: Creative Me
Results: All messages sent by "Creative Me"
```

### Find Photos from Last Week
```
Search: [leave empty]
Filter: ☑️ Images only
Results: All messages with images
```

### Find Highly Engaged Messages
```
Search: [your topic]
Filter: ☑️ With reactions
Results: Messages about that topic that got reactions
```

### Find Replies to Specific Message
```
Search: "original message content"
Results: Shows the original + any replies to it
```

---

## 🎨 Search Results Explained

### Result Card Structure
```
┌────────────────────────────────────────────┐
│ 👤 persona name    in "Journal Title"      │  ← Who & Where
│                          Jan 15, 2024 3:30pm│  ← When
├────────────────────────────────────────────┤
│ [✏️ Edited] [📷 Image] [↩️ Reply]           │  ← Badges
├────────────────────────────────────────────┤
│ ↩️ original sender                         │  ← Reply Preview
│ "Original message..."                      │
│                                            │
│ Your message with **highlighted** query    │  ← Content
│ [Image thumbnail]                          │  ← Image (if any)
├────────────────────────────────────────────┤
│ 👍 2  ❤️ 1  😂 3                           │  ← Reactions
├────────────────────────────────────────────┤
│                        [Go to message →]   │  ← Action
└────────────────────────────────────────────┘
```

### Badges Explained
- **✏️ Edited** - Message was edited after sending
- **📷 Image** - Message includes an image
- **↩️ Reply** - Message is a reply to another message

### Relevance Ranking
Results are sorted by relevance:
1. **Exact matches** rank highest
2. **Starts with query** ranks high
3. **Contains query** ranks medium
4. **Recent messages** get slight boost
5. **Persona name matches** add bonus points

---

## 💡 Advanced Search Tips

### 1. **Use Specific Terms**
❌ Bad: "good"
✅ Good: "good day at work"
More specific = better results

### 2. **Combine Filters**
```
Search: "meeting"
Persona: Work Me
Journal: Weekly Reviews
Results: Work meetings in weekly reviews
```

### 3. **Search by Date**
```
Search: "January 2024"
Results: All messages from that month
```

### 4. **Find AI Conversations**
```
Search: "@"
Results: All AI queries and responses
```

### 5. **Find Important Moments**
```
Filter: ☑️ With reactions
Results: Messages people reacted to (important moments)
```

---

## 🚀 Search Performance

### Speed
- **Instant results** as you type
- **Client-side search** (no server delay)
- Searches all journals in < 100ms
- Scales to 1000s of messages

### Limitations
- **Case-insensitive** search only
- **No wildcards** or regex
- **Full word matching** (no partial words)
- **Deleted messages** excluded from results

---

## 🎨 Visual Examples

### Empty State
```
🔍 Start typing to search across all your journal messages

Search by content, persona name, or date
```

### Searching State
```
Search: "productive day"

Found 12 messages
[Results listed below...]
```

### No Results State
```
No messages found for "xyz123"

Try different keywords or adjust your filters
```

### Filtered Search
```
Search: "project"
Persona: Work Me
Images Only: ☑️

Found 5 messages
[Results showing work projects with images...]
```

---

## 🔧 Technical Details

### Search Algorithm
```javascript
// Searches in:
1. Message content
2. Persona name
3. Message date

// Relevance scoring:
- Exact match: +100
- Starts with query: +50
- Contains query: +20
- Persona name match: +10
- Recency bonus: +10 to 0 (newer = higher)
```

### Filters Applied
```javascript
// Filters checked in order:
1. Journal ID match (if selected)
2. Persona ID match (if selected)
3. Has image (if checked)
4. Has reactions (if checked)
5. Not deleted
6. Content match
```

### Result Display
- Maximum results: Unlimited (all matches shown)
- Sorting: By relevance score (highest first)
- Highlighting: Query terms highlighted in yellow
- Navigation: Click to jump to original location

---

## 📊 Use Cases

### 1. **Daily Review**
Search for today's date to see all messages from today across all journals.

### 2. **Topic Research**
Search for a topic (e.g., "exercise") to see all related thoughts over time.

### 3. **Photo Gallery**
Use "Images Only" filter to create a visual gallery of all your journal photos.

### 4. **Conversation Threads**
Search for a message to find the full context including replies.

### 5. **Mood Tracking**
Search for emotion words ("happy", "anxious") to track mood patterns.

### 6. **AI Insights Review**
Search "@" to find all your AI conversations and insights.

### 7. **Important Moments**
Use "With Reactions" to find messages that stood out to you or others.

### 8. **Persona Analysis**
Filter by persona to see patterns in what each "version of you" talks about.

---

## ⚠️ Known Limitations

### What Search **Does** Support
- ✅ Full message content
- ✅ Persona names
- ✅ Date strings
- ✅ Case-insensitive matching
- ✅ Multiple word queries
- ✅ Special characters
- ✅ Emojis

### What Search **Doesn't** Support
- ❌ Regex patterns
- ❌ Wildcards (* or ?)
- ❌ Boolean operators (AND, OR, NOT)
- ❌ Phrase matching ("exact phrase")
- ❌ Fuzzy matching (typo tolerance)
- ❌ Partial word matching (typing "prod" won't match "productive")

### Workarounds
**Want exact phrase?**
Type the full phrase - relevance ranking will put exact matches first.

**Want multiple terms?**
Search for one term, then use filters to narrow down.

**Want partial matches?**
Type the full word - the search is fast enough to try multiple variations.

---

## 🎯 Best Practices

### For Best Results

1. **Be Specific**
   - Instead of "work", try "work meeting Tuesday"
   - More context = better results

2. **Use Filters**
   - Narrow down by persona or journal first
   - Then search within those results

3. **Check Badges**
   - Use badges to identify edited, image, or reply messages
   - Great for finding specific types of content

4. **Try Different Terms**
   - If "exercise" doesn't work, try "workout" or "gym"
   - Synonyms help find more results

5. **Review Results**
   - Top results are most relevant
   - Scroll down to see additional matches

---

## 🔄 Future Enhancements

Possible improvements:
- [ ] Advanced search syntax (AND, OR, NOT)
- [ ] Date range filtering
- [ ] Tag-based search
- [ ] Save search queries
- [ ] Export search results
- [ ] Search within images (OCR)
- [ ] Fuzzy matching for typos
- [ ] Search history

---

## 📝 Keyboard Shortcuts (Coming Soon)

Planned shortcuts:
- `/` - Focus search box
- `Esc` - Clear search
- `↓` / `↑` - Navigate results
- `Enter` - Go to selected result

---

## 🐛 Troubleshooting

### Search not working
**Symptom**: Nothing happens when typing
**Fix**: Refresh the page (Ctrl+R / Cmd+R)

### No results found
**Symptom**: Search returns 0 results
**Check**:
1. Spelling (search is exact-match)
2. Filters (clear all filters and try again)
3. Case doesn't matter, but spelling does

### Wrong results
**Symptom**: Results don't match what you expect
**Reason**: Relevance algorithm prioritizes:
- Exact matches
- Recent messages
- Content matches over persona name matches

### Slow search
**Symptom**: Results take a while to appear
**Cause**: Large number of journals/messages
**Solution**: Use filters to narrow scope first

---

## 💻 For Developers

### Adding New Search Filters

Edit `app.js`, add new filter:
```javascript
// In loadSearch():
const customFilter = document.getElementById('custom-filter');

// In performSearch():
if (customFilter.checked && !msg.customProperty) return;
```

### Customizing Relevance Score

Edit `calculateRelevance()` in `app.js`:
```javascript
function calculateRelevance(message, query) {
  let score = 0;
  // Add your custom scoring logic
  if (message.customProperty) score += 30;
  return score;
}
```

### Changing Result Display

Edit `renderSearchResults()` in `app.js` to customize the card HTML.

---

## 📚 Related Features

This search feature works seamlessly with:
- **Message Editing** - Search finds latest edited content
- **Message Deletion** - Deleted messages excluded automatically
- **Reactions** - Filter by reacted messages
- **Replies** - Shows full reply context
- **Images** - Filter and display images
- **AI Chat** - Search your AI conversations

---

**Happy Searching! 🔍✨**

Find anything, anytime, across all your journals!
