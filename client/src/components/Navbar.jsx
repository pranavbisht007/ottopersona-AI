import React from 'react';

export default function Navbar({
  theme,
  toggleTheme,
  openPrivacy,
  openTerms,
  openAdmin,
  onFocusInput
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo matching Pixgro style with sparkle mark */}
        <a href="#" className="brand" aria-label="OttoPersona AI Home">
          <div className="brand-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
            </svg>
          </div>
          <div className="brand-info">
            <span className="brand-title">OttoPersona<span className="brand-dot">.</span></span>
          </div>
        </a>

        {/* Center Floating Pill Menu matching reference */}
        <nav className="nav-pill-menu" aria-label="Main Navigation">
          <a href="#" className="nav-pill-item active">Home</a>
          <a href="#workspace" onClick={(e) => { e.preventDefault(); if (onFocusInput) onFocusInput(); }} className="nav-pill-item">Workspace</a>
          <button type="button" onClick={openAdmin} className="nav-pill-item btn-link-nav">Diagnostics</button>
          <button type="button" onClick={openPrivacy} className="nav-pill-item btn-link-nav">Privacy</button>
        </nav>

        {/* Right CTA Actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="nav-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="nav-cta-pill"
            onClick={openAdmin}
          >
            <span>Diagnostics</span>
          </button>
        </div>
      </div>
    </header>
  );
}
