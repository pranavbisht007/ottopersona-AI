import React from 'react';

const PURPOSES = [
  'General communication',
  'Email',
  'Request',
  'Apology',
  'Job application',
  'Interview response',
  'Follow-up'
];

export default function PurposeSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="purpose-select" className="selector-label">
        Communication Purpose
      </label>
      <select
        id="purpose-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {PURPOSES.map((purp) => (
          <option key={purp} value={purp}>
            {purp}
          </option>
        ))}
      </select>
    </div>
  );
}

