const express = require('express');
const interviewRouter = express.Router();

const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware.js');
const { interviewGenerateLimiter } = require('../middlewares/ratelimit.middleware');
const { validate, validatePdfUpload, validateObjectId, generateReportSchema } = require('../middlewares/validate.middleware');

/**
 * @route POST /api/interview
 * @desc  Generate an AI interview report (upload resume PDF + job description)
 * @access Private
 */
interviewRouter.post('/',
    authMiddleware.authUser,
    interviewGenerateLimiter,
    upload.single('resume'),
    validatePdfUpload,
    validate(generateReportSchema),
    interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc  Get a single interview report by ID
 * @access Private
 */
interviewRouter.get('/report/:interviewId',
    authMiddleware.authUser,
    validateObjectId('interviewId'),
    interviewController.getInterviewReportController
);

/**
 * @route GET /api/interview
 * @desc  Get all interview reports for the authenticated user
 * @access Private
 */
interviewRouter.get('/',
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @desc  Generate and download a tailored resume PDF for a report
 * @access Private
 */
interviewRouter.get('/resume/pdf/:interviewReportId',
    authMiddleware.authUser,
    validateObjectId('interviewReportId'),
    interviewController.generateInterviewReportPDFController
);

module.exports = interviewRouter;
