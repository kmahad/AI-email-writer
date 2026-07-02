const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'emails.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create drafts table
db.exec(`
  CREATE TABLE IF NOT EXISTS drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    recipient TEXT NOT NULL,
    tone TEXT NOT NULL,
    subject TEXT DEFAULT '',
    body TEXT NOT NULL,
    template_name TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepared statements for performance
const statements = {
  insertDraft: db.prepare(`
    INSERT INTO drafts (topic, recipient, tone, subject, body, template_name)
    VALUES (@topic, @recipient, @tone, @subject, @body, @templateName)
  `),

  getAllDrafts: db.prepare(`
    SELECT * FROM drafts ORDER BY updated_at DESC
  `),

  getDraftById: db.prepare(`
    SELECT * FROM drafts WHERE id = ?
  `),

  updateDraft: db.prepare(`
    UPDATE drafts 
    SET topic = @topic, recipient = @recipient, tone = @tone, 
        subject = @subject, body = @body, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  deleteDraft: db.prepare(`
    DELETE FROM drafts WHERE id = ?
  `),

  searchDrafts: db.prepare(`
    SELECT * FROM drafts 
    WHERE topic LIKE @query OR recipient LIKE @query OR body LIKE @query
    ORDER BY updated_at DESC
  `)
};

module.exports = {
  db,
  
  createDraft({ topic, recipient, tone, subject, body, templateName }) {
    const result = statements.insertDraft.run({ topic, recipient, tone, subject, body, templateName: templateName || null });
    return statements.getDraftById.get(result.lastInsertRowid);
  },

  getAllDrafts() {
    return statements.getAllDrafts.all();
  },

  getDraftById(id) {
    return statements.getDraftById.get(id);
  },

  updateDraft(id, { topic, recipient, tone, subject, body }) {
    statements.updateDraft.run({ id, topic, recipient, tone, subject, body });
    return statements.getDraftById.get(id);
  },

  deleteDraft(id) {
    const draft = statements.getDraftById.get(id);
    if (!draft) return null;
    statements.deleteDraft.run(id);
    return draft;
  },

  searchDrafts(query) {
    return statements.searchDrafts.all({ query: `%${query}%` });
  }
};
