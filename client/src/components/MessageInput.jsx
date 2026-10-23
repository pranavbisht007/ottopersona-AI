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
    label: 'Apology',
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

  // Check if browser supports Web Speech API
  const isSpeechSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = () => {
    if (!isSpeechSupported) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
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
        setVoiceStatus('Listening... Speak your message now.');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }

        const candidateCommand = (finalTranscript || interimTranscript).trim().toLowerCase();

        // 1. Voice Command: Clear message
        if (candidateCommand === 'clear message' || candidateCommand === 'clear input' || candidateCommand === 'reset message' || candidateCommand === 'clear') {
          if (onVoiceClear) {
            onVoiceClear();
          } else {
            setMessage('');
          }
          setVoiceStatus('Voice Command: Cleared message.');
          return;
        }

        // 2. Voice Command: Transform / Submit message
        if (candidateCommand === 'transform message' || candidateCommand === 'transform' || candidateCommand === 'submit message' || candidateCommand === 'send message') {
          setVoiceStatus('Voice Command: Transforming message...');
          stopListening();
          if (onVoiceTransform) {
            onVoiceTransform();
          }
          return;
        }

        // 3. Dictation: Insert or append transcribed speech into the message
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
          setVoiceError('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else {
          setVoiceError(`Voice input notice: ${event.error}`);
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
        // Ignore stop error
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setVoiceStatus('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // ignore cleanup error
        }
      }
    };
  }, []);

  return (
    <div>
      <div className="section-header">
        <label htmlFor="original-message" className="section-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Original Message
        </label>

        <button
          type="button"
          className={`btn-voice ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={disabled}
          title={isListening ? 'Stop listening' : 'Dictate message by voice or speak commands'}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          <span className="voice-icon-wrapper">
            {isListening ? (
              <span className="pulse-recording-dot" aria-hidden="true"></span>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            )}
          </span>
          <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
        </button>
      </div>

      {isListening && (
        <div className="voice-banner listening" role="status">
          <div className="voice-banner-indicator">
            <span className="pulse-recording-dot"></span>
            <span>{voiceStatus || 'Listening... Speak your message now.'}</span>
          </div>
          <div className="voice-commands-hint">
            Voice commands: <code>"Clear message"</code> • <code>"Transform message"</code>
          </div>
        </div>
      )}

      {voiceError && (
        <div className="voice-banner error" role="alert">
          <span>{voiceError}</span>
          <button
            type="button"
            className="voice-banner-dismiss"
            onClick={() => setVoiceError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="preset-container">
        <span className="preset-label">Test Scenarios:</span>
        {PRESET_EXAMPLES.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="preset-chip"
            onClick={() => onApplyPreset(preset)}
            disabled={disabled}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="textarea-wrapper">
        <textarea
          id="original-message"
          ref={inputRef}
          className="message-textarea"
          placeholder="Type or click 'Voice Input' to speak your message, or choose a test scenario..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={maxLength}
          rows={5}
          disabled={disabled}
        />
        <div className="textarea-footer">
          <span>Preserves factual meaning, commitments, and uncertainty without inventing excuses.</span>
          <span className={`char-counter ${isNearLimit ? 'warning' : ''}`}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
