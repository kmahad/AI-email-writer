# ✉️ AI Email Writer

A desktop AI-powered Email Writer application built with React, Node.js, and Electron. Generate context-aware emails with customizable tone, save drafts locally, and package as a Windows executable.

![AI Email Writer](https://img.shields.io/badge/AI-Email%20Writer-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Electron](https://img.shields.io/badge/Electron-33-47848f?style=for-the-badge&logo=electron)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js)

## ✨ Features

- 🤖 **AI-Powered Generation** — Uses OpenAI GPT to generate professional emails
- 🎨 **7 Tone Options** — Formal, Professional, Friendly, Apologetic, Persuasive, Thankful, Follow-up
- 📝 **Smart Templates** — Pre-built templates for common email types
- 💾 **Local Draft Storage** — Save and manage drafts with SQLite
- 📋 **Copy to Clipboard** — One-click copy for generated emails
- ✏️ **Editable Output** — Edit generated emails before saving
- 🔍 **Search Drafts** — Find saved drafts quickly
- 🖥️ **Desktop App** — Runs as a native Windows application (.exe)
- 🌑 **Premium Dark UI** — Beautiful glassmorphism design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Node.js (Express) |
| Database | SQLite (better-sqlite3) |
| AI | OpenAI API (GPT-4o-mini) |
| Desktop | Electron |
| Styling | Vanilla CSS (Glassmorphism) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-email-writer.git
   cd ai-email-writer
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your OpenAI API key
   ```

4. **Run in development**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Run as Desktop App

```bash
npm run electron:dev
```

### Build Windows Executable

```bash
npm run dist
```

The `.exe` installer will be in the `dist-electron/` folder.

## 📁 Project Structure

```
ai-email-writer/
├── frontend/           # React (Vite) UI
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── InputForm.jsx
│       │   ├── ToneSelector.jsx
│       │   ├── TemplateSelector.jsx
│       │   ├── EmailOutput.jsx
│       │   ├── HistoryPanel.jsx
│       │   └── SettingsModal.jsx
│       ├── App.jsx
│       └── index.css
├── backend/            # Express API
│   ├── server.js
│   ├── ai.js
│   └── db.js
├── electron/           # Electron shell
│   ├── main.js
│   └── preload.js
└── database/           # SQLite (auto-created)
```

## 📸 Screenshots

<!-- Add screenshots here -->

## 📄 License

MIT License — feel free to use this for your portfolio!

---

Built with ❤️ and AI
