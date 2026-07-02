import { useState, useEffect } from 'react';

export default function SettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('openai');
  
  // OpenAI states
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');
  
  // Gemini states
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  
  // Ollama states
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProvider(localStorage.getItem('ai_provider') || 'openai');
      
      setOpenaiApiKey(localStorage.getItem('openai_api_key') || '');
      setOpenaiModel(localStorage.getItem('openai_model') || 'gpt-4o-mini');
      
      setGeminiApiKey(localStorage.getItem('gemini_api_key') || '');
      setGeminiModel(localStorage.getItem('gemini_model') || 'gemini-2.5-flash');
      
      setOllamaUrl(localStorage.getItem('ollama_url') || 'http://localhost:11434');
      setOllamaModel(localStorage.getItem('ollama_model') || 'llama3');
      
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('ai_provider', provider);
    
    // Save OpenAI
    if (openaiApiKey.trim()) {
      localStorage.setItem('openai_api_key', openaiApiKey.trim());
    } else {
      localStorage.removeItem('openai_api_key');
    }
    localStorage.setItem('openai_model', openaiModel);

    // Save Gemini
    if (geminiApiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    localStorage.setItem('gemini_model', geminiModel);

    // Save Ollama
    localStorage.setItem('ollama_url', ollamaUrl.trim() || 'http://localhost:11434');
    localStorage.setItem('ollama_model', ollamaModel.trim() || 'llama3');

    setSaved(true);
    
    // Dispatch event to update components in the same window (e.g. Header)
    window.dispatchEvent(new Event('settings-changed'));

    setTimeout(() => onClose(), 800);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">⚙️ AI Settings</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="provider-select">AI Provider</label>
            <select
              id="provider-select"
              className="form-select"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="openai">OpenAI (Paid Key Required)</option>
              <option value="gemini">Google Gemini (Free API Key Available)</option>
              <option value="ollama">Ollama (Fully Local & Offline)</option>
            </select>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />

          {provider === 'openai' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="openai-key-input">OpenAI API Key</label>
                <input
                  id="openai-key-input"
                  className="form-input"
                  type="password"
                  placeholder="sk-..."
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Optional — uses server key if not set.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="openai-model-select">Model</label>
                <select
                  id="openai-model-select"
                  className="form-select"
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cheap)</option>
                  <option value="gpt-4o">GPT-4o (Best Quality)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                </select>
              </div>
            </>
          )}

          {provider === 'gemini' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="gemini-key-input">Gemini API Key</label>
                <input
                  id="gemini-key-input"
                  className="form-input"
                  type="password"
                  placeholder="Paste Gemini API key..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-accent)' }}>Google AI Studio</a>.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="gemini-model-select">Model</label>
                <select
                  id="gemini-model-select"
                  className="form-select"
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest & Recommended)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Quality)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                </select>
              </div>
            </>
          )}

          {provider === 'ollama' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="ollama-url-input">Ollama Local URL</label>
                <input
                  id="ollama-url-input"
                  className="form-input"
                  type="text"
                  placeholder="http://localhost:11434"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ollama-model-input">Ollama Model Name</label>
                <input
                  id="ollama-model-input"
                  className="form-input"
                  type="text"
                  placeholder="llama3"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Must run `ollama run &lt;model-name&gt;` on your PC first (e.g. llama3, mistral, gemma).
                </span>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
            onClick={handleSave}
            id="save-settings-btn"
          >
            {saved ? '✅ Saved!' : '💾 Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
