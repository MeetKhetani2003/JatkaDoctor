/**
 * Security Service Layer for Dr Jhatka Medicare
 * Implements Mongo sanitization, validation, and simple rate-limiting
 */

// In-memory store for rate limiting (reset periodically or simple cleanup)
const ipCache = new Map();

// Periodic cleanup of rate limit cache (runs every 5 minutes)
if (typeof global !== 'undefined' && !global.ipCacheCleanupInterval) {
  global.ipCacheCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipCache.entries()) {
      if (now - data.resetTime > 0) {
        ipCache.delete(ip);
      }
    }
  }, 300000);
}

/**
 * 1. Rate Limiting (In-Memory IP based)
 * @param {string} ip Client IP address
 * @param {number} limit Max requests allowed in window
 * @param {number} windowMs Time window in milliseconds (default: 1 minute)
 * @returns {boolean} True if within limit, False if rate limited
 */
export function isRateLimited(ip, limit = 15, windowMs = 60000) {
  const now = Date.now();
  const clientIp = ip || 'unknown-ip';

  if (!ipCache.has(clientIp)) {
    ipCache.set(clientIp, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }

  const data = ipCache.get(clientIp);
  
  if (now > data.resetTime) {
    // Window expired, reset
    data.count = 1;
    data.resetTime = now + windowMs;
    return false;
  }

  data.count += 1;
  return data.count > limit;
}

/**
 * 2. Mongo Query/Payload Sanitization (Prevents NoSQL injection)
 * Recursively deletes any object keys starting with '$'
 */
export function sanitize(input) {
  if (input instanceof Array) {
    for (let i = 0; i < input.length; i++) {
      sanitize(input[i]);
    }
  } else if (input !== null && typeof input === 'object') {
    Object.keys(input).forEach(key => {
      if (key.startsWith('$')) {
        delete input[key];
      } else {
        sanitize(input[key]);
      }
    });
  }
  return input;
}

/**
 * 3. Booking Input Sanitization & Strict Validation
 */
export function validateBookingInput(body) {
  const { patientName, phone, email } = body;

  if (!patientName || typeof patientName !== 'string' || !patientName.trim()) {
    return { isValid: false, error: 'Patient name is required.' };
  }

  if (patientName.length > 100) {
    return { isValid: false, error: 'Patient name must be under 100 characters.' };
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { isValid: false, error: 'Valid phone number is required.' };
  }

  // Basic numeric character validation for phone
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number must be between 10 and 15 digits.' };
  }

  if (email && typeof email === 'string' && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, error: 'Invalid email address format.' };
    }
  }

  return { isValid: true };
}
