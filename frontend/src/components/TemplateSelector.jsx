export default function TemplateSelector({ templates, onSelect }) {
  if (!templates || templates.length === 0) return null;

  return (
    <div className="templates-section">
      <div className="templates-header">
        <span className="templates-label">Quick Templates</span>
      </div>
      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => onSelect(template)}
            id={`template-${template.id}`}
          >
            <span className="template-card-icon">{template.icon}</span>
            <span className="template-card-name">{template.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
