import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MessageInput from './components/MessageInput';
import AudienceSelector from './components/AudienceSelector';
import PurposeSelector from './components/PurposeSelector';
import ToneSelector from './components/ToneSelector';
import LengthSelector from './components/LengthSelector';
import FormatSelector from './components/FormatSelector';
import ResultPanel from './components/ResultPanel';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsModal from './components/TermsModal';
import AdminDiagnosticsModal from './components/AdminDiagnosticsModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ottopersona_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ottopersona_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Form input state with sensible defaults
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('General audience');
  const [purpose, setPurpose] = useState('General communication');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [format, setFormat] = useState('General text message');

  // Application flow state
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  // Snapshot of parameters used for the current result
  const [appliedParams, setAppliedParams] = useState(null);

  // Modals state
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current.focus();
    }
  };

  const handleApplyPreset = (preset) => {
    setMessage(preset.message);
    if (preset.audience) setAudience(preset.audience);
    if (preset.purpose) setPurpose(preset.purpose);
    if (preset.tone) setTone(preset.tone);
    if (preset.length) setLength(preset.length);
    if (preset.format) setFormat(preset.format);
    setError(null);
  };

  const handleClear = () => {
    if (isLoading || isRegenerating) return;
    setMessage('');
    setResultData(null);
    setError(null);
    setAppliedParams(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const executeTransformation = async (isRegen = false) => {
    const trimmed = message.trim();
    if (!trimmed) {
      setError({
        code: 'VALIDATION_ERROR',
        message: 'Please enter a message before transforming it.'
      });
      focusInput();
      return;
    }

    if (trimmed.length > 5000) {
      setError({
        code: 'MESSAGE_TOO_LONG',
        message: 'Your message is too long. Please shorten it to under 5,000 characters.'
      });
      return;
    }

    if (isRegen) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    const payload = {
      message: trimmed,
      audience,
      purpose,
      tone,
      length,
      format
    };

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to transform message.');
      }

      setResultData(data.data);
      setAppliedParams({ ...payload });
    } catch (err) {
      setError({
        code: err.code || 'TRANSFORMATION_ERROR',
        message: err.message || 'The AI service is temporarily unavailable. Please try again.'
      });
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        openPrivacy={() => setPrivacyOpen(true)}
        openTerms={() => setTermsOpen(true)}
        openAdmin={() => setAdminOpen(true)}
      />

      <main className="main-content">
        <Hero onFocusInput={focusInput} />

        <section className="workspace-card" aria-label="Transformation Workspace">
          <MessageInput
            message={message}
            setMessage={setMessage}
            onApplyPreset={handleApplyPreset}
            inputRef={inputRef}
            maxLength={5000}
            disabled={isLoading || isRegenerating}
          />

          <div className="selectors-grid">
            <AudienceSelector
              value={audience}
              onChange={setAudience}
              disabled={isLoading || isRegenerating}
            />
            <PurposeSelector
              value={purpose}
              onChange={setPurpose}
              disabled={isLoading || isRegenerating}
            />
            <ToneSelector
              value={tone}
              onChange={setTone}
              disabled={isLoading || isRegenerating}
            />
            <LengthSelector
              value={length}
              onChange={setLength}
              disabled={isLoading || isRegenerating}
            />
            <FormatSelector
              value={format}
              onChange={setFormat}
              disabled={isLoading || isRegenerating}
            />
          </div>

          <div className="action-toolbar">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClear}
              disabled={isLoading || isRegenerating || (!message && !resultData)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>Clear</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => executeTransformation(false)}
              disabled={isLoading || isRegenerating || !message.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>{isLoading ? 'Transforming Message...' : 'Transform Message'}</span>
            </button>
          </div>
        </section>

        {isLoading && <LoadingState />}

        <ErrorMessage error={error} onDismiss={() => setError(null)} />

        {resultData && appliedParams && !isLoading && (
          <ResultPanel
            originalMessage={appliedParams.message}
            resultData={resultData}
            selectedParams={appliedParams}
            onRegenerate={() => executeTransformation(true)}
            isRegenerating={isRegenerating}
          />
        )}
      </main>

      <Footer
        openPrivacy={() => setPrivacyOpen(true)}
        openTerms={() => setTermsOpen(true)}
      />

      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
      />

      <AdminDiagnosticsModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}

