const { PDFParse } = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const InterviewReportModel = require('../model/interviewReport.model');


/**
 * @description Generate an interview report based on the candidate's resume, self-description, and job description. 
 */

async function generateInterviewReportController(req, res) {
    try {
        
        // This pdf-parse fork uses a class: new PDFParse({ data, verbosity })

        const parser = new PDFParse({ data: req.file.buffer, verbosity: 0 });
        const resumeContent = await parser.getText();

        const { selfDescription, jobDescription } = req.body;
        
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,           // JWT payload uses "id", not "_id"
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        });

        res.status(200).json({
            message: "Interview report generated successfully",
            interviewReport,
        });
    } catch (err) {
        console.error("[Interview Controller]", err);
        const isOverload =
            err?.message?.includes("503") ||
            err?.message?.includes("UNAVAILABLE") ||
            err?.message?.includes("high demand");

        res.status(isOverload ? 503 : 500).json({
            error: isOverload
                ? "The AI model is currently overloaded. Please try again in a moment."
                : "Failed to generate interview report.",
            details: err.message,
        });
    }
}

/**
 * @description Get the interview report for a specific interview. 
 */
async function getInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await InterviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ error: "Interview report not found." });
        }

        res.status(200).json({ interviewReport });
    } catch (err) {
        console.error("[Interview Controller - getById]", err);
        res.status(500).json({ error: "Failed to fetch interview report.", details: err.message });
    }
}

/**
 * @description Get all interview reports for the authenticated user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await InterviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({ interviewReports });
    } catch (err) {
        console.error("[Interview Controller - getAll]", err);
        res.status(500).json({ error: "Failed to fetch interview reports.", details: err.message });
    }
}

module.exports ={generateInterviewReportController ,getInterviewReportController, getAllInterviewReportsController};