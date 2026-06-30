import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js';

const Register = () => {
    const { loading, handleRegister } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleRegister(username, email, password);
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    if (loading) {
        return <div className='loading'>Loading...</div>;
    }

    return (
        <main className="auth-page">
            <div className='auth-card'>

                {/* Brand */}
                <div className="auth-brand">
                    <div className="auth-brand__icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span className="auth-brand__name">InterviewAI</span>
                </div>

                <h1>Create account</h1>
                <p className="auth-subtitle">Start your AI-powered interview preparation today.</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            id="username"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            id="password"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button className="btn primarybtn" type="submit" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')}>Sign in</span>
                </p>
            </div>
        </main>
    );
};

export default Register;
