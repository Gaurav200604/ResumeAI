import { useState, useRef, useEffect } from "react";
import "../Style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";
import Loader from "../../../components/Loader.jsx";

const Home = () => {
    const { loading, generateReport, reports, getReports } = useInterview();
    const { user, handleLogout } = useAuth();
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const resumeInputRef = useRef(null);
    const navigate = useNavigate();

    // Fetch recent reports when the home page mounts
    useEffect(() => {
        getReports();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files[0];
        if (!resumeFile) {
            setError("Please upload a resume PDF.");
            return;
        }
        if (!jobDescription.trim()) {
            setError("Please enter a job description.");
            return;
        }
        setError('');
        setGenerating(true);
        try {
            const data = await generateReport(jobDescription, selfDescription, resumeFile);
            navigate(`/interview/${data._id}`);
        } catch (err) {
            setError(err?.response?.data?.error || err?.response?.data?.details || "Failed to generate report. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleLogoutClick = async () => {
        await handleLogout();
        navigate('/login');
    };

    if (loading && !generating) {
        return <div className="loading">Loading...</div>;
    }

    if (generating) {
        return (
            <div className="generating-screen">
                <div className="generating-screen__inner">
                    <div className="generating-spinner" />
                    <h2>Analyzing your profile...</h2>
                    <p>Our AI is reviewing your resume and generating a personalized interview plan. This may take 20–40 seconds.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            {/* ── Top Bar ── */}
            <header className="topbar">
                <div className="topbar__brand">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span>InterviewAI</span>
                </div>
                <div className="topbar__user">
                    <span className="topbar__username">👋 {user?.username}</span>
                    <button className="topbar__logout" onClick={handleLogoutClick}>Logout</button>
                </div>
            </header>

            <main className="home">
                {/* Left Section — Job Description */}
                <section className="left">
                    <div className="panel-header">
                        <div className="dot" />
                        <span>Job Description</span>
                    </div>
                    <p className="panel-sub">Paste the job description you want to prepare for.</p>
                    <textarea
                        name="jobDescription"
                        id="jobDescription"
                        placeholder="Paste the full job description here — requirements, responsibilities, preferred skills..."
                        onChange={(e) => setJobDescription(e.target.value)}
                        value={jobDescription}
                    />
                </section>

                {/* Right Section — Candidate Info */}
                <section className="right">
                    <div className="panel-header">
                        <div className="dot" />
                        <span>Your Profile</span>
                    </div>
                    <p className="panel-sub">Upload your resume and introduce yourself.</p>

                    <div className="input-group">
                        <label htmlFor="resume">Resume (PDF)</label>
                        <input
                            ref={resumeInputRef}
                            type="file"
                            name="resume"
                            id="resume"
                            accept=".pdf"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="selfDescription">Self Description</label>
                        <textarea
                            onChange={(e) => setSelfDescription(e.target.value)}
                            value={selfDescription}
                            name="selfDescription"
                            id="selfDescription"
                            placeholder="Briefly describe your background, years of experience, tech stack, and what you're looking for..."
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="generate-btn-wrap">
                        <button
                            className="generate-btn"
                            onClick={handleGenerateReport}
                            disabled={loading || generating}
                        >
                            <svg width="16" height="16" style={{ marginRight: "8px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                            Generate Interview Report
                        </button>
                    </div>

                    {/* ── Recent Reports ── */}
                    {reports && reports.length > 0 && (
                        <div className="recent-reports">
                            <p className="recent-reports__label">Recent Reports</p>
                            <ul className="recent-reports__list">
                                {reports.map((r) => (
                                    <li
                                        key={r._id}
                                        className="report-item"
                                        onClick={() => navigate(`/interview/${r._id}`)}
                                    >
                                        <div className="report-item__left">
                                            <span className="report-item__date">
                                                {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="report-item__right">
                                            <span className={`report-item__score ${r.matchScore >= 80 ? 'high' : r.matchScore >= 60 ? 'medium' : 'low'}`}>
                                                {r.matchScore}% match
                                            </span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
