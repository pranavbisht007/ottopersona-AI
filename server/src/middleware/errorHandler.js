/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  // Handle JSON body parser error (malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MALFORMED_JSON',
        message: 'The request body contains invalid JSON.'
      }
    });
  }

  // Handle Payload Too Large
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeds the allowed limit (50KB).'
      }
    });
  }

  // Handle CORS error
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_REJECTED',
        message: 'Origin not allowed by CORS policy.'
      }
    });
  }

  // Default server error
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Do not expose stack traces or raw upstream exceptions to clients
  const safeMessage = err.isOperational
    ? err.message
    : 'An unexpected internal server error occurred. Please try again later.';

  if (!isProduction) {
    console.error('[OttoPersona Error]', err.message || err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: safeMessage
    }
  });
}

/**
 * 404 handler for unknown endpoints
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`
    }
  });
}
