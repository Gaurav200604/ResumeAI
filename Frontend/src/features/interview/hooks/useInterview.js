import {getAllInterviewReports,generateInterviewReport,getInterviewReportById,generateResumePdf} from '../services/interview.api.js'
import {useContext} from 'react'
import {InterviewContext} from '../interview.context.jsx'


export const useInterview = () => {
    const  context = useContext(InterviewContext)
    if(!context){
        throw new Error("useInterview must be used inside an InterviewProvider")
    }
    
    const {loading,setLoading,report,setreport,reports,setReports} = context

    const generateReport = async (jobDescription,selfDescription,resume) => {
        setLoading(true)
        try{
            const response = await generateInterviewReport({jobDescription,selfDescription,resume})
            // API returns { message, interviewReport } — extract the report
            const reportData = response.interviewReport || response
            setreport(reportData)
            return reportData
        } catch (error) {
            console.error("Error generating interview report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        setLoading(true)
        try{
            const response = await getInterviewReportById(id)
            // API returns { interviewReport } — extract the report
            const reportData = response.interviewReport || response
            setreport(reportData)
            return reportData
        } catch (error) {
            console.error("Error fetching interview reports:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try{
            const response = await getAllInterviewReports()
            // API returns { interviewReports } — extract the list
            const reportsData = response.interviewReports || response
            setReports(reportsData)
            return reportsData
        } catch (error) {
            console.error("Error fetching interview reports:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewId) => {
        setLoading(true)
        let response = null
        try{
            response = await generateResumePdf(interviewId)
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `resume_${interviewId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        }
        catch (error) {
            console.error("Error generating resume PDF:", error)
            throw error
        }
        finally {
            setLoading(false)
        }
    }

    return {loading,report,reports,generateReport,getReportById,getReports,getResumePdf}
}