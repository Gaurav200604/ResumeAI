const rateLimit = require('express-rate-limit');

/**
 * Auth rate limiter — strict.
 * Prevents brute-force attacks on login/register.
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP. Please try again in 15 minutes.' },
    skipSuccessfulRequests: true, // only count failed attempts
});

/**
 * Interview generation limiter — moderate.
 * AI calls are expensive — limit to 5 generations per 10 minutes per IP.
 */
const interviewGenerateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many report generation requests. Please wait before trying again.' },
});

/**
 * General API limiter — relaxed.
 * Applies to read endpoints (get report, get all reports).
 * 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
});

module.exports = { authLimiter, interviewGenerateLimiter, generalLimiter };
