const { z } = require('zod');

/**
 * Zod validation middleware factory.
 * Usage: validate(schema) — validates req.body against the schema.
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', errors });
    }
    req.body = result.data; // use the parsed/coerced data
    next();
};

// ── Auth schemas ──────────────────────────────────────────────────────────────
const registerSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
        .trim(),
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password is too long'),
});

const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});

// ── Interview schemas ─────────────────────────────────────────────────────────
const generateReportSchema = z.object({
    jobDescription: z
        .string({ required_error: 'Job description is required' })
        .min(50, 'Job description is too short (minimum 50 characters)')
        .max(10000, 'Job description is too long (maximum 10,000 characters)')
        .trim(),
    selfDescription: z
        .string()
        .max(2000, 'Self description is too long (maximum 2,000 characters)')
        .trim()
        .default(''),
});

// ── File validation middleware ────────────────────────────────────────────────
/**
 * Validates that the uploaded file is a real PDF by checking:
 * 1. A file was actually uploaded
 * 2. The MIME type is application/pdf
 * 3. The first 4 bytes match the PDF magic bytes (%PDF)
 */
const validatePdfUpload = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Resume file is required' });
    }

    if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Only PDF files are accepted' });
    }

    // Check PDF magic bytes: %PDF = 0x25 0x50 0x44 0x46
    const magic = req.file.buffer.slice(0, 4);
    if (magic.toString('ascii') !== '%PDF') {
        return res.status(400).json({ error: 'Uploaded file does not appear to be a valid PDF' });
    }

    if (req.file.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: 'Resume file must be under 3MB' });
    }

    next();
};

// ── MongoDB ObjectId validation ───────────────────────────────────────────────
const validateObjectId = (paramName) => (req, res, next) => {
    const id = req.params[paramName];
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        return res.status(400).json({ error: `Invalid ${paramName}` });
    }
    next();
};

module.exports = { validate, validatePdfUpload, validateObjectId, registerSchema, loginSchema, generateReportSchema };
