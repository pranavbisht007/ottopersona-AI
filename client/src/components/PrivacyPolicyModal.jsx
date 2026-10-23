import React, { useEffect } from 'react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="privacy-modal-title" className="modal-title">Privacy Policy</h2>
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

          <h3>1. Overview</h3>
          <p>
            OttoPersona AI is committed to transparent, privacy-respecting communication assistance. This policy explains how your input data is handled during the transformation process.
          </p>

          <h3>2. Zero Server Persistence</h3>
          <p>
            We do not maintain a permanent database of user messages or identities:
          </p>
          <ul>
            <li>Original and rewritten messages are processed strictly in-memory during the lifetime of the HTTP request.</li>
            <li>No user accounts, tracking cookies, or persistent database tables store your message content on our server.</li>
            <li>Session edits exist solely within your active browser runtime until you reload or close the tab.</li>
          </ul>

          <h3>3. AI Provider Transmission</h3>
          <p>
            When you click "Transform Message", your input text and selected communication attributes (audience, purpose, tone, length, format) are securely transmitted via TLS encryption to our server and forwarded to our configured AI provider (Google Gemini API).
          </p>
          <p>
            Upstream processing is governed by Google Cloud's Gemini API Enterprise Data Privacy and Terms of Service. Requests processed via the Gemini Developer API are not used to train base foundation models without consent.
          </p>

          <h3>4. Security Safeguards</h3>
          <p>
            Our backend enforces defense-in-depth security:
          </p>
          <ul>
            <li>API credentials are kept strictly on the backend and never exposed in browser bundles or client code.</li>
            <li>Rate limiting is enforced per IP to prevent abusive traffic.</li>
            <li>HTTP Security headers (Content Security Policy, HSTS, X-Content-Type-Options) are enforced via Helmet.</li>
            <li>Inputs are sanitized against cross-site scripting (XSS) and validated against server-side allowlists.</li>
          </ul>

          <h3>5. Contact & Questions</h3>
          <p>
            For inquiries regarding security or privacy practices, please contact the OttoPersona AI development team via the project repository.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

