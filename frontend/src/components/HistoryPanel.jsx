import { useState } from 'react';

const toneColors = {
  formal: '#3b82f6',
  professional: '#6366f1',
  friendly: '#10b981',
  apologetic: '#f59e0b',
  persuasive: '#8b5cf6',
  thankful: '#f43f5e',
  'follow-up': '#06b6d4',
};

export default function HistoryPanel({ drafts, activeDraftId, onSelectDraft, onDeleteDraft, searchQuery, onSearchChange }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeleteDraft(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">💾 Saved Drafts</h3>
        <input
          className="sidebar-search"
          type="text"
          placeholder="Search drafts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-drafts"
        />
      </div>

      <div className="sidebar-list">
        {drafts.length === 0 ? (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">📝</div>
            <div className="sidebar-empty-text">
              No drafts yet.<br />
              Generate an email and save it!
            </div>
          </div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className={`draft-card ${activeDraftId === draft.id ? 'active' : ''}`}
              onClick={() => onSelectDraft(draft)}
              id={`draft-${draft.id}`}
            >
              <div className="draft-card-topic">{draft.subject || draft.topic}</div>
              <div className="draft-card-meta">
                <span
                  className="draft-card-tone"
                  style={{
                    background: `${toneColors[draft.tone] || '#6366f1'}20`,
                    color: toneColors[draft.tone] || '#6366f1',
                  }}
                >
                  {draft.tone}
                </span>
                <span>→ {draft.recipient}</span>
                <span>• {formatDate(draft.updated_at || draft.created_at)}</span>
              </div>
              <button
                className="draft-card-delete"
                onClick={(e) => handleDelete(e, draft.id)}
                title={deletingId === draft.id ? 'Click again to confirm' : 'Delete draft'}
                id={`delete-draft-${draft.id}`}
              >
                {deletingId === draft.id ? '❗' : '🗑️'}
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
