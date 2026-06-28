const pdfParse = require('pdf-parse');
const generateInterviewReport = require('../services/ai.service');
const InterviewReportModel = require('../model/interviewReport.model');

async function generateInterviewReportController(req, res) {
     const resume = req.file;

     const resumeContent = await pdfParse(req.file.buffer);

     const {seflDescription, jobDescription} = req.body;

     const interviewReportByAi = await generateInterviewReport(
        {
            resume:resumeContent,
            selfDescription:seflDescription,
            jobDescription:jobDescription
        }
     );

     const interviewReport = await InterviewReportModel.create({
        user:req.user._id,
        resume:resumeContent,
        selfDescription:seflDescription,
        jobDescription:jobDescription,
        ...interviewReportByAi
     });

     res.status(200).json({
        message:"Interview report generated successfully",
        interviewReport:interviewReport
     });

     


}

module.exports ={generateInterviewReportController}