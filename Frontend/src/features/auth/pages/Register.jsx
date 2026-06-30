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
        <main>
            <div className='login'>
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            id="username"
                            placeholder='Enter your username'
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
            </div>
        </main>
    );
};

export default Register;
