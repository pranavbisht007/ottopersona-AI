import React, { useState, useEffect } from 'react';

export default function AdminDiagnosticsModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [adminData, setAdminData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch public health on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/health')
        .then((res) => res.json())
        .then((data) => setHealthData(data))
        .catch((err) => setErrorMsg('Failed to fetch server health: ' + err.message));
    } else {
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Authentication failed');
      }
      setToken(data.data.token);
      // Fetch admin status with bearer token
      const statusRes = await fetch('/api/admin/status', {
        headers: { 'Authorization': `Bearer ${data.data.token}` }
      });
      const statusData = await statusRes.json();
      setAdminData(statusData.data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestUnauthorized = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/status'); // No auth header
      const data = await res.json();
      if (res.status === 401) {
        alert(`Security Check Passed: Request was properly blocked with 401 Unauthorized (${data.error?.message}).`);
      } else {
        alert(`Unexpected response: HTTP ${res.status}`);
      }
    } catch (err) {
      setErrorMsg('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="admin-modal-title" className="modal-title">System & Security Diagnostics</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <h3>Public Health Status (GET /api/health)</h3>
          {healthData ? (
            <div style={{ background: 'var(--bg-surface-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '16px' }}>
              <div>Status: <strong>{healthData.status}</strong></div>
              <div>Service: {healthData.service}</div>
              <div>Uptime: {healthData.uptime}s</div>
              <div>Timestamp: {healthData.timestamp}</div>
            </div>
          ) : (
            <p>Loading health telemetry...</p>
          )}

          <h3>Admin Route Security Verification</h3>
          <p>
            Verify that protected administrative endpoints enforce authentication and reject unauthorized access:
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleTestUnauthorized}
              disabled={loading}
            >
              Test Unauthenticated Access (Expect 401)
            </button>
          </div>

          {!adminData ? (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>
                Admin Password Authentication (bcrypt hashed):
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  className="custom-select"
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading || !password}
                >
                  {loading ? 'Verifying...' : 'Authenticate'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', padding: '12px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              <div style={{ color: 'var(--status-success)', fontWeight: 700, marginBottom: '6px' }}>
                ✓ Authenticated Admin Session Active
              </div>
              <div>Node Version: {adminData.nodeVersion}</div>
              <div>Memory RSS: {adminData.memoryRssMb} MB</div>
              <div>Heap Used: {adminData.heapUsedMb} MB</div>
              <div>Environment: {adminData.environment}</div>
              <div>AI Provider Configured: {adminData.aiConfigured ? 'Yes' : 'No (API Key required in .env)'}</div>
              <div>Security Headers: {adminData.securityHeaders}</div>
              <div>Rate Limiting: {adminData.rateLimiting}</div>
            </div>
          )}

          {errorMsg && (
            <div style={{ color: 'var(--status-error)', marginTop: '12px', fontSize: '13px' }}>
              <strong>Notice:</strong> {errorMsg}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

