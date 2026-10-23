import React from 'react';

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
  disabled
}) {
  const charCount = message.length;
  const isNearLimit = charCount > maxLength * 0.9;

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
      </div>

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
          placeholder="Enter the message you want to rewrite or choose a scenario above..."
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

