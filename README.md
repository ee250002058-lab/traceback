# 🔎 Traceback — Smart Lost & Found System

A modern, AI-powered Lost & Found tracker built for campus use. Students can report lost or found items, search and filter posts, and get intelligent match suggestions when a lost item potentially matches a found one — all in real time across multiple users.

---

## ✨ Features

### Core Functionality
- 📋 **Dashboard** — View all lost and found posts in one place
- ➕ **Post Item** — Report a lost or found item with name, location, date/time, category, description and optional photo
- ✏️ **Edit Item** — Update any detail of a post after it's been created via a clean modal
- 🗑️ **Delete Item** — Remove a post with two-step confirmation to prevent accidents
- ✅ **Resolve Item** — Mark an item as resolved once it has been returned
- 🔍 **Search** — Search by item name, location, category or description in real time
- 🔽 **Filter** — Filter posts by Lost / Found / Resolved status
- 📊 **Sort** — Sort by newest, oldest, A→Z or Z→A

### Smart Features
- 🤖 **AI Match Detection** — Automatically detects when a lost item potentially matches a found item using a weighted scoring system across name similarity, location, category, description keywords, and TensorFlow.js image recognition
- 🎯 **Confidence Score** — Each match shown with a % confidence score, colour coded green / amber / red
- 🌙 **Dark Mode** — Full dark mode toggle with smooth transitions
- 📱 **Fully Responsive** — Works on mobile, tablet and desktop
- ⚡ **Instant Load** — Shows cached data immediately on page load, syncs with backend silently in background
- 🟢 **Live Status Indicator** — Small dot shows live / syncing / offline state without intrusive banners

### Multi-User & Backend
- ☁️ **Shared Database** — All items stored in MongoDB Atlas, visible to every user in real time
- 🔄 **Auto Sync** — Polls backend every 10 seconds so new items from other users appear automatically
- 💾 **Offline Cache** — If backend is temporarily unreachable, cached data is shown seamlessly with no loading screen
- 🔁 **Optimistic Updates** — Actions like delete and resolve update the UI instantly without waiting for the server, with automatic rollback if the server call fails

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast HMR, component-based, industry standard |
| Routing | React Router v6 | Clean SPA navigation |
| AI / ML | TensorFlow.js + MobileNet | In-browser image classification, no external API |
| Backend | Node.js + Express | Lightweight, fast REST API |
| Database | MongoDB Atlas | Free cloud DB, flexible schema, hosted |
| Persistence | MongoDB + localStorage cache | Cloud storage with instant local fallback |

---

## 📁 Folder Structure
```
traceback/
├── server/                   # Backend — Node.js + Express
│   ├── routes/
│   │   └── items.js          # All CRUD API routes
│   ├── server.js             # Express app + MongoDB connection
│   ├── .env                  # Environment variables (not committed)
│   └── package.json
│
├── src/                      # Frontend — React
│   ├── assets/
│   │   └── logo.svg          # App logo
│   ├── components/
│   │   ├── EditModal.jsx     # Modal for editing existing items
│   │   ├── FilterButtons.jsx # Lost / Found / Resolved filter
│   │   ├── ItemCard.jsx      # Individual item card with all actions
│   │   ├── ItemForm.jsx      # Shared form for add and edit
│   │   ├── Navbar.jsx        # Top navigation with dark mode toggle
│   │   ├── SearchBar.jsx     # Live search input
│   │   └── Stats.jsx         # Summary stats cards
│   ├── pages/
│   │   ├── AddItem.jsx       # Add item page
│   │   └── Dashboard.jsx     # Main dashboard
│   ├── utils/
│   │   ├── api.js            # All backend API calls with retry logic
│   │   ├── imageMatcher.js   # TensorFlow image detection
│   │   └── storage.js        # localStorage cache utilities
│   ├── App.jsx               # Root component + dark mode state
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18 or higher
- A free MongoDB Atlas account — [mongodb.com/atlas](https://mongodb.com/atlas)

### 1. Clone the repository
```bash
git clone https://github.com/ee250002058-lab/traceback.git
cd traceback
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Set up the backend
```bash
cd server
npm install
```

### 4. Configure environment variables
Create a `.env` file inside the `server/` folder:
```
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

Get your connection string from MongoDB Atlas → Connect → Drivers → Node.js.

### 5. Run the app

Open two terminals simultaneously:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Expected output:
```
✅ Connected to MongoDB Atlas
🚀 Server running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items` | Fetch all items |
| POST | `/api/items` | Create a new item |
| PUT | `/api/items/:id` | Update an existing item |
| PATCH | `/api/items/:id/resolve` | Mark item as resolved |
| DELETE | `/api/items/:id` | Delete an item |

---

## 🤖 How AI Matching Works

The system compares all Lost items against all Found items using a weighted scoring system:

| Signal | Weight |
|---|---|
| Name similarity (substring + keyword) | 2 pts |
| Same location | 1 pt |
| Same category | 1 pt |
| Shared description keywords | 1 pt |
| TensorFlow image classification match | 2 pts |

A match is flagged at **60% or above** of the maximum possible score. This means a strong name + location match is always enough to flag a potential match even without photos. Results are sorted by confidence percentage.

---

## 🎯 Design Decisions

- **No login required** — Campus tool meant for quick, frictionless use. Any student can post or claim without an account
- **Optimistic UI** — Delete, resolve and edit update the UI instantly. If server fails, UI rolls back automatically
- **localStorage cache** — Users see content immediately on every page load, even before the backend responds
- **TensorFlow runs in browser** — No images sent to external services. All AI processing is client-side
- **Dynamic match threshold** — Max score adjusts based on which fields are filled in, so items without photos are never unfairly penalised

---

## 👨‍💻 Author

**Rohan Hubballi**  
IIT Indore  
Programming Club — Software Division Induction Task 2026  
Problem Statement 4 — Lost & Found Tracker App (Intermediate)