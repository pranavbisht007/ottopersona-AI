import React from 'react';

const LANGUAGES = [
  { value: 'Auto-detect', label: 'Auto-detect (स्वतः पहचानें)' },
  { value: 'Hindi', label: 'Hindi (हिंदी)' },
  { value: 'Hinglish', label: 'Hinglish (हिंग्लिश)' },
  { value: 'English', label: 'English' }
];

export default function LanguageSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="language-select" className="selector-label">
        Output Language (भाषा)
      </label>
      <select
        id="language-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
