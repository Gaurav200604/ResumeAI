import { useState, useEffect } from 'react'
import '../Style/interview.scss'
import { useNavigate, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Questions',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>)
    },
    {
        id: 'behavioral', label: 'Behavioral Questions',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>)
    },
    {
        id: 'skillgaps', label: 'Skill Gaps',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>)
    },
    {
        id: 'roadmap', label: 'Preparation Plan',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>)
    },
]

// ── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap Day ───────────────────────────────────────────────────────────────
const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {(day.task || day.tasks || []).map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Skill Gaps Section ────────────────────────────────────────────────────────
const SkillGapsSection = ({ skillGaps }) => (
    <section>
        <div className='content-header'>
            <h2>Skill Gaps</h2>
            <span className='content-header__count'>{skillGaps.length} gaps identified</span>
        </div>
        <div className='skill-gaps-grid'>
            {skillGaps.length === 0 ? (
                <p className='no-gaps'>No skill gaps found — great match!</p>
            ) : (
                skillGaps.map((gap, i) => (
                    <div key={i} className={`skill-gap-card skill-gap-card--${gap.severity}`}>
                        <span className='skill-gap-card__name'>{gap.skill}</span>
                        <span className={`skill-gap-card__badge skill-gap-card__badge--${gap.severity}`}>
                            {gap.severity}
                        </span>
                    </div>
                ))
            )}
        </div>
    </section>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [pdfLoading, setPdfLoading] = useState(false)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    const handleDownloadPdf = async () => {
        try {
            setPdfLoading(true)
            await getResumePdf(interviewId)
        } catch {
            alert("Failed to generate PDF. Please try again.")
        } finally {
            setPdfLoading(false)
        }
    }

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner' />
                <h1>Generating your interview plan...</h1>
                <p>This may take a few seconds</p>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    const scoreLabel =
        report.matchScore >= 80 ? 'Strong match for this role' :
            report.matchScore >= 60 ? 'Moderate match — keep preparing' :
                'Low match — significant preparation needed'

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className='nav-actions'>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={pdfLoading}
                            className='button primary-button'
                        >
                            {pdfLoading ? (
                                <span>Generating...</span>
                            ) : (
                                <>
                                    <svg height="0.85rem" style={{ marginRight: "0.6rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download Resume PDF
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className='button secondary-button'
                        >
                            <svg height="0.85rem" style={{ marginRight: "0.6rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                            </svg>
                            New Report
                        </button>
                    </div>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length ?? 0} questions</span>
                            </div>
                            <div className='q-list'>
                                {(report.technicalQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions?.length ?? 0} questions</span>
                            </div>
                            <div className='q-list'>
                                {(report.behavioralQuestions || []).map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'skillgaps' && (
                        <SkillGapsSection skillGaps={report.skillGaps || []} />
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan?.length ?? 0}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {(report.preparationPlan || []).map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className={`match-score__sub match-score__sub--${scoreColor.replace('score--', '')}`}>
                            {scoreLabel}
                        </p>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {(report.skillGaps || []).map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                            {(!report.skillGaps || report.skillGaps.length === 0) && (
                                <span className='skill-tag skill-tag--low'>No gaps found</span>
                            )}
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    <div className='sidebar-meta'>
                        <p className='sidebar-meta__label'>Report Details</p>
                        <div className='sidebar-meta__row'>
                            <span>Technical Qs</span>
                            <span>{report.technicalQuestions?.length ?? 0}</span>
                        </div>
                        <div className='sidebar-meta__row'>
                            <span>Behavioral Qs</span>
                            <span>{report.behavioralQuestions?.length ?? 0}</span>
                        </div>
                        <div className='sidebar-meta__row'>
                            <span>Prep Days</span>
                            <span>{report.preparationPlan?.length ?? 0}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview
