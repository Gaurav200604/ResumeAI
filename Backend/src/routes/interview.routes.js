const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload   = require('../middleware/file.middleware');
const interviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @desc Generate an interview report based on the candidate's resume, self-description, and job description.
 * @access Private
 */

interviewRouter.post("/",authMiddleware.authUser ,upload.single('resume'), interviewController.generateInterviewReportController);


module.exports = interviewRouter;
