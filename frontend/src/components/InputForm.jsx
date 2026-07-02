import ToneSelector from './ToneSelector';
import TemplateSelector from './TemplateSelector';

export default function InputForm({
  topic,
  setTopic,
  recipient,
  setRecipient,
  tone,
  setTone,
  additionalContext,
  setAdditionalContext,
  templates,
  onSelectTemplate,
  onGenerate,
  isLoading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <section className="compose-section">
      <h2 className="compose-title">
        <span className="compose-title-icon">✏️</span>
        Compose Email
      </h2>

      <TemplateSelector templates={templates} onSelect={onSelectTemplate} />

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="topic-input">Topic / Purpose</label>
            <input
              id="topic-input"
              className="form-input"
              type="text"
              placeholder="e.g., Request for leave, Follow up on meeting..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="recipient-input">Recipient</label>
            <input
              id="recipient-input"
              className="form-input"
              type="text"
              placeholder="e.g., Manager, Client, HR Department..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
        </div>

        <ToneSelector selectedTone={tone} onSelect={setTone} />

        <div className="form-group full-width" style={{ marginBottom: '16px' }}>
          <label className="form-label" htmlFor="context-input">Additional Context (optional)</label>
          <textarea
            id="context-input"
            className="form-textarea"
            placeholder="Any specific details, dates, or instructions for the email..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !topic.trim() || !recipient.trim()}
            id="generate-btn"
          >
            {isLoading ? (
              <>
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                Generating...
              </>
            ) : (
              <>✨ Generate Email</>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
