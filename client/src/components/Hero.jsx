import React from 'react';

export default function Hero({ onFocusInput }) {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-badge">Context-Aware Communication Assistant</div>
      <h1 id="hero-heading" className="hero-title">
        Say It Right. Every Time.
      </h1>
      <p className="hero-description">
        Transform your message for the right audience, purpose, and tone — without losing what you mean.
      </p>
      <button
        type="button"
        className="hero-action-btn"
        onClick={onFocusInput}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
        <span>Transform My Message</span>
      </button>
    </section>
  );
}

