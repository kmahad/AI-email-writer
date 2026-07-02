import { useState } from 'react';

export default function Header({ onOpenSettings }) {
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
