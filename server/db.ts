import fs from 'fs';
import path from 'path';
import { MongoClient, Db } from 'mongodb';
import { Persona, JournalEntry, Insight, CounterEntry } from '../server.js';

const MONGODB_URI = process.env.MONGODB_URI || '';
const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'db.json');

export interface StorageStatus {
  dbType: 'mongodb' | 'json_fallback';
  connected: boolean;
  message: string;
}

interface LocalData {
  personas: Persona[];
  journals: JournalEntry[];
  insights: Insight[];
  counters: CounterEntry[];
}

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'persona_work',
    name: 'Work Me',
    color: '#000000', // Black
    avatarIcon: '💼',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'persona_personal',
    name: 'Personal Me',
    color: '#333333', // Dark Gray
    avatarIcon: '🌿',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'persona_playtime',
    name: 'Playtime Me',
    color: '#666666', // Gray
    avatarIcon: '🎮',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    id: 'journal_welcome',
    title: 'First Collective Journal',
    date: new Date().toISOString().split('T')[0],
    isSpecial: true,
    specialNote: 'App launch day - started journaling with my inner personas!',
    messages: [
      {
        id: 'msg_1',
        personaId: 'persona_work',
        personaName: 'Work Me',
        personaColor: '#000000',
        content: 'Finished setting up our new minimalist journal app today! Ready to track our daily goals.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'msg_2',
        personaId: 'persona_personal',
        personaName: 'Personal Me',
        personaColor: '#333333',
        content: 'I love how clean this looks. It feels like we are all talking in a private group chat.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class DatabaseService {
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private isMongoConnected = false;
  private statusMessage = 'Initializing database...';

  constructor() {
    this.init();
  }

  private async init() {
    if (MONGODB_URI) {
      try {
        console.log('Attempting connection to MongoDB...');
        this.mongoClient = new MongoClient(MONGODB_URI, {
          serverSelectionTimeoutMS: 3000,
        });
        await this.mongoClient.connect();
        this.db = this.mongoClient.db();
        this.isMongoConnected = true;
        this.statusMessage = 'Connected to MongoDB';
        console.log('Successfully connected to MongoDB!');
        await this.seedMongoIfEmpty();
        return;
      } catch (err: any) {
        console.warn('MongoDB connection failed or timed out. Falling back to JSON file storage.', err.message);
        this.isMongoConnected = false;
        this.statusMessage = `JSON Fallback Active (${err.message || 'MongoDB unavailable'})`;
      }
    } else {
      this.statusMessage = 'JSON Fallback Active (No MONGODB_URI provided)';
    }

    this.initJsonStorage();
  }

  private initJsonStorage() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(JSON_FILE_PATH)) {
      const initialData: LocalData = {
        personas: DEFAULT_PERSONAS,
        journals: DEFAULT_JOURNALS,
        insights: [],
        counters: [],
      };
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  private readJsonData(): LocalData {
    this.initJsonStorage();
    try {
      const raw = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        personas: parsed.personas || DEFAULT_PERSONAS,
        journals: parsed.journals || DEFAULT_JOURNALS,
        insights: parsed.insights || [],
        counters: parsed.counters || [],
      };
    } catch {
      return { personas: DEFAULT_PERSONAS, journals: DEFAULT_JOURNALS, insights: [], counters: [] };
    }
  }

  private writeJsonData(data: LocalData) {
    this.initJsonStorage();
    try {
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(JSON_FILE_PATH, jsonString, 'utf-8');
      console.log('✓ Database written successfully to', JSON_FILE_PATH);
      console.log('  - Personas:', data.personas.length);
      console.log('  - Journals:', data.journals.length);
      console.log('  - Total messages:', data.journals.reduce((sum, j) => sum + (j.messages?.length || 0), 0));
    } catch (err: any) {
      console.error('✗ Failed to write database:', err.message);
      throw err;
    }
  }

  private async seedMongoIfEmpty() {
    if (!this.db) return;
    const personasCount = await this.db.collection('personas').countDocuments();
    if (personasCount === 0) {
      await this.db.collection('personas').insertMany(DEFAULT_PERSONAS as any);
    }
    const journalsCount = await this.db.collection('journals').countDocuments();
    if (journalsCount === 0) {
      await this.db.collection('journals').insertMany(DEFAULT_JOURNALS as any);
    }
  }

  public getStatus(): StorageStatus {
    return {
      dbType: this.isMongoConnected ? 'mongodb' : 'json_fallback',
      connected: this.isMongoConnected,
      message: this.statusMessage,
    };
  }

  // --- PERSONAS CRUD ---

  public async getPersonas(): Promise<Persona[]> {
    if (this.isMongoConnected && this.db) {
      const personas = await this.db.collection('personas').find({}).toArray();
      return personas.map((p: any) => ({
        id: p.id || p._id.toString(),
        name: p.name,
        color: p.color,
        avatarIcon: p.avatarIcon,
        createdAt: p.createdAt,
      }));
    } else {
      return this.readJsonData().personas;
    }
  }

  public async savePersona(persona: Persona): Promise<Persona> {
    if (this.isMongoConnected && this.db) {
      await this.db.collection('personas').insertOne(persona as any);
      return persona;
    } else {
      const data = this.readJsonData();
      data.personas.push(persona);
      this.writeJsonData(data);
      return persona;
    }
  }

  public async updatePersona(id: string, updates: Partial<Persona>): Promise<Persona | null> {
    if (this.isMongoConnected && this.db) {
      await this.db.collection('personas').updateOne({ id }, { $set: updates });
      const updated = await this.db.collection('personas').findOne({ id });
      return updated as unknown as Persona;
    } else {
      const data = this.readJsonData();
      const idx = data.personas.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      data.personas[idx] = { ...data.personas[idx], ...updates };
      this.writeJsonData(data);
      return data.personas[idx];
    }
  }

  public async deletePersona(id: string): Promise<boolean> {
    if (this.isMongoConnected && this.db) {
      const res = await this.db.collection('personas').deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const data = this.readJsonData();
      const initialLen = data.personas.length;
      data.personas = data.personas.filter((p) => p.id !== id);
      this.writeJsonData(data);
      return data.personas.length < initialLen;
    }
  }

  // --- JOURNALS CRUD ---

  public async getJournals(): Promise<JournalEntry[]> {
    if (this.isMongoConnected && this.db) {
      const journals = await this.db.collection('journals').find({}).sort({ date: -1, createdAt: -1 }).toArray();
      return journals.map((j: any) => ({
        id: j.id || j._id.toString(),
        title: j.title,
        date: j.date,
        isSpecial: Boolean(j.isSpecial),
        specialNote: j.specialNote || '',
        messages: j.messages || [],
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      }));
    } else {
      const data = this.readJsonData();
      return data.journals.sort((a, b) => (a.date > b.date ? -1 : 1));
    }
  }

  public async getJournal(id: string): Promise<JournalEntry | null> {
    if (this.isMongoConnected && this.db) {
      const j: any = await this.db.collection('journals').findOne({ id });
      if (!j) return null;
      return {
        id: j.id || j._id.toString(),
        title: j.title,
        date: j.date,
        isSpecial: Boolean(j.isSpecial),
        specialNote: j.specialNote || '',
        messages: j.messages || [],
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      };
    } else {
      const data = this.readJsonData();
      return data.journals.find((j) => j.id === id) || null;
    }
  }

  public async saveJournal(journal: JournalEntry): Promise<JournalEntry> {
    if (this.isMongoConnected && this.db) {
      await this.db.collection('journals').insertOne(journal as any);
      return journal;
    } else {
      const data = this.readJsonData();
      const existingIdx = data.journals.findIndex((j) => j.id === journal.id);
      if (existingIdx !== -1) {
        data.journals[existingIdx] = journal;
      } else {
        data.journals.unshift(journal);
      }
      this.writeJsonData(data);
      return journal;
    }
  }

  public async updateJournal(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    const updatedAt = new Date().toISOString();
    console.log('📝 Updating journal:', id);
    console.log('  - Updates keys:', Object.keys(updates));
    if (updates.messages) {
      console.log('  - New message count:', updates.messages.length);
    }
    
    if (this.isMongoConnected && this.db) {
      await this.db.collection('journals').updateOne({ id }, { $set: { ...updates, updatedAt } });
      return this.getJournal(id);
    } else {
      const data = this.readJsonData();
      const idx = data.journals.findIndex((j) => j.id === id);
      if (idx === -1) {
        console.error('✗ Journal not found:', id);
        return null;
      }
      console.log('  - Found journal at index:', idx);
      console.log('  - Current messages:', data.journals[idx].messages?.length || 0);
      
      data.journals[idx] = { ...data.journals[idx], ...updates, updatedAt };
      console.log('  - Updated messages:', data.journals[idx].messages?.length || 0);
      
      this.writeJsonData(data);
      console.log('✓ Journal updated successfully');
      return data.journals[idx];
    }
  }

  public async deleteJournal(id: string): Promise<boolean> {
    if (this.isMongoConnected && this.db) {
      const res = await this.db.collection('journals').deleteOne({ id });
      return res.deletedCount > 0;
    } else {
      const data = this.readJsonData();
      const initialLen = data.journals.length;
      data.journals = data.journals.filter((j) => j.id !== id);
      this.writeJsonData(data);
      return data.journals.length < initialLen;
    }
  }

  // --- INSIGHTS CRUD ---
  
  public async getInsights(): Promise<Insight[]> {
    if (this.isMongoConnected && this.db) {
      const insights = await this.db.collection('insights').find({}).sort({ createdAt: -1 }).toArray();
      return insights.map((i: any) => ({
        id: i.id || i._id.toString(),
        content: i.content,
        createdAt: i.createdAt,
      }));
    } else {
      const data = this.readJsonData();
      return (data.insights || []).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }
  }

  public async saveInsight(insight: Insight): Promise<Insight> {
    if (this.isMongoConnected && this.db) {
      await this.db.collection('insights').insertOne(insight as any);
      return insight;
    } else {
      const data = this.readJsonData();
      if (!data.insights) data.insights = [];
      data.insights.unshift(insight);
      this.writeJsonData(data);
      return insight;
    }
  }

  // --- COUNTERS CRUD ---
  
  public async getCounters(): Promise<CounterEntry[]> {
    if (this.isMongoConnected && this.db) {
      const counters = await this.db.collection('counters').find({}).sort({ date: 1 }).toArray();
      return counters.map((c: any) => ({
        id: c.id || c._id.toString(),
        date: c.date,
        count: c.count
      }));
    } else {
      const data = this.readJsonData();
      return (data.counters || []).sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  }

  public async incrementCounter(date: string, amount: number): Promise<CounterEntry> {
    if (this.isMongoConnected && this.db) {
      const existing = await this.db.collection('counters').findOne({ date });
      if (existing) {
        await this.db.collection('counters').updateOne({ date }, { $inc: { count: amount } });
      } else {
        await this.db.collection('counters').insertOne({
          id: `counter_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          date,
          count: amount
        });
      }
      const updated = await this.db.collection('counters').findOne({ date });
      return { id: updated!.id || updated!._id.toString(), date: updated!.date, count: updated!.count };
    } else {
      const data = this.readJsonData();
      if (!data.counters) data.counters = [];
      const idx = data.counters.findIndex(c => c.date === date);
      let result: CounterEntry;
      if (idx !== -1) {
        data.counters[idx].count += amount;
        result = data.counters[idx];
      } else {
        result = {
          id: `counter_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          date,
          count: amount
        };
        data.counters.push(result);
      }
      this.writeJsonData(data);
      return result;
    }
  }
}

export const dbService = new DatabaseService();
