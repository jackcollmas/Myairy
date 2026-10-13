# Myairy

A personal journal app that lets you talk to different versions of yourself.

Myairy treats journaling like a group chat between your inner personas. Create a "Work Me", a "Creative Me", a "Fitness Me", and let them check in throughout the day. Each entry reads like a conversation rather than a wall of text, making it easier to notice how the different parts of your life are really doing.

Built as a Progressive Web App, it installs to your home screen, works offline, and keeps your entries private behind a PIN lock.

---

## Features

- **Multi-persona journaling** — Create personas, give each a color and icon, and write entries as whichever part of you is speaking.
- **Chat-style entries** — Daily journals render as a message thread. Tag a persona with `@` mid-sentence to switch who is talking.
- **PIN lock with rate limiting** — A 6-digit PIN protects your data. Production mode unlocks cloud-synced entries; any other 6-digit PIN opens a local demo sandbox.
- **AI companion** — Chat with an in-app AI assistant, or generate short reflective insights drawn from your recent entries (powered by Groq).
- **Images & camera** — Attach photos from your device or snap one in-app. Uploads are optimized and hosted on Cloudinary.
- **Reactions, replies, edits, undo-delete** — WhatsApp-style message interactions: react with emoji, quote-reply, edit within 15 minutes, soft-delete with an undo window.
- **Full-text search** — Search across every message, filter by persona or journal, narrow to images-only or messages with reactions, paginated.
- **Analytics dashboard** — Writing streak, top persona, most active day, total messages/images/reactions, longest entry, favorite writing hour, and an activity-over-time chart.
- **Relapse / habit counter** — A simple day counter with a monthly total, for tracking any streak you care about.
- **Dark mode** — One tap to switch, preference persisted locally.
- **PWA** — Installable on mobile and desktop, with a service worker that caches assets and keeps the shell usable offline.

---

## Tech Stack

| Layer         | Technology                                        |
|---------------|---------------------------------------------------|
| Backend       | Node.js, Express, TypeScript (run via `tsx`)     |
| Frontend      | Vanilla JavaScript, plain CSS, no build step     |
| Database      | MongoDB (with a local JSON-file fallback)        |
| AI            | Groq SDK                                          |
| Image hosting | Cloudinary                                        |
| File uploads  | Multer (in-memory, 10 MB cap)                    |
| Deployment    | Render (API) + Vercel (static frontend)          |

---

## Project Structure

```
myairy/
├── public/                # Static frontend served by Express
│   ├── index.html         # App shell (lock screen + main views)
│   ├── app.js             # Frontend logic
│   ├── style.css          # Styles
│   ├── demo-data.js       # Seed data for demo mode
│   ├── manifest.json      # PWA manifest
│   └── service-worker.js  # Offline caching
├── server/
│   └── db.ts              # Database service (MongoDB + JSON fallback)
├── server.ts              # Express API routes
├── data/
│   └── db.json            # Local JSON store (auto-created)
├── .env.example
├── vercel.json            # Frontend rewrites to the API
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- (Optional) A running MongoDB instance. If omitted, the app persists to a local `data/db.json` file automatically.

### Installation

```bash
git clone https://github.com/your-username/myairy.git
cd myairy
npm install
```

### Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable                  | Description                                                  | Required |
|---------------------------|--------------------------------------------------------------|----------|
| `APP_URL`                 | Frontend URL for CORS / references                           | No       |
| `PIN_CODE`                | 6-digit PIN for production mode. Defaults to `123456`.       | No       |
| `MONGODB_URI`             | MongoDB connection string. Falls back to JSON if omitted.    | No       |
| `GROQ_API_KEY`            | Groq API key for AI chat + insights. Get one at [console.groq.com](https://console.groq.com/keys). | For AI features |
| `CLOUDINARY_CLOUD_NAME`   | Cloudinary cloud name for image uploads.                     | For uploads |
| `CLOUDINARY_API_KEY`      | Cloudinary API key.                                          | For uploads |
| `CLOUDINARY_API_SECRET`   | Cloudinary API secret.                                       | For uploads |

### Run locally

```bash
npm run dev
```

The server starts on `http://localhost:3030`.

- Enter your configured `PIN_CODE` (default `123456`) for production mode with server-side storage.
- Enter any other 6 digits for demo mode, where data is stored in the browser and preloaded with sample personas and journals.

---

## API Overview

All routes are prefixed with `/api`.

### Auth
- `POST /api/verify-pin` — Validates a 6-digit PIN. Returns `production` or `demo` mode. Rate-limited per session (5 failures locks out for 5 minutes).

### Personas
- `GET /api/personas`
- `POST /api/personas`
- `PUT /api/personas/:id`
- `DELETE /api/personas/:id`

### Journals
- `GET /api/journals`
- `GET /api/journals/:id`
- `POST /api/journals`
- `PUT /api/journals/:id`
- `PATCH /api/journals/:id/toggle-special`
- `DELETE /api/journals/:id`

### Messages (within a journal)
- `PATCH /api/journals/:journalId/messages/:messageId` — Edit content (within 15 min of sending).
- `DELETE /api/journals/:journalId/messages/:messageId` — Soft delete.
- `POST /api/journals/:journalId/messages/:messageId/undo-delete` — Restore a soft-deleted message.
- `POST /api/journals/:journalId/messages/:messageId/react` — Toggle an emoji reaction.
- `POST /api/journals/:journalId/messages/:messageId/reply` — Attach a reply reference.

### AI
- `POST /api/ai-chat` — Send a messages array, get an AI response.
- `POST /api/insights` — Generates and saves an AI insight from recent journal messages.
- `GET /api/insights`

### Media
- `POST /api/upload-image` — Upload a single image (max 10 MB) to Cloudinary.

### Counters
- `GET /api/counters`
- `POST /api/counters/increment`

### System
- `GET /api/health`
- `GET /api/storage-status` — Reports whether MongoDB or the JSON fallback is active.

---

## Deployment

The app is split for deployment: the static frontend on Vercel and the API on Render (or any Node host).

### Backend (Render / similar)

1. Set the build command to `npm run build` and the start command to `npm start`.
2. Add the environment variables from `.env.example`.
3. The compiled output runs from `dist/server.js`.

### Frontend (Vercel)

`vercel.json` rewrites `/api/*` requests to your hosted API. Update the `destination` URL in [vercel.json](file:///c:/Users/USER/Desktop/myairy/vercel.json) to point at your own backend before deploying.

---

## Screenshots

_Add screenshots here once you have them. A lock screen, the dashboard, a journal thread, and the analytics view make a strong set._

---

## Roadmap

- Export / import journals (JSON, Markdown)
- End-to-end encryption for entries
- Reminders / scheduled check-ins
- Web share target support
- Optional multi-device sync without a backend

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-idea`)
3. Commit your changes (`git commit -m 'Add your idea'`)
4. Push to the branch (`git push origin feature/your-idea`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgments

- AI responses via [Groq](https://groq.com/)
- Image hosting via [Cloudinary](https://cloudinary.com/)
- Icons via [Font Awesome](https://fontawesome.com/)
