import React from 'react';

const LENGTHS = [
  'Short',
  'Medium',
  'Detailed'
];

export default function LengthSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="length-select" className="selector-label">
        Desired Length
      </label>
      <select
        id="length-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {LENGTHS.map((len) => (
          <option key={len} value={len}>
            {len}
          </option>
        ))}
      </select>
    </div>
  );
}
