import { useState, useEffect, useCallback } from 'react';
import './index.css';
import Header from './components/Header';
import InputForm from './components/InputForm';
import EmailOutput from './components/EmailOutput';
import HistoryPanel from './components/HistoryPanel';
import SettingsModal from './components/SettingsModal';

const API_BASE = 'http://localhost:3001/api';

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type} ${t.exiting ? 'toast-exit' : ''}`}>
          {t.type === 'success' && '✅'}
          {t.type === 'error' && '❌'}
          {t.type === 'info' && 'ℹ️'}
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  // Form state
  const [topic, setTopic] = useState('');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('professional');
  const [additionalContext, setAdditionalContext] = useState('');

  // Output state
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Drafts state
  const [drafts, setDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Templates state
  const [templates, setTemplates] = useState([]);

  // UI state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ── Toast helper ──────────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3000);
  }, []);

  // ── Load templates & drafts on mount ──────────────────────────
  useEffect(() => {
    fetchTemplates();
    fetchDrafts();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/templates`);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch {
      // Backend may not be running yet
      console.log('Could not fetch templates — backend may be starting up.');
    }
  };

  const fetchDrafts = async () => {
    try {
      const url = searchQuery
        ? `${API_BASE}/drafts?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE}/drafts`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      }
    } catch {
      console.log('Could not fetch drafts — backend may be starting up.');
    }
  };

  // Refetch drafts when search changes
  useEffect(() => {
    const timer = setTimeout(fetchDrafts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Generate email ────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!topic.trim() || !recipient.trim()) return;

    setIsLoading(true);
    setHasGenerated(false);

    try {
      const provider = localStorage.getItem('ai_provider') || 'openai';
      let apiKey = undefined;
      let model = undefined;
      let localUrl = undefined;

      if (provider === 'openai') {
        apiKey = localStorage.getItem('openai_api_key') || undefined;
        model = localStorage.getItem('openai_model') || 'gpt-4o-mini';
      } else if (provider === 'gemini') {
        apiKey = localStorage.getItem('gemini_api_key') || undefined;
        model = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
      } else if (provider === 'ollama') {
        model = localStorage.getItem('ollama_model') || 'llama3';
        localUrl = localStorage.getItem('ollama_url') || 'http://localhost:11434';
      }

      const res = await fetch(`${API_BASE}/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          topic: topic.trim(),
          recipient: recipient.trim(),
          tone,
          additionalContext: additionalContext.trim() || undefined,
          apiKey,
          model,
          localUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await res.json();
      setGeneratedSubject(data.subject || '');
      setGeneratedBody(data.body || data.fullText || '');
      setHasGenerated(true);
      setActiveDraftId(null);
      addToast('Email generated successfully!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to generate email', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Save draft ────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    try {
      const method = activeDraftId ? 'PUT' : 'POST';
      const url = activeDraftId
        ? `${API_BASE}/drafts/${activeDraftId}`
        : `${API_BASE}/drafts`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          recipient,
          tone,
          subject: generatedSubject,
          body: generatedBody,
        }),
      });

      if (!res.ok) throw new Error('Failed to save draft');

      const savedDraft = await res.json();
      setActiveDraftId(savedDraft.id);
      await fetchDrafts();
      addToast(activeDraftId ? 'Draft updated!' : 'Draft saved!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to save draft', 'error');
    }
  };

  // ── Select draft from sidebar ─────────────────────────────────
  const handleSelectDraft = (draft) => {
    setTopic(draft.topic);
    setRecipient(draft.recipient);
    setTone(draft.tone);
    setGeneratedSubject(draft.subject || '');
    setGeneratedBody(draft.body);
    setHasGenerated(true);
    setActiveDraftId(draft.id);
    setAdditionalContext('');
  };

  // ── Delete draft ──────────────────────────────────────────────
  const handleDeleteDraft = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/drafts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete draft');

      if (activeDraftId === id) {
        setActiveDraftId(null);
        setHasGenerated(false);
        setGeneratedSubject('');
        setGeneratedBody('');
      }
      await fetchDrafts();
      addToast('Draft deleted', 'info');
    } catch (error) {
      addToast(error.message || 'Failed to delete draft', 'error');
    }
  };

  // ── Select template ───────────────────────────────────────────
  const handleSelectTemplate = (template) => {
    setTopic(template.topic || '');
    setRecipient(template.recipient || '');
    setTone(template.tone || 'professional');
    setAdditionalContext(template.context || '');
    setActiveDraftId(null);
    addToast(`Template "${template.name}" loaded`, 'info');
  };

  // ── Copy feedback ─────────────────────────────────────────────
  const handleCopyFeedback = () => {
    addToast('Copied to clipboard!', 'success');
  };

  return (
    <div className="app">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <div className="app-body">
        <HistoryPanel
          drafts={drafts}
          activeDraftId={activeDraftId}
          onSelectDraft={handleSelectDraft}
          onDeleteDraft={handleDeleteDraft}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="main-content">
          <InputForm
            topic={topic}
            setTopic={setTopic}
            recipient={recipient}
            setRecipient={setRecipient}
            tone={tone}
            setTone={setTone}
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">AI is crafting your email...</div>
              <div className="loading-subtext">This usually takes a few seconds</div>
            </div>
          )}

          {hasGenerated && !isLoading && (
            <EmailOutput
              subject={generatedSubject}
              body={generatedBody}
              onSubjectChange={setGeneratedSubject}
              onBodyChange={setGeneratedBody}
              onSave={handleSaveDraft}
              onRegenerate={handleGenerate}
              onCopy={handleCopyFeedback}
              isLoading={isLoading}
            />
          )}

          {!hasGenerated && !isLoading && (
            <div className="welcome-section">
              <div className="welcome-icon">✉️</div>
              <h3 className="welcome-title">Ready to Write</h3>
              <p className="welcome-desc">
                Fill in the details above, pick a tone, and let AI craft the perfect email for you.
              </p>
              <div className="welcome-steps">
                <div className="welcome-step">
                  <div className="welcome-step-num">1</div>
                  <div className="welcome-step-text">Fill Details</div>
                </div>
                <div className="welcome-step">
                  <div className="welcome-step-num">2</div>
                  <div className="welcome-step-text">Pick Tone</div>
                </div>
                <div className="welcome-step">
                  <div className="welcome-step-num">3</div>
                  <div className="welcome-step-text">Generate</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
