import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/gritlabs_logo.jpg';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await signup(email, password, name, position, team, role);
      setSuccess('✅ Verification email sent! Please check your inbox and click the link to verify your account.');
      // Clear the form
      setEmail('');
      setPassword('');
      setName('');
      setPosition('');
      setTeam('');
      setRole('member');
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      // If email rate limit exceeded, show a helpful message
      if (msg.toLowerCase().includes('rate limit')) {
        setError('Too many signup attempts. Please wait a few minutes and try again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <img src={logo} alt="GRIT Labs" className="login-logo" />
        <h2>Create Account</h2>
        {success ? (
          <div className="success-box">
            <p className="success">{success}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <Link to="/">Return to Sign In</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Position (e.g., Developer)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Team (e.g., Backend)"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              disabled={isSubmitting}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={isSubmitting}>
              <option value="member">Member</option>
              <option value="team_lead">Team Lead</option>
              <option value="admin">Admin</option>
            </select>
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}
        <p>
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;