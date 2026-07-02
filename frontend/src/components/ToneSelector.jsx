const tones = [
  { id: 'formal', name: 'Formal', icon: '🎩', color: '#3b82f6' },
  { id: 'professional', name: 'Professional', icon: '💼', color: '#6366f1' },
  { id: 'friendly', name: 'Friendly', icon: '😊', color: '#10b981' },
  { id: 'apologetic', name: 'Apologetic', icon: '🙏', color: '#f59e0b' },
  { id: 'persuasive', name: 'Persuasive', icon: '💡', color: '#8b5cf6' },
  { id: 'thankful', name: 'Thankful', icon: '❤️', color: '#f43f5e' },
  { id: 'follow-up', name: 'Follow-up', icon: '🔄', color: '#06b6d4' },
];

export default function ToneSelector({ selectedTone, onSelect }) {
  return (
    <div className="form-group full-width">
      <label className="form-label">Tone</label>
      <div className="tone-grid">
        {tones.map((tone) => (
          <div
            key={tone.id}
            className={`tone-card ${selectedTone === tone.id ? 'selected' : ''}`}
            style={{
              '--tone-color': tone.color,
              '--tone-bg': `${tone.color}15`,
              '--tone-glow': `${tone.color}30`,
            }}
            onClick={() => onSelect(tone.id)}
            id={`tone-${tone.id}`}
          >
            <span className="tone-icon">{tone.icon}</span>
            <span className="tone-name">{tone.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { tones };
