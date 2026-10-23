import React from 'react';

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="error-card" role="alert">
      <div className="error-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div className="error-content">
        <div className="error-title">
          {error.code ? `Error (${error.code})` : 'Transformation Notice'}
        </div>
        <div className="error-text">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '2px 6px' }}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}
