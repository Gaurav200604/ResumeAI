const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const interviewController = require('../controllers/interview.controller');
const upload   = require('../middlewares/file.middleware.js');
const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */

interviewRouter.post("/",authMiddleware.authUser ,upload.single('resume'), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get the interview report for a specific interview.
 * @access Private
 */

interviewRouter.get("/report/:interviewId",authMiddleware.authUser , interviewController.getInterviewReportController);


/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user.
 * @access Private
 */

interviewRouter.get("/",authMiddleware.authUser , interviewController.getAllInterviewReportsController);


module.exports = interviewRouter;
