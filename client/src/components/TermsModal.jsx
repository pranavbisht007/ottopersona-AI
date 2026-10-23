import React, { useEffect } from 'react';

export default function TermsModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="terms-modal-title" className="modal-title">Terms & Conditions</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p><em>Last updated: October 2026</em></p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using OttoPersona AI, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, do not use the service.
          </p>

          <h3>2. Core Service Description</h3>
          <p>
            OttoPersona AI provides context-aware communication rewriting designed to adapt tone, format, and structure for specific audiences (e.g., teachers, recruiters, managers, friends).
          </p>

          <h3>3. Meaning Preservation & Accuracy Disclaimer</h3>
          <p>
            While OttoPersona AI employs strict system instructions to preserve factual claims, commitments, and uncertainties without fabricating excuses or dates:
          </p>
          <ul>
            <li>The rewritten messages are generated using AI language models and are provided for review and editing.</li>
            <li>We do not guarantee that AI-generated messages are completely error-free or legally binding.</li>
            <li>Users remain solely responsible for reviewing and verifying the accuracy and appropriateness of any message before sending it to third parties.</li>
          </ul>

          <h3>4. Acceptable Use</h3>
          <p>
            You agree not to use the service for:
          </p>
          <ul>
            <li>Transmitting malicious, defamatory, abusive, fraudulent, or harassing content.</li>
            <li>Attempting to bypass access controls, spamming endpoints, or launching denial-of-service attacks.</li>
            <li>Automated scraping or bypassing rate limiting controls.</li>
          </ul>

          <h3>5. Limitation of Liability</h3>
          <p>
            In no event shall the authors or project maintainers be liable for any damages arising out of the use or inability to use this communication transformation service.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
}
