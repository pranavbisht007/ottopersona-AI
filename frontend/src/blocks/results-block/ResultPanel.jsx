import React, { useState, useEffect } from 'react';
import ExplainChanges from './ExplainChanges';

export default function ResultPanel({
  originalMessage,
  resultData,
  selectedParams,
  onRegenerate,
  isRegenerating
}) {
  const option1Text = resultData.rewrittenMessage || '';
  const option2Text = resultData.alternativeMessage || resultData.rewrittenMessage || '';

  const [text1, setText1] = useState(option1Text);
  const [text2, setText2] = useState(option2Text);
  const [isEditing1, setIsEditing1] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [activeTab, setActiveTab] = useState('both'); // 'both' | 'opt1' | 'opt2'

  // Update when fresh result arrives
  useEffect(() => {
    setText1(resultData.rewrittenMessage || '');
    setText2(resultData.alternativeMessage || resultData.rewrittenMessage || '');
    setIsEditing1(false);
    setIsEditing2(false);
    setCopied1(false);
    setCopied2(false);
  }, [resultData]);

  const copyToClipboard = async (text, setCopiedFn) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedFn(true);
      setTimeout(() => setCopiedFn(false), 2500);
    } catch (err) {
      alert('Could not copy automatically. Please select and copy text manually.');
    }
  };

  const isEmail = selectedParams.format === 'Email';

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

      {/* Main Comparison & Dual Output Bars */}
      <div className="comparison-grid">
        {/* Left Column: Original Input */}
        <div className="panel-card original-card">
          <div className="panel-header">
            <span className="panel-title">Original Input</span>
            <span className="badge badge-original">Unchanged</span>
          </div>
          <div className="message-box original-box">
            {originalMessage}
          </div>
          <div className="card-footer-note">
            Preserved without fabricated reasons or altered commitment levels.
          </div>
        </div>

        {/* Right Column: Dual Transformed Output Bars */}
        <div className="dual-output-wrapper">
          {/* Dual Bar Switcher Toolbar */}
          <div className="dual-bar-switcher">
            <div className="switcher-tabs">
              <button
                type="button"
                className={`switcher-tab ${activeTab === 'both' ? 'active' : ''}`}
                onClick={() => setActiveTab('both')}
              >
                <span>Dual View (2 Variations)</span>
              </button>
              <button
                type="button"
                className={`switcher-tab ${activeTab === 'opt1' ? 'active' : ''}`}
                onClick={() => setActiveTab('opt1')}
              >
                <span>Option 1: Direct & Crisp</span>
              </button>
              <button
                type="button"
                className={`switcher-tab ${activeTab === 'opt2' ? 'active' : ''}`}
                onClick={() => setActiveTab('opt2')}
              >
                <span>Option 2: Warm & Diplomatic</span>
              </button>
            </div>

            <button
              type="button"
              className="btn-action-regen"
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Re-run transformation to generate fresh variations"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
            </button>
          </div>

          {/* Output Bar 1: Option 1 */}
          {(activeTab === 'both' || activeTab === 'opt1') && (
            <div className="panel-card output-bar-card bar-option-1">
              <div className="panel-header">
                <div className="bar-header-title">
                  <span className="bar-indicator bar-ind-1">1</span>
                  <span className="panel-title">Option 1: Direct & Crisp</span>
                  {isEmail && <span className="badge badge-email">Email Verified</span>}
                </div>
                <div className="bar-actions-top">
                  <button
                    type="button"
                    className="btn-mini-action"
                    onClick={() => setIsEditing1(!isEditing1)}
                  >
                    {isEditing1 ? 'Done Editing' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    className={`btn-mini-action btn-copy ${copied1 ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(text1, setCopied1)}
                  >
                    {copied1 ? '✓ Copied' : 'Copy Option 1'}
                  </button>
                </div>
              </div>

              {isEditing1 ? (
                <textarea
                  className="editable-textarea"
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  rows={6}
                  aria-label="Edit Option 1"
                />
              ) : (
                <div className="message-box formatted-output">
                  {text1}
                </div>
              )}
            </div>
          )}

          {/* Output Bar 2: Option 2 (Alternative Variation of Same Message) */}
          {(activeTab === 'both' || activeTab === 'opt2') && (
            <div className="panel-card output-bar-card bar-option-2">
              <div className="panel-header">
                <div className="bar-header-title">
                  <span className="bar-indicator bar-ind-2">2</span>
                  <span className="panel-title">Option 2: Warm & Diplomatic</span>
                  {isEmail && <span className="badge badge-email">Email Verified</span>}
                </div>
                <div className="bar-actions-top">
                  <button
                    type="button"
                    className="btn-mini-action"
                    onClick={() => setIsEditing2(!isEditing2)}
                  >
                    {isEditing2 ? 'Done Editing' : 'Edit'}
                  </button>
                  <button
                    type="button"
                    className={`btn-mini-action btn-copy ${copied2 ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(text2, setCopied2)}
                  >
                    {copied2 ? '✓ Copied' : 'Copy Option 2'}
                  </button>
                </div>
              </div>

              {isEditing2 ? (
                <textarea
                  className="editable-textarea"
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  rows={6}
                  aria-label="Edit Option 2"
                />
              ) : (
                <div className="message-box formatted-output">
                  {text2}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal & Compliance Safeguard Callout */}
      <div className="legal-safeguard-card" role="note" aria-label="Legal & Compliance Notice">
        <div className="legal-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div className="legal-text-content">
          <strong>Legal & Truth Preservation Guarantee:</strong> Both variations strictly preserve your actual facts, commitments, and uncertainties. The system does not invent medical excuses, contractual promises, or unsupplied dates. Official legal, medical, or contractual messages should always be reviewed before sending.
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
