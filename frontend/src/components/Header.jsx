import { useState, useEffect } from 'react';

export default function Header({ onOpenSettings }) {
  const [provider, setProvider] = useState('openai');

  useEffect(() => {
    const stored = localStorage.getItem('ai_provider') || 'openai';
    setProvider(stored);

    // Listen for storage changes from settings modal
    const handleStorage = () => {
      setProvider(localStorage.getItem('ai_provider') || 'openai');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('settings-changed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('settings-changed', handleStorage);
    };
  }, []);

  const providerLabels = {
    openai: 'OpenAI',
    gemini: 'Gemini',
    ollama: 'Ollama',
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">✉️</div>
        <div>
          <div className="header-title">AI Email Writer</div>
          <div className="header-subtitle">Craft perfect emails with AI</div>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-provider-badge">
          <span className="header-provider-dot"></span>
          {providerLabels[provider] || provider}
        </div>
        <button
          className="header-btn"
          onClick={onOpenSettings}
          title="Settings"
          id="settings-btn"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
