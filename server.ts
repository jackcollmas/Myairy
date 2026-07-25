import 'dotenv/config';
import express from 'express';
import path from 'path';
import { dbService } from './server/db';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import cors from 'cors';

dotenv.config();

// Personas and Journals interfaces based on types.ts
export interface Persona {
  id: string;
  name: string;
  color: string;
  avatarIcon?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  isSpecial: boolean;
  specialNote?: string;
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

const PORT = 3000;
const PIN_CODE = process.env.PIN_CODE || '1234';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---

  // Health & Storage status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/storage-status', (req, res) => {
    res.json(dbService.getStatus());
  });

  // PIN Verification
  app.post('/api/verify-pin', (req, res) => {
    const { pin } = req.body;
    if (String(pin).trim() === String(PIN_CODE).trim()) {
      res.json({ success: true, message: 'Unlocked successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid 4-digit PIN code' });
    }
  });

  // AI Chat with Groq
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ 
          error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env file' 
        });
      }

      // Format messages for Groq API
      const formattedMessages = messages.map((msg: any) => ({
        role: msg.role || 'user',
        content: msg.content
      }));

      // Add system message at the beginning
      const systemMessage = {
        role: 'system',
        content: 'You are a helpful AI assistant in a personal journal application. Be conversational, empathetic, and provide thoughtful responses. Keep responses concise but meaningful.'
      };

      // Call Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: [systemMessage, ...formattedMessages],
        model: 'llama-3.3-70b-versatile', // Fast and capable model
        temperature: 0.7,
        max_tokens: 1024,
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';

      res.json({ 
        success: true, 
        response: aiResponse,
        usage: chatCompletion.usage 
      });

    } catch (err: any) {
      console.error('Groq API Error:', err);
      res.status(500).json({ 
        error: err.message || 'Failed to get AI response',
        details: err.error?.message || 'Unknown error'
      });
    }
  });

  // Image Upload to Cloudinary
  app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Check if Cloudinary is configured
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ 
          error: 'Cloudinary not configured. Please add CLOUDINARY credentials to your .env file' 
        });
      }

      // Upload to Cloudinary using upload_stream
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'myairy-journal',
            resource_type: 'image',
            transformation: [
              { width: 1200, crop: 'limit' }, // Limit width to 1200px
              { quality: 'auto:good' }, // Auto optimize quality
              { fetch_format: 'auto' }, // Auto format (WebP for supported browsers)
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(req.file!.buffer);
      });

      const result: any = await uploadPromise;

      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });

    } catch (err: any) {
      console.error('Cloudinary Upload Error:', err);
      res.status(500).json({ 
        error: err.message || 'Failed to upload image',
        details: err.error?.message || 'Unknown error'
      });
    }
  });

  // Personas CRUD
  app.get('/api/personas', async (req, res) => {
    try {
      const personas = await dbService.getPersonas();
      res.json(personas);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch personas' });
    }
  });

  app.post('/api/personas', async (req, res) => {
    try {
      const { name, color, avatarIcon } = req.body;
      if (!name || !color) {
        return res.status(400).json({ error: 'Name and color are required' });
      }
      const newPersona: Persona = {
        id: `persona_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        color,
        avatarIcon: avatarIcon || '👤',
        createdAt: new Date().toISOString(),
      };
      const saved = await dbService.savePersona(newPersona);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create persona' });
    }
  });

  app.put('/api/personas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, color, avatarIcon } = req.body;
      const updated = await dbService.updatePersona(id, { name, color, avatarIcon });
      if (!updated) {
        return res.status(404).json({ error: 'Persona not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update persona' });
    }
  });

  app.delete('/api/personas/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbService.deletePersona(id);
      if (!success) {
        return res.status(404).json({ error: 'Persona not found or could not be deleted' });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete persona' });
    }
  });

  // Journals CRUD
  app.get('/api/journals', async (req, res) => {
    try {
      const journals = await dbService.getJournals();
      res.json(journals);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch journals' });
    }
  });

  app.get('/api/journals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const journal = await dbService.getJournal(id);
      if (!journal) {
        return res.status(404).json({ error: 'Journal entry not found' });
      }
      res.json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch journal entry' });
    }
  });

  app.post('/api/journals', async (req, res) => {
    try {
      const { title, date, isSpecial, specialNote, messages } = req.body;
      const now = new Date().toISOString();
      const newJournal: JournalEntry = {
        id: `journal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: title || `Journal ${date || new Date().toISOString().split('T')[0]}`,
        date: date || new Date().toISOString().split('T')[0],
        isSpecial: Boolean(isSpecial),
        specialNote: specialNote || '',
        messages: Array.isArray(messages) ? messages : [],
        createdAt: now,
        updatedAt: now,
      };
      const saved = await dbService.saveJournal(newJournal);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create journal' });
    }
  });

  app.put('/api/journals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, date, isSpecial, specialNote, messages } = req.body;
      const updated = await dbService.updateJournal(id, {
        title,
        date,
        isSpecial,
        specialNote,
        messages,
      });
      if (!updated) {
        return res.status(404).json({ error: 'Journal not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update journal' });
    }
  });

  app.patch('/api/journals/:id/toggle-special', async (req, res) => {
    try {
      const { id } = req.params;
      const { isSpecial, specialNote } = req.body;
      const existing = await dbService.getJournal(id);
      if (!existing) {
        return res.status(404).json({ error: 'Journal not found' });
      }
      const updated = await dbService.updateJournal(id, {
        isSpecial: isSpecial !== undefined ? Boolean(isSpecial) : !existing.isSpecial,
        specialNote: specialNote !== undefined ? specialNote : existing.specialNote,
      });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to toggle special day status' });
    }
  });

  app.delete('/api/journals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbService.deleteJournal(id);
      if (!success) {
        return res.status(404).json({ error: 'Journal not found' });
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete journal' });
    }
  });

  // Message Operations
  // Edit a specific message in a journal
  app.patch('/api/journals/:journalId/messages/:messageId', async (req, res) => {
    try {
      const { journalId, messageId } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const journal = await dbService.getJournal(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }

      const messageIndex = journal.messages.findIndex((m: any) => m.id === messageId);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const message = journal.messages[messageIndex];
      
      // Check if message was created within last 15 minutes (WhatsApp-style)
      const messageAge = Date.now() - new Date(message.timestamp).getTime();
      const fifteenMinutes = 15 * 60 * 1000;
      
      if (messageAge > fifteenMinutes) {
        return res.status(403).json({ error: 'Messages can only be edited within 15 minutes of sending' });
      }

      // Update message content and add edited flag
      message.content = content.trim();
      message.edited = true;
      message.editedAt = new Date().toISOString();

      const updated = await dbService.updateJournal(journalId, { messages: journal.messages });
      res.json({ success: true, message: updated?.messages[messageIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to edit message' });
    }
  });

  // Soft delete a message (mark as deleted)
  app.delete('/api/journals/:journalId/messages/:messageId', async (req, res) => {
    try {
      const { journalId, messageId } = req.params;

      const journal = await dbService.getJournal(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }

      const messageIndex = journal.messages.findIndex((m: any) => m.id === messageId);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Soft delete: mark as deleted but keep in array for undo functionality
      journal.messages[messageIndex].deleted = true;
      journal.messages[messageIndex].deletedAt = new Date().toISOString();

      const updated = await dbService.updateJournal(journalId, { messages: journal.messages });
      res.json({ success: true, message: updated?.messages[messageIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete message' });
    }
  });

  // Undo message deletion
  app.post('/api/journals/:journalId/messages/:messageId/undo-delete', async (req, res) => {
    try {
      const { journalId, messageId } = req.params;

      const journal = await dbService.getJournal(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }

      const messageIndex = journal.messages.findIndex((m: any) => m.id === messageId);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Remove deleted flag
      delete journal.messages[messageIndex].deleted;
      delete journal.messages[messageIndex].deletedAt;

      const updated = await dbService.updateJournal(journalId, { messages: journal.messages });
      res.json({ success: true, message: updated?.messages[messageIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to undo delete' });
    }
  });

  // Add/remove reaction to a message
  app.post('/api/journals/:journalId/messages/:messageId/react', async (req, res) => {
    try {
      const { journalId, messageId } = req.params;
      const { emoji, personaId } = req.body;

      if (!emoji) {
        return res.status(400).json({ error: 'Emoji is required' });
      }

      const journal = await dbService.getJournal(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }

      const messageIndex = journal.messages.findIndex((m: any) => m.id === messageId);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      const message = journal.messages[messageIndex];
      
      // Initialize reactions array if it doesn't exist
      if (!message.reactions) {
        message.reactions = [];
      }

      // Check if user already reacted with this emoji
      const existingReactionIndex = message.reactions.findIndex(
        (r: any) => r.emoji === emoji && r.personaId === personaId
      );

      if (existingReactionIndex !== -1) {
        // Remove reaction (toggle off)
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        // Add reaction
        message.reactions.push({
          emoji,
          personaId,
          timestamp: new Date().toISOString(),
        });
      }

      const updated = await dbService.updateJournal(journalId, { messages: journal.messages });
      // Return the full updated journal object so frontend can re-render
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add reaction' });
    }
  });

  // Add reply reference to a message
  app.post('/api/journals/:journalId/messages/:messageId/reply', async (req, res) => {
    try {
      const { journalId, messageId } = req.params;
      const { replyToId } = req.body;

      if (!replyToId) {
        return res.status(400).json({ error: 'replyToId is required' });
      }

      const journal = await dbService.getJournal(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }

      const messageIndex = journal.messages.findIndex((m: any) => m.id === messageId);
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Verify the replyTo message exists
      const replyToMessage = journal.messages.find((m: any) => m.id === replyToId);
      if (!replyToMessage) {
        return res.status(404).json({ error: 'Reply target message not found' });
      }

      // Add reply reference
      journal.messages[messageIndex].replyTo = replyToId;

      const updated = await dbService.updateJournal(journalId, { messages: journal.messages });
      res.json({ success: true, message: updated?.messages[messageIndex] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add reply reference' });
    }
  });

  // --- STATIC SERVING ---
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Persona Journal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
