import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/gritlabs_logo.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login – just redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="GRIT Labs" className="login-logo" />
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;