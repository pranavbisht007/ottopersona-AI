import React from 'react';

export default function LoadingState({ statusText = 'Analyzing context and crafting message...' }) {
  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <div className="loading-title">{statusText}</div>
      <div className="loading-text">
        Preserving core facts, commitments, and uncertainty while adjusting tone and format.
      </div>
    </div>
  );
}
