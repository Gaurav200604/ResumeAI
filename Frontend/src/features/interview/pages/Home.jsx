import React ,{useState , useRef} from "react";
import "../Style/home.scss";
import {useInterview} from "../hooks/useInterview.js";
import { useNavigate } from "react-router";


const Home = () => {

    const {loading,generateReport ,reports} = useInterview();

    const  [jobDescription,setJobDescription] = useState('');
    const  [selfDescription,setSelfDescription] = useState('');
    const resumeInputRef = useRef(null);
    const navigate = useNavigate();


    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files[0];
        if (!resumeFile) {
            alert("Please upload a resume PDF.");
            return;
        }
        try {
            const data = await generateReport(jobDescription, selfDescription, resumeFile);
            navigate(`/interview/${data._id}`);
        } catch (err) {
            alert(err?.response?.data?.error || "Failed to generate report. Please try again.");
        }
    };

    if(loading){
        return <div className="loading">Loading...</div>
    }
    

  return (
    <main className="home">
      {/* Left Section */}
      <section className="left">
        <h2>Job Description</h2>
        <p className="subtitle">
          Paste the job description you want to prepare for.
        </p>

        <textarea
          name="jobDescription"
          id="jobDescription"
          placeholder="Enter the job description here..."
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
      </section>

      {/* Right Section */}
      <section className="right">
        <h2>Candidate Information</h2>
        <p className="subtitle">
          Upload your resume and provide a brief self-description.
        </p>

        <div className="input-group">
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            ref={resumeInputRef}
            type="file"
            name="resume"
            id="resume"
            accept=".pdf"
          />
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">
            Self Description
          </label>
          <textarea
            onChange={(e) => setSelfDescription(e.target.value)}
            name="selfDescription"
            id="selfDescription"
            placeholder="Describe yourself in a few sentences..."
          ></textarea>
        </div>

        {/*  recent report list */}
        {reports.length > 0 && (
          <div className="recent-reports">
            <h3>Recent Reports</h3>
            <ul>
              {reports.map((report) => (
                <li key={report._id} className="report-item">
                  <a href={`/interview/${report._id}`}>{report.title}</a>
                  <p className="report-description">{report.description} </p>
                  <p className={`match-score ${report.matchScore >= 80 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`}>
                    Match Score: {report.matchScore}%
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="generate-btn" onClick={handleGenerateReport} disabled={loading}>
          Generate Interview Report
        </button>
      </section>
    </main>
  );
};

export default Home;