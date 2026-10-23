import React, { useState, useRef, useEffect } from 'react';

const PRESET_EXAMPLES = [
  {
    label: 'Teacher Request',
    message: 'Sir, I cannot submit the assignment today.',
    audience: 'Teacher',
    purpose: 'Request',
    tone: 'Respectful',
    length: 'Short',
    format: 'WhatsApp message'
  },
  {
    label: 'Job Application',
    message: 'I want to apply for this job.',
    audience: 'Recruiter',
    purpose: 'Job application',
    tone: 'Professional',
    length: 'Medium',
    format: 'Email'
  },
  {
    label: 'Friend Notes',
    message: 'Please send me the notes.',
    audience: 'Friend',
    purpose: 'Request',
    tone: 'Friendly',
    length: 'Short',
    format: 'WhatsApp message'
  },
  {
    label: 'Uncertainty Preservation',
    message: 'I may be able to attend the meeting.',
    audience: 'Manager',
    purpose: 'General communication',
    tone: 'Professional',
    length: 'Short',
    format: 'Email'
  },
  {
    label: 'Client Apology',
    message: 'Sorry for replying late, I was busy.',
    audience: 'Client',
    purpose: 'Apology',
    tone: 'Empathetic',
    length: 'Medium',
    format: 'Email'
  }
];

export default function MessageInput({
  message,
  setMessage,
  onApplyPreset,
  inputRef,
  maxLength = 5000,
  disabled,
  onVoiceTransform,
  onVoiceClear
}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const recognitionRef = useRef(null);

  const charCount = message.length;
  const isNearLimit = charCount > maxLength * 0.9;

  // Web Speech API availability check
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
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('Listening... Speak your draft or say "Transform message"');
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

        // Voice Command: Clear message
        if (candidateCommand === 'clear message' || candidateCommand === 'clear input' || candidateCommand === 'reset message' || candidateCommand === 'clear') {
          if (onVoiceClear) onVoiceClear();
          else setMessage('');
          setVoiceStatus('Voice command executed: Cleared message.');
          return;
        }

        // Voice Command: Transform / Send message
        if (candidateCommand === 'transform message' || candidateCommand === 'transform' || candidateCommand === 'submit message' || candidateCommand === 'send message') {
          setVoiceStatus('Voice command executed: Transforming message...');
          stopListening();
          if (onVoiceTransform) onVoiceTransform();
          return;
        }

        // Voice Dictation: Append transcribed speech
        if (finalTranscript) {
          setMessage((prev) => {
            const trimmedPrev = prev.trim();
            const addition = finalTranscript.trim();
            if (!trimmedPrev) return addition;
            return `${trimmedPrev} ${addition}`;
          });
          setVoiceStatus('Listening... Speak or say "Transform message"');
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
      {/* Top Header with Title and Interactive Voice Command Button */}
      <div className="section-header">
        <label htmlFor="original-message" className="section-title">
          <span className="section-title-badge">Input</span>
          <span>Draft Your Message</span>
        </label>

        {/* High-End Themed Voice Command Button */}
        <button
          type="button"
          className={`voice-command-pill ${isListening ? 'active-listening' : ''}`}
          onClick={toggleListening}
          disabled={disabled}
          title={isListening ? 'Stop listening' : 'Start voice command dictation'}
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
              <span className="voice-pill-text">Recording...</span>
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

      {/* Voice Status & Interactive Command Helper */}
      {isListening && (
        <div className="voice-active-card" role="status">
          <div className="voice-status-indicator">
            <span className="voice-pulse-ring"></span>
            <span className="voice-status-text">{voiceStatus || 'Listening to your microphone...'}</span>
          </div>
          <div className="voice-commands-suggestions">
            <span className="voice-hint-label">Try saying:</span>
            <span className="voice-command-tag">"Clear message"</span>
            <span className="voice-command-tag">"Transform message"</span>
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

      {/* Preset Test Scenarios Chips */}
      <div className="preset-container">
        <span className="preset-label">Quick Scenarios:</span>
        <div className="preset-chips-scroll">
          {PRESET_EXAMPLES.map((preset) => (
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

      {/* Main Message Textarea with Glowing Focus & Audio Indicator */}
      <div className={`textarea-wrapper ${isListening ? 'mic-active-glow' : ''}`}>
        <textarea
          id="original-message"
          ref={inputRef}
          className="message-textarea"
          placeholder="Type or click 'Voice Command' to speak your message, or choose a quick scenario above..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxLength}
          rows={5}
          disabled={disabled}
        />
        <div className="textarea-footer">
          <span className="textarea-guarantee">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Factual claims, commitments & uncertainty preserved. Zero invented excuses.
          </span>
          <span className={`char-counter ${isNearLimit ? 'warning' : ''}`}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
