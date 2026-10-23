import React, { useState } from 'react';
import ExplainChanges from './ExplainChanges';

export default function ResultPanel({
  originalMessage,
  resultData,
  selectedParams,
  onRegenerate,
  isRegenerating
}) {
  const [editedText, setEditedText] = useState(resultData.rewrittenMessage);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // If resultData changes from a fresh regeneration, update editedText
  React.useEffect(() => {
    setEditedText(resultData.rewrittenMessage);
    setIsEditing(false);
  }, [resultData]);

  const hasBeenEdited = editedText !== resultData.rewrittenMessage;

  const handleCopy = async () => {
    try {
      const textToCopy = editedText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers or restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  return (
    <div className="results-container" aria-live="polite">
      {/* Parameter Badges */}
      <div className="params-summary">
        <span className="param-pill">
          Audience: <strong>{selectedParams.audience}</strong>
        </span>
        <span className="param-pill">
          Purpose: <strong>{selectedParams.purpose}</strong>
        </span>
        <span className="param-pill">
          Tone: <strong>{selectedParams.tone}</strong>
        </span>
        <span className="param-pill">
          Length: <strong>{selectedParams.length}</strong>
        </span>
        <span className="param-pill">
          Format: <strong>{selectedParams.format}</strong>
        </span>
        {selectedParams.language && (
          <span className="param-pill">
            Language: <strong>{selectedParams.language}</strong>
          </span>
        )}
      </div>

      {/* Side-by-Side Comparison */}
      <div className="comparison-grid">
        {/* Left Column: Original Message */}
        <div className="panel-card">
          <div className="panel-header">
            <span className="panel-title">Original Input</span>
            <span className="badge badge-original">Unchanged</span>
          </div>
          <div className="message-box">
            {originalMessage}
          </div>
        </div>

        {/* Right Column: Rewritten Message */}
        <div className="panel-card">
          <div className="panel-header">
            <span className="panel-title">Transformed Message</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge badge-ai">Context-Adapted</span>
              {hasBeenEdited && <span className="badge badge-edited">Customized</span>}
            </div>
          </div>

          {isEditing ? (
            <textarea
              className="editable-textarea"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              aria-label="Edit transformed message"
            />
          ) : (
            <div className="message-box">
              {editedText}
            </div>
          )}

          <div className="panel-actions">
            <button
              type="button"
              className="btn-action"
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? 'Done editing' : 'Edit transformed text directly'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>{isEditing ? 'Done Editing' : 'Edit Output'}</span>
            </button>

            <button
              type="button"
              className={`btn-action ${copied ? 'success' : ''}`}
              onClick={handleCopy}
              title="Copy message to clipboard"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Re-run transformation with current parameters"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>
          {copyError && (
            <span style={{ fontSize: '12px', color: 'var(--status-error)', marginTop: '4px', textAlign: 'right' }}>
              Could not access clipboard automatically. Please select and copy text manually.
            </span>
          )}
        </div>
      </div>

      {/* Explanation Callout */}
      <ExplainChanges
        explanation={resultData.explanation}
        improvements={resultData.improvements}
      />
    </div>
  );
}

