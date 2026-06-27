import React from 'react'
import '../auth.form.scss'
import {useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js';


const Login = () => {
  const { loading,handleLogin } = useAuth();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');



  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
    navigate('/');
  }

  if(loading){
    return <div className='loading'>Loading...</div>
  }
  

  return (
    <main>
        <div className='login'>
            <h1>Login</h1>
            <form action="" onSubmit={handleSubmit}>
                
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder='Enter your email' />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder='Enter your password' />
                </div>

                <button className="btn primarybtn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>Don't have an account? <span onClick={()=>navigate('/register')}>Register</span></p>
        </div>
    </main>
  )
}

export default Login
