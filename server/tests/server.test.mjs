import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import bcrypt from 'bcryptjs';

// Setup environment before loading app
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.ADMIN_SECRET_KEY = 'test_admin_super_secret_key_32_bytes_long';
process.env.GEMINI_API_KEY = 'your_gemini_api_key_here'; // Mocked placeholder

// Generate bcrypt hash for testing admin password
const testPassword = 'SecretAdminPassword123!';
const testPasswordHash = bcrypt.hashSync(testPassword, 10);
process.env.ADMIN_PASSWORD_HASH = testPasswordHash;

import app from '../src/app.js';

let server;
const BASE_URL = 'http://127.0.0.1:5001';

before((done) => {
  server = http.createServer(app);
  server.listen(5001, '127.0.0.1', () => {
    done();
  });
});

after(() => {
  server.close(() => {
    process.exit(0);
  });
});

describe('OttoPersona AI Server Suite', () => {
  test('GET /api/health should return healthy status and security posture', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.status, 'healthy');
    assert.strictEqual(body.service, 'OttoPersona AI Backend');
    assert.ok(typeof body.uptime === 'number');
    // Ensure secrets are NOT leaked
    assert.strictEqual(body.GEMINI_API_KEY, undefined);
    assert.strictEqual(body.ADMIN_SECRET_KEY, undefined);
  });

  test('POST /api/transform with empty message should return 400 VALIDATION_ERROR', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
  });

  test('POST /api/transform with whitespace only should return 400 VALIDATION_ERROR', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '     \n  \t  ' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
  });

  test('POST /api/transform with message exceeding 5000 characters should return 400 MESSAGE_TOO_LONG', async () => {
    const longMessage = 'A'.repeat(5005);
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: longMessage })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'MESSAGE_TOO_LONG');
  });

  test('POST /api/transform with invalid audience should return 400 INVALID_AUDIENCE', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello world',
        audience: 'AlienOverlord'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_AUDIENCE');
  });

  test('POST /api/transform with invalid purpose should return 400 INVALID_PURPOSE', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello world',
        audience: 'Friend',
        purpose: 'NonExistentPurpose'
      })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_PURPOSE');
  });

  test('POST /api/transform with missing API key returns 503 CONFIG_ERROR safely without crashing', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Sir, I cannot submit the assignment today.',
        audience: 'Teacher',
        purpose: 'Request',
        tone: 'Respectful',
        length: 'Short',
        format: 'WhatsApp message'
      })
    });
    assert.strictEqual(res.status, 503);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'CONFIG_ERROR');
    assert.ok(body.error.message.includes('AI transformation is not configured yet'));
  });

  test('POST /api/transform with malformed JSON body should return 400 MALFORMED_JSON', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ malformed json: true, '
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'MALFORMED_JSON');
  });

  test('Protected Admin routes should reject unauthenticated requests with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/status`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'UNAUTHORIZED');
  });

  test('Protected Admin routes should reject invalid credentials with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/status`, {
      headers: { 'Authorization': 'Bearer wrong_token_value_here' }
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_CREDENTIALS');
  });

  test('Protected Admin routes should accept valid Bearer token and return diagnostics', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/status`, {
      headers: { 'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY}` }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.uptimeSeconds === 'number');
    assert.ok(typeof body.data.memoryRssMb === 'number');
  });

  test('POST /api/admin/login verifies bcrypt password and grants token', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: testPassword })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.token, process.env.ADMIN_SECRET_KEY);
  });

  test('POST /api/admin/login rejects incorrect password', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'WrongPassword999' })
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, 'INVALID_CREDENTIALS');
  });

  test('Security headers should be present (Helmet and no x-powered-by)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.headers.get('x-powered-by'), null);
    assert.ok(res.headers.get('content-security-policy'));
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
  });
});
