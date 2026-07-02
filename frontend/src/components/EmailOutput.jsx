import { useState } from 'react';

export default function EmailOutput({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  onSave,
  onRegenerate,
  onCopy,
  isLoading,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = fullEmail;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const charCount = body.length;

  return (
    <section className="output-section">
      <div className="output-header">
        <h2 className="output-title">
          📧 Generated Email
          <span className="output-title-badge">Ready</span>
        </h2>
        <div className="output-actions">
          <button
            className={`btn-icon copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            id="copy-btn"
          >
            {copied ? '✅' : '📋'}
          </button>
          <button
            className="btn-icon"
            onClick={onRegenerate}
            title="Regenerate email"
            disabled={isLoading}
            id="regenerate-btn"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="output-field-label">Subject</div>
      <input
        className="output-subject"
        type="text"
        value={subject}
        onChange={(e) => onSubjectChange(e.target.value)}
        placeholder="Subject line..."
        id="email-subject"
      />

      <div className="output-field-label">Body</div>
      <textarea
        className="output-body"
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        id="email-body"
      />

      <div className="output-footer">
        <span className="output-meta">
          <span className="output-meta-item">📝 {wordCount} words</span>
          <span className="output-meta-item">🔤 {charCount} chars</span>
          <span className="output-meta-item">✏️ Editable</span>
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            id="copy-full-btn"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
          <button
            className="btn btn-primary"
            onClick={onSave}
            id="save-draft-btn"
          >
            💾 Save Draft
          </button>
        </div>
      </div>
    </section>
  );
}
