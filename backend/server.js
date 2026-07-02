require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateEmail, templates } = require('./ai');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Email Generation ────────────────────────────────────────────
app.post('/api/generate-email', async (req, res) => {
  try {
    const { provider, topic, recipient, tone, additionalContext, apiKey, model, localUrl } = req.body;

    if (!topic || !recipient || !tone) {
      return res.status(400).json({ 
        error: 'Missing required fields: topic, recipient, and tone are required.' 
      });
    }

    const result = await generateEmail({ provider, topic, recipient, tone, additionalContext, apiKey, model, localUrl });
    res.json(result);
  } catch (error) {
    console.error('Email generation error:', error.message);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment and try again.' });
    }
    
    res.status(500).json({ error: error.message || 'Failed to generate email. Please try again.' });
  }
});

// ─── Templates ───────────────────────────────────────────────────
app.get('/api/templates', (req, res) => {
  res.json(templates);
});

// ─── Drafts CRUD ─────────────────────────────────────────────────
app.post('/api/drafts', (req, res) => {
  try {
    const { topic, recipient, tone, subject, body, templateName } = req.body;

    if (!topic || !body) {
      return res.status(400).json({ error: 'Topic and body are required.' });
    }

    const draft = db.createDraft({ 
      topic, 
      recipient: recipient || '', 
      tone: tone || 'professional', 
      subject: subject || '', 
      body, 
      templateName 
    });
    res.status(201).json(draft);
  } catch (error) {
    console.error('Create draft error:', error.message);
    res.status(500).json({ error: 'Failed to save draft.' });
  }
});

app.get('/api/drafts', (req, res) => {
  try {
    const { search } = req.query;
    const drafts = search ? db.searchDrafts(search) : db.getAllDrafts();
    res.json(drafts);
  } catch (error) {
    console.error('Get drafts error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve drafts.' });
  }
});

app.get('/api/drafts/:id', (req, res) => {
  try {
    const draft = db.getDraftById(parseInt(req.params.id));
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found.' });
    }
    res.json(draft);
  } catch (error) {
    console.error('Get draft error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve draft.' });
  }
});

app.put('/api/drafts/:id', (req, res) => {
  try {
    const { topic, recipient, tone, subject, body } = req.body;
    const existing = db.getDraftById(parseInt(req.params.id));
    
    if (!existing) {
      return res.status(404).json({ error: 'Draft not found.' });
    }

    const updated = db.updateDraft(parseInt(req.params.id), {
      topic: topic || existing.topic,
      recipient: recipient || existing.recipient,
      tone: tone || existing.tone,
      subject: subject || existing.subject,
      body: body || existing.body
    });
    res.json(updated);
  } catch (error) {
    console.error('Update draft error:', error.message);
    res.status(500).json({ error: 'Failed to update draft.' });
  }
});

app.delete('/api/drafts/:id', (req, res) => {
  try {
    const deleted = db.deleteDraft(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Draft not found.' });
    }
    res.json({ message: 'Draft deleted successfully.', draft: deleted });
  } catch (error) {
    console.error('Delete draft error:', error.message);
    res.status(500).json({ error: 'Failed to delete draft.' });
  }
});

// ─── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✉️  AI Email Writer API running on http://localhost:${PORT}`);
  console.log(`  📋 Templates: GET /api/templates`);
  console.log(`  ✨ Generate:  POST /api/generate-email`);
  console.log(`  💾 Drafts:    GET/POST /api/drafts\n`);
});

module.exports = app;
