import React from 'react';

const AUDIENCES = [
  'General audience',
  'Teacher',
  'Friend',
  'Recruiter',
  'Manager',
  'Client',
  'Colleague',
  'HR / Recruiter'
];

export default function AudienceSelector({ value, onChange, disabled }) {
  return (
    <div className="selector-field">
      <label htmlFor="audience-select" className="selector-label">
        Target Audience
      </label>
      <select
        id="audience-select"
        className="custom-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {AUDIENCES.map((aud) => (
          <option key={aud} value={aud}>
            {aud}
          </option>
        ))}
      </select>
    </div>
  );
}

