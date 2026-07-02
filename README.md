# ✉️ AI Email Writer

A desktop AI-powered Email Writer application built with React, Node.js, and Electron. Generate context-aware emails with customizable tone, choose between different AI providers (including fully local offline models), save drafts locally, and package as a Windows executable.

![AI Email Writer](https://img.shields.io/badge/AI-Email%20Writer-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Electron](https://img.shields.io/badge/Electron-33-47848f?style=for-the-badge&logo=electron)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js)

---

## ✨ Features

- 🤖 **Multi-Provider AI System** — Dynamically switch between **OpenAI API**, **Google Gemini API**, and **Ollama** (Local & Offline models like Llama 3).
- ⚙️ **Configurable Settings Modal** — Set custom provider APIs, model targets (e.g. `gpt-4o`, `gemini-2.5-flash`), or Ollama host endpoints directly in the UI.
- 🎨 **Premium Animated Glassmorphism UI** — A modern dark theme featuring flowing gradient background mesh orbs and smooth interactive states.
- 🟢 **Live Provider Indicator** — Real-time pulsing badge in the header instantly showing which AI provider is powering the generation.
- 📋 **Word & Char Counter** — Built-in text metrics on the editable email output editor.
- 7️⃣ **Distinct Tones Selector** — Professional, Formal, Friendly, Apologetic, Persuasive, Thankful, or Follow-up.
- 📝 **Smart Templates** — Pre-set templates to load quick prompts for common email categories.
- 💾 **Local SQLite DB** — SQLite (with WAL mode enabled) safely stores your historical email drafts.
- 🔍 **Drafts Search & Snippets** — Instantly search drafts by recipient or subject with a snippet preview.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite) |
| **Backend** | Node.js (Express) |
| **Database** | SQLite (`better-sqlite3`) |
| **AI Integration** | OpenAI SDK, `@google/generative-ai` (Gemini SDK), Ollama API |
| **Desktop Shell** | Electron |
| **Styling** | Vanilla CSS (Mesh gradients, CSS variables) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ installed
- An API Key from [OpenAI](https://platform.openai.com) or [Google AI Studio](https://aistudio.google.com) (or a local [Ollama](https://ollama.com) installation).

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/kmahad/AI-email-writer.git
   cd AI-email-writer
   ```

2. **Install all dependencies**
   ```bash
   # Install top-level Electron tools
   npm install
   
   # Install backend server tools
   cd backend && npm install && cd ..
   
   # Install React frontend tools
   cd frontend && npm install && cd ..
   ```

3. **Configure environment keys**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and populate with your API keys (optional: you can also configure keys directly inside the application Settings).
   ```

### Running the Application

- **Run as Desktop App (Electron)**:
  ```bash
  npm run electron:dev
  ```
- **Run in your Web Browser (Vite Dev Server)**:
  ```bash
  npm run dev
  ```
  Once active, open: `http://localhost:5173` (API runs on port `3001`).

---

## 📦 Distribution & Packaging

To compile a standalone Windows executable installer (`.exe`):
```bash
npm run dist
```
This builds the React app for production and packages all server modules + Electron shell into an NSIS setup file located in `dist-electron/`.

---

## 📁 Folder Structure

```
ai-email-writer/
├── electron/           # Electron main process & preload lifecycle scripts
├── backend/            # Express REST API, SQLite schema configuration, and AI routers
├── frontend/           # React application & components (Vite configuration)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # App title bar with active AI status
│   │   │   ├── InputForm.jsx      # Compose controls, prompt fields, and templates
│   │   │   ├── EmailOutput.jsx    # Live editable output editor with counts & copy tools
│   │   │   ├── HistoryPanel.jsx   # Drafts sidebar list with body preview snippets
│   │   │   └── SettingsModal.jsx  # Interactive AI switching modal (OpenAI, Gemini, Ollama)
│   │   ├── App.jsx
│   │   └── index.css              # Glassmorphism aesthetics & keyframe mesh animation
└── database/           # SQLite databases storage (auto-created on server start)
```

---

## 📄 License

Distributed under the MIT License. Feel free to use this for your portfolio!

---

Built with ❤️ and Advanced AI
