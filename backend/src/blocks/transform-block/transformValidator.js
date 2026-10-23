/**
 * Input validator and sanitizer for transform requests
 */

export const ALLOWED_AUDIENCES = [
  'Teacher',
  'Friend',
  'Recruiter',
  'Manager',
  'Client',
  'Colleague',
  'HR / Recruiter',
  'General audience'
];

export const ALLOWED_PURPOSES = [
  'Email',
  'Request',
  'Apology',
  'Job application',
  'Interview response',
  'Follow-up',
  'General communication'
];

export const ALLOWED_TONES = [
  'Professional',
  'Friendly',
  'Formal',
  'Respectful',
  'Empathetic',
  'Confident',
  'Concise'
];

export const ALLOWED_LENGTHS = [
  'Short',
  'Medium',
  'Detailed'
];

export const ALLOWED_FORMATS = [
  'Email',
  'WhatsApp message',
  'General text message',
  'Slack message'
];

export const ALLOWED_LANGUAGES = [
  'Auto-detect',
  'English',
  'Hindi',
  'Hinglish'
];

export const MAX_MESSAGE_LENGTH = 5000;

/**
 * Basic sanitization to neutralize malicious HTML/script injections
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * Validate and sanitize transformation payload
 * @param {object} body
 * @returns {{ isValid: boolean, error?: { code: string, message: string }, sanitized?: object }}
 */
export function validateTransformRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Invalid request body. Expected a JSON object.'
      }
    };
  }

  const { message, audience, purpose, tone, length, format, language } = body;

  // 1. Validate Message
  if (message === undefined || message === null) {
    return {
      isValid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please enter a message before transforming it.'
      }
    };
  }

  if (typeof message !== 'string') {
    return {
      isValid: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'Message must be a text string.'
      }
    };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length === 0) {
    return {
      isValid: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please enter a message before transforming it.'
      }
    };
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: {
        code: 'MESSAGE_TOO_LONG',
        message: `Your message is too long (${trimmedMessage.length} characters). Please shorten it to under ${MAX_MESSAGE_LENGTH} characters.`
      }
    };
  }

  // 2. Validate Audience
  let selectedAudience = audience || 'General audience';
  if (selectedAudience === 'HR') selectedAudience = 'HR / Recruiter';
  if (selectedAudience === 'Professor') selectedAudience = 'Teacher';
  if (!ALLOWED_AUDIENCES.includes(selectedAudience)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_AUDIENCE',
        message: `Audience must be one of: ${ALLOWED_AUDIENCES.join(', ')}.`
      }
    };
  }

  // 3. Validate Purpose
  const selectedPurpose = purpose || 'General communication';
  if (!ALLOWED_PURPOSES.includes(selectedPurpose)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_PURPOSE',
        message: `Purpose must be one of: ${ALLOWED_PURPOSES.join(', ')}.`
      }
    };
  }

  // 4. Validate Tone
  const selectedTone = tone || 'Professional';
  if (!ALLOWED_TONES.includes(selectedTone)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_TONE',
        message: `Tone must be one of: ${ALLOWED_TONES.join(', ')}.`
      }
    };
  }

  // 5. Validate Length
  const selectedLength = length || 'Medium';
  if (!ALLOWED_LENGTHS.includes(selectedLength)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_LENGTH',
        message: `Length must be one of: ${ALLOWED_LENGTHS.join(', ')}.`
      }
    };
  }

  // 6. Validate Format
  const selectedFormat = format || 'General text message';
  if (!ALLOWED_FORMATS.includes(selectedFormat)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_FORMAT',
        message: `Format must be one of: ${ALLOWED_FORMATS.join(', ')}.`
      }
    };
  }

  // 7. Validate Language
  const selectedLanguage = language || 'Auto-detect';
  if (!ALLOWED_LANGUAGES.includes(selectedLanguage)) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_LANGUAGE',
        message: `Language must be one of: ${ALLOWED_LANGUAGES.join(', ')}.`
      }
    };
  }

  return {
    isValid: true,
    sanitized: {
      message: sanitizeString(trimmedMessage),
      audience: selectedAudience,
      purpose: selectedPurpose,
      tone: selectedTone,
      length: selectedLength,
      format: selectedFormat,
      language: selectedLanguage
    }
  };
}

