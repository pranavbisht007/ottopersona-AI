import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.PORT = '5002';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.ADMIN_SECRET_KEY = 'super_secure_admin_test_token_32_bytes_long';
process.env.GEMINI_API_KEY = 'your_gemini_api_key_here';

import app from '../src/app.js';
import { validateTransformRequest } from '../src/blocks/transform-block/transformValidator.js';

let server;
const BASE_URL = 'http://127.0.0.1:5002';

before((done) => {
  server = http.createServer(app);
  server.listen(5002, '127.0.0.1', () => {
    done();
  });
});

after(() => {
  server.close(() => {
    process.exit(0);
  });
});

describe('OttoPersona AI E2E Specification Verification Suite', () => {
  test('Scenario 1: Teacher message payload validation', () => {
    const input = {
      message: 'Sir, I cannot submit the assignment today.',
      audience: 'Teacher',
      purpose: 'Request',
      tone: 'Respectful',
      length: 'Short',
      format: 'WhatsApp message'
    };
    const validation = validateTransformRequest(input);
    assert.strictEqual(validation.isValid, true);
    assert.strictEqual(validation.sanitized.audience, 'Teacher');
    assert.strictEqual(validation.sanitized.tone, 'Respectful');
  });

  test('Scenario 2: Recruiter message payload validation', () => {
    const input = {
      message: 'I want to apply for this job.',
      audience: 'Recruiter',
      purpose: 'Job application',
      tone: 'Professional',
      length: 'Medium',
      format: 'Email'
    };
    const validation = validateTransformRequest(input);
    assert.strictEqual(validation.isValid, true);
    assert.strictEqual(validation.sanitized.audience, 'Recruiter');
    assert.strictEqual(validation.sanitized.purpose, 'Job application');
  });

  test('Scenario 3: Friend message payload validation', () => {
    const input = {
      message: 'Please send me the notes.',
      audience: 'Friend',
      purpose: 'Request',
      tone: 'Friendly',
      length: 'Short',
      format: 'WhatsApp message'
    };
    const validation = validateTransformRequest(input);
    assert.strictEqual(validation.isValid, true);
    assert.strictEqual(validation.sanitized.audience, 'Friend');
    assert.strictEqual(validation.sanitized.tone, 'Friendly');
  });

  test('Scenario 4: Uncertainty preservation payload validation', () => {
    const input = {
      message: 'I may be able to attend the meeting.',
      audience: 'Manager',
      purpose: 'General communication',
      tone: 'Professional',
      length: 'Short',
      format: 'Email'
    };
    const validation = validateTransformRequest(input);
    assert.strictEqual(validation.isValid, true);
    assert.strictEqual(validation.sanitized.message, 'I may be able to attend the meeting.');
  });

  test('Scenario 5: Empty input rejection', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error.code, 'VALIDATION_ERROR');
  });

  test('Scenario 6: Oversized input rejection (> 5000 chars)', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'x'.repeat(5001) })
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error.code, 'MESSAGE_TOO_LONG');
  });

  test('Scenario 7: Missing API key returns 503 CONFIG_ERROR safely', async () => {
    const res = await fetch(`${BASE_URL}/api/transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Sir, I cannot submit the assignment today.',
        audience: 'Teacher'
      })
    });
    assert.strictEqual(res.status, 503);
    const body = await res.json();
    assert.strictEqual(body.error.code, 'CONFIG_ERROR');
    assert.ok(body.error.message.includes('AI transformation is not configured yet'));
  });

  test('Scenario 8: Admin route rejects unauthorized access with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/status`);
    assert.strictEqual(res.status, 401);
  });

  test('Scenario 9: Admin route accepts valid token with 200', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/status`, {
      headers: { 'Authorization': `Bearer ${process.env.ADMIN_SECRET_KEY}` }
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  test('Scenario 10: Production static bundle serving index.html', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('OttoPersona AI'));
  });
});
