import React from 'react';

const TONES = [
  'Professional',
  'Friendly',
  'Formal',
  'Respectful',
  'Empathetic',
  'Confident',
  'Concise'
];

export default function ToneSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="tone-select" className="selector-label">
        Desired Tone
      </label>
      <select
        id="tone-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {TONES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
