import React, { useState, useRef, useEffect } from 'react';

const CATEGORIES = ['All', '💼 Work', '⚖️ Legal & HR', '🎓 College', '🤝 Personal', '🇮🇳 हिंदी'];

const PRESET_EXAMPLES = [
  {
    category: '⚖️ Legal & HR',
    label: 'Contract Clause Review',
    message: 'Please review the updated terms in section 4 before execution. All confidentiality and IP ownership clauses remain as previously negotiated without alteration.',
    audience: 'Client',
    purpose: 'Follow-up',
    tone: 'Formal',
    length: 'Medium',
    format: 'Email',
    language: 'English'
  },
  {
    category: '⚖️ Legal & HR',
    label: 'Medical Leave (Compliance)',
    message: 'I am formally requesting sick leave from Monday to Wednesday due to personal health reasons. A certified medical note is attached per statutory company policy.',
    audience: 'HR / Recruiter',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'Email',
    language: 'English'
  },
  {
    category: '⚖️ Legal & HR',
    label: 'NDA Confidentiality Notice',
    message: 'Please treat the attached proprietary system designs as strictly confidential in accordance with our Non-Disclosure Agreement executed earlier this year.',
    audience: 'Colleague',
    purpose: 'General communication',
    tone: 'Formal',
    length: 'Short',
    format: 'Email',
    language: 'English'
  },
  {
    category: '🎓 College',
    label: 'Teacher Request',
    message: 'Sir, I cannot submit the assignment today.',
    audience: 'Teacher',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'WhatsApp message',
    language: 'English'
  },
  {
    category: '🇮🇳 हिंदी',
    label: 'छुट्टी का आवेदन (Leave)',
    message: 'आदरणीय महोदय, अस्वस्थ होने के कारण मैं आज उपस्थित नहीं हो सकूँगा। कृपया मुझे अवकाश प्रदान करें।',
    audience: 'Teacher',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'WhatsApp message',
    language: 'Hindi'
  },
  {
    category: '💼 Work',
    label: 'Job Application',
    message: 'I want to apply for this job. Attached is my resume for your consideration.',
    audience: 'Recruiter',
    purpose: 'Job application',
    tone: 'Professional',
    length: 'Medium',
    format: 'Email',
    language: 'English'
  },
  {
    category: '💼 Work',
    label: 'Meeting Reschedule',
    message: 'Could we reschedule our meeting? An urgent conflict came up on my calendar.',
    audience: 'Manager',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'Email',
    language: 'English'
  },
  {
    category: '💼 Work',
    label: 'Project Follow-up',
    message: 'Following up on the document I sent last week. Have you had a chance to review it?',
    audience: 'Client',
    purpose: 'Follow-up',
    tone: 'Professional',
    length: 'Short',
    format: 'Email',
    language: 'English'
  },
  {
    category: '🇮🇳 हिंदी',
    label: 'असाइनमेंट छूट (Hindi)',
    message: 'सर, आज मैं असाइनमेंट जमा नहीं कर पाऊंगा। क्या मुझे कल तक का समय मिल सकता है?',
    audience: 'Teacher',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'WhatsApp message',
    language: 'Hindi'
  },
  {
    category: '🤝 Personal',
    label: 'Friend Notes (Hinglish)',
    message: 'Bhai kal ke exam ke notes bhej de please.',
    audience: 'Friend',
    purpose: 'Request',
    tone: 'Friendly',
    length: 'Short',
    format: 'WhatsApp message',
    language: 'Hinglish'
  },
  {
    category: '💼 Work',
    label: 'Uncertainty Preservation',
    message: 'I may be able to attend the meeting tomorrow, but it depends on the client call.',
    audience: 'Manager',
    purpose: 'General communication',
    tone: 'Professional',
    length: 'Short',
    format: 'Email',
    language: 'English'
  },
  {
    category: '🤝 Personal',
    label: 'Casual Apology',
    message: 'Sorry for replying late, my phone was on silent.',
    audience: 'Friend',
    purpose: 'Apology',
    tone: 'Friendly',
    length: 'Short',
    format: 'WhatsApp message',
    language: 'English'
  },
  {
    category: '🇮🇳 हिंदी',
    label: 'कार्य अपडेट (Work Hindi)',
    message: 'नमस्ते सर, मैंने आज की रिपोर्ट पूरी कर ली है और समीक्षा के लिए भेज दी है।',
    audience: 'Manager',
    purpose: 'General communication',
    tone: 'Respectful',
    length: 'Short',
    format: 'Email',
    language: 'Hindi'
  }
];

export default function MessageInput({
  message,
  setMessage,
  onApplyPreset,
  inputRef,
  maxLength = 5000,
  disabled,
  language = 'Auto-detect',
  onVoiceTransform,
  onVoiceClear
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [clipboardNotice, setClipboardNotice] = useState('');
  const recognitionRef = useRef(null);

  // Sync voiceLang with selected language if set to Hindi
  useEffect(() => {
    if (language === 'Hindi') {
      setVoiceLang('hi-IN');
    } else if (language === 'English') {
      setVoiceLang('en-IN');
    }
  }, [language]);

  const charCount = message.length;
  const isNearLimit = charCount > maxLength * 0.9;

  // Filter presets by active category
  const filteredPresets = activeCategory === 'All'
    ? PRESET_EXAMPLES
    : PRESET_EXAMPLES.filter(p => p.category === activeCategory);

  // Quick Text Helpers
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setMessage((prev) => (prev ? `${prev.trim()}\n${text.trim()}` : text.trim()));
          setClipboardNotice('Pasted from clipboard!');
          setTimeout(() => setClipboardNotice(''), 2000);
        }
      } else {
        alert('Please use Ctrl+V to paste your message.');
      }
    } catch (err) {
      setClipboardNotice('Could not access clipboard automatically. Please press Ctrl+V.');
      setTimeout(() => setClipboardNotice(''), 3000);
    }
  };

  const handleAddGreeting = () => {
    const greeting = language === 'Hindi'
      ? 'आदरणीय महोदय,\n\n'
      : language === 'Hinglish'
      ? 'Respected Sir,\n\n'
      : 'Dear Sir/Madam,\n\n';
    setMessage((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${greeting}${trimmed}` : greeting;
    });
    if (inputRef.current) inputRef.current.focus();
  };

  const handleAddClosing = () => {
    const closing = language === 'Hindi'
      ? '\n\nधन्यवाद एवं सादर प्रणाम।'
      : '\n\nThank you for your time and understanding.\nWarm regards,';
    setMessage((prev) => `${prev.trim()}${closing}`);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleFormatText = () => {
    setMessage((prev) => {
      if (!prev) return '';
      // Clean multiple spaces and excessive blank lines
      let formatted = prev.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      // Capitalize first character
      if (formatted.length > 0) {
        formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      }
      return formatted;
    });
    setClipboardNotice('Formatted text spacing & capitalization!');
    setTimeout(() => setClipboardNotice(''), 2000);
  };

  const handleInsertPhrase = (phrase) => {
    setMessage((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return phrase;
      return `${trimmed} ${phrase}`;
    });
    if (inputRef.current) inputRef.current.focus();
  };

  // Web Speech API
  const isSpeechSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = () => {
    if (!isSpeechSupported) {
      setVoiceError('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    if (disabled) return;

    setVoiceError(null);
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = voiceLang;

      recognition.onstart = () => {
        setIsListening(true);
        const langName = voiceLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English / Hinglish';
        setVoiceStatus(`Listening in ${langName}... Speak your message now.`);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += chunk;
          } else {
            interimTranscript += chunk;
          }
        }

        const candidateCommand = (finalTranscript || interimTranscript).trim().toLowerCase();

        // Voice Commands
        const clearCommands = ['clear message', 'clear input', 'reset message', 'clear', 'साफ करो', 'मैसेज साफ करो', 'हटाओ', 'डिलीट करो'];
        if (clearCommands.some(cmd => candidateCommand.includes(cmd))) {
          if (onVoiceClear) onVoiceClear();
          else setMessage('');
          setVoiceStatus('Voice command executed: Cleared message / संदेश मिटा दिया गया।');
          return;
        }

        const transformCommands = ['transform message', 'transform', 'submit message', 'send message', 'मैसेज बदलो', 'ट्रांसफॉर्म करो', 'भेजो'];
        if (transformCommands.some(cmd => candidateCommand.includes(cmd))) {
          setVoiceStatus('Voice command executed: Transforming message / संदेश तैयार किया जा रहा है...');
          stopListening();
          if (onVoiceTransform) onVoiceTransform();
          return;
        }

        // Voice Dictation
        if (finalTranscript) {
          setMessage((prev) => {
            const trimmedPrev = prev.trim();
            const addition = finalTranscript.trim();
            if (!trimmedPrev) return addition;
            return `${trimmedPrev} ${addition}`;
          });
          setVoiceStatus(`Listening in ${voiceLang === 'hi-IN' ? 'Hindi' : 'English'}... Speak or say "Transform message"`);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
          setVoiceStatus('No speech detected. Still listening...');
          return;
        }
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else {
          setVoiceError(`Voice notice: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setVoiceError('Failed to initialize microphone: ' + err.message);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setVoiceStatus('');
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const toggleVoiceLanguage = () => {
    const nextLang = voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN';
    setVoiceLang(nextLang);
    if (isListening) {
      stopListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div className="message-input-section" id="workspace">
      {/* Top Header with Title and Voice Controls */}
      <div className="section-header">
        <label htmlFor="original-message" className="section-title">
          <span className="section-title-badge">Input</span>
          <span>Draft Your Message</span>
        </label>

        {/* Themed Voice Command Controls */}
        <div className="voice-controls-group">
          {/* Language Toggle */}
          <button
            type="button"
            className="btn-voice-lang"
            onClick={toggleVoiceLanguage}
            title={`Current voice input language: ${voiceLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English / Hinglish'}. Click to toggle.`}
            disabled={disabled}
            aria-label="Toggle voice language"
          >
            <span>🌐</span>
            <span className="voice-lang-label">{voiceLang === 'hi-IN' ? 'हिंदी (Hindi)' : 'English / Hinglish'}</span>
          </button>

          {/* Voice Command Button */}
          <button
            type="button"
            className={`voice-command-pill ${isListening ? 'active-listening' : ''}`}
            onClick={toggleListening}
            disabled={disabled}
            title={isListening ? 'Stop listening' : `Start voice command dictation (${voiceLang === 'hi-IN' ? 'Hindi' : 'English'})`}
            aria-label={isListening ? 'Stop voice recording' : 'Start voice recording'}
          >
            {isListening ? (
              <>
                <div className="voice-equalizer" aria-hidden="true">
                  <span className="eq-bar eq-1"></span>
                  <span className="eq-bar eq-2"></span>
                  <span className="eq-bar eq-3"></span>
                  <span className="eq-bar eq-4"></span>
                </div>
                <span className="voice-pill-text">Recording ({voiceLang === 'hi-IN' ? 'हिंदी' : 'EN'})...</span>
              </>
            ) : (
              <>
                <div className="voice-mic-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
                <span className="voice-pill-text">Voice Command</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Status & Command Helper */}
      {isListening && (
        <div className="voice-active-card" role="status">
          <div className="voice-status-indicator">
            <span className="voice-pulse-ring"></span>
            <span className="voice-status-text">{voiceStatus || 'Listening to your microphone...'}</span>
          </div>
          <div className="voice-commands-suggestions">
            <span className="voice-hint-label">Voice commands:</span>
            <span className="voice-command-tag">"Clear message" / "साफ करो"</span>
            <span className="voice-command-tag">"Transform message" / "भेजो"</span>
          </div>
        </div>
      )}

      {/* Voice Error Notice */}
      {voiceError && (
        <div className="voice-error-toast" role="alert">
          <div className="voice-error-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{voiceError}</span>
          </div>
          <button
            type="button"
            className="voice-error-close"
            onClick={() => setVoiceError(null)}
            aria-label="Close error notice"
          >
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Tabs for Quick Scenarios */}
      <div className="scenario-categories-strip">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Text Buttons */}
      <div className="preset-container">
        <span className="preset-label">Templates:</span>
        <div className="preset-chips-scroll">
          {filteredPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              onClick={() => onApplyPreset(preset)}
              disabled={disabled}
            >
              <span>{preset.label}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Smart Text Action Toolbar */}
      <div className="smart-text-toolbar" role="toolbar" aria-label="Text Formatting Tools">
        <div className="smart-text-actions-left">
          {/* Paste Button */}
          <button
            type="button"
            className="smart-text-btn"
            onClick={handlePaste}
            title="Paste text from clipboard"
            disabled={disabled}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span>Paste</span>
          </button>

          {/* Add Greeting Button */}
          <button
            type="button"
            className="smart-text-btn"
            onClick={handleAddGreeting}
            title="Insert a polite salutation at the start"
            disabled={disabled}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            <span>+ Greeting</span>
          </button>

          {/* Add Closing Button */}
          <button
            type="button"
            className="smart-text-btn"
            onClick={handleAddClosing}
            title="Insert a respectful sign-off and signature"
            disabled={disabled || !message.trim()}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            <span>+ Closing</span>
          </button>

          {/* Format / Clean Spacing Button */}
          <button
            type="button"
            className="smart-text-btn"
            onClick={handleFormatText}
            title="Clean redundant spaces and normalize punctuation"
            disabled={disabled || !message.trim()}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
            <span>Format</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            className="smart-text-btn"
            onClick={() => setMessage('')}
            title="Clear current text"
            disabled={disabled || !message}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span>Clear</span>
          </button>
        </div>

        {/* Quick Phrase Insertion Pills */}
        <div className="smart-text-actions-right">
          <button
            type="button"
            className="smart-phrase-btn"
            onClick={() => handleInsertPhrase('Please let me know if you need any additional information.')}
            disabled={disabled}
            title="Click to insert phrase"
          >
            + "Please let me know"
          </button>
          <button
            type="button"
            className="smart-phrase-btn"
            onClick={() => handleInsertPhrase('At your earliest convenience.')}
            disabled={disabled}
            title="Click to insert phrase"
          >
            + "At your earliest convenience"
          </button>
          {language === 'Hindi' && (
            <button
              type="button"
              className="smart-phrase-btn"
              onClick={() => handleInsertPhrase('कृपया इस विषय पर संज्ञान लें।')}
              disabled={disabled}
              title="Click to insert phrase"
            >
              + "कृपया संज्ञान लें"
            </button>
          )}
        </div>
      </div>

      {/* Main Message Textarea with Connected Toolbar */}
      <div className={`textarea-wrapper has-toolbar ${isListening ? 'mic-active-glow' : ''}`}>
        <textarea
          id="original-message"
          ref={inputRef}
          className="message-textarea"
          placeholder="Type in English, Hindi (हिंदी), or Hinglish, use the quick text buttons above, or click 'Voice Command' to speak..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxLength}
          rows={5}
          disabled={disabled}
        />
        <div className="textarea-footer">
          <span className="textarea-guarantee">
            {clipboardNotice ? (
              <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>✓ {clipboardNotice}</span>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Factual claims, commitments & uncertainty preserved. Zero invented excuses.
              </>
            )}
          </span>
          <span className={`char-counter ${isNearLimit ? 'warning' : ''}`}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
