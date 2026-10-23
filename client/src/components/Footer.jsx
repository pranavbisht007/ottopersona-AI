import React from 'react';

export default function Footer({ openPrivacy, openTerms }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-row">
          <div className="footer-brand">
            OttoPersona AI — Instant Persona & Context-Aware Communication Transformer
          </div>
          <div className="footer-links">
            <button
              type="button"
              className="footer-link"
              onClick={openPrivacy}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={openTerms}
            >
              Terms & Conditions
            </button>
          </div>
        </div>

        <div className="footer-notice">
          <strong>Privacy Notice:</strong> Message transformation requests are transmitted to the configured AI provider (Google Gemini API) to generate contextual revisions. Text is processed in-memory and is not stored in a persistent database or user-profile tracking system on our servers.
        </div>
      </div>
    </footer>
  );
}
