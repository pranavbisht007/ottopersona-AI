import React from 'react';

export default function Hero({ onFocusInput }) {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      {/* Background Watermark Typography */}
      <div className="hero-watermark" aria-hidden="true">
        OttoPersona
      </div>

      {/* Social Proof Rating Badge */}
      <div className="hero-rating-pill">
        <span className="rating-score">5.0</span>
        <span className="rating-star">★</span>
        <div className="rating-avatars" aria-hidden="true">
          <span className="avatar-dot avatar-1"></span>
          <span className="avatar-dot avatar-2"></span>
          <span className="avatar-dot avatar-3"></span>
        </div>
        <span className="rating-text">1,000+ Transformed Messages</span>
      </div>

      {/* Main Headline */}
      <h1 id="hero-heading" className="hero-title">
        Scale Your Words With<br />
        <span className="hero-title-highlight">Unlimited Precision</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-description">
        Transform your communication for any audience, purpose, and tone — preserving your authentic factual meaning, commitments, and uncertainty without inventing excuses.
      </p>

      {/* Primary CTA Button */}
      <div className="hero-cta-wrapper">
        <button
          type="button"
          className="hero-action-pill"
          onClick={onFocusInput}
        >
          <span>Get Started</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/* Floating Rotating Experience Badge */}
      <div className="hero-floating-badge" aria-hidden="true">
        <div className="badge-ring">
          <svg viewBox="0 0 100 100" className="badge-text-svg">
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text>
              <textPath href="#circlePath" className="badge-text-path">
                • ZERO INVENTED EXCUSES • 100% MEANING
              </textPath>
            </text>
          </svg>
          <div className="badge-center-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
