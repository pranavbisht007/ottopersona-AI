import React from 'react';

const FORMATS = [
  'General text message',
  'WhatsApp message',
  'Email'
];

export default function FormatSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="format-select" className="selector-label">
        Communication Format
      </label>
      <select
        id="format-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {FORMATS.map((fmt) => (
          <option key={fmt} value={fmt}>
            {fmt}
          </option>
        ))}
      </select>
    </div>
  );
}
