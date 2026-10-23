import React from 'react';

export default function ExplainChanges({ explanation, improvements = [] }) {
  if (!explanation && (!improvements || improvements.length === 0)) {
    return null;
  }

  return (
    <div className="explanation-card" aria-label="Transformation Details">
      <div className="explanation-header">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Why these adjustments were made</span>
      </div>

      {explanation && <p className="explanation-text">{explanation}</p>}

      {improvements && improvements.length > 0 && (
        <ul className="improvements-list">
          {improvements.map((item, idx) => (
            <li key={idx} className="improvement-item">
              <span className="improvement-bullet" aria-hidden="true">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

