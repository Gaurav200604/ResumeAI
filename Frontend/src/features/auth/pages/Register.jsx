import React from 'react'

import {useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth.js';


const Register = () => {
  const { loading, handleRegister } = useAuth();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate('/');
  }

  if(loading){
    return <div className='loading'>Loading...</div>
  }

  return (
   <main>
        <div className='login'>
            <h1>Register</h1>
            <form action="" onSubmit={handleSubmit}>
                
                
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" placeholder='Enter your username' />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder='Enter your email' />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder='Enter your password' />
                </div>

                <button className="btn primarybtn" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p>Already have an account? <span onClick={()=>navigate('/login')}>Login</span></p>
            
        </div>
    </main>
  )
}

export default Register
