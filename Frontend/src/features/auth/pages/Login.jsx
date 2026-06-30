import { useState } from 'react'
import '../auth.form.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleLogin(email, password);
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    if (loading) {
        return <div className='loading'>Loading...</div>;
    }

    return (
        <main>
            <div className='login'>
                <h1>Welcome back</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            id="email"
                            placeholder='Enter your email'
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
                            placeholder='Enter your password'
                            required
                        />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <button className="btn primarybtn" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
            </div>
        </main>
    );
};

export default Login;
