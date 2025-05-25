// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (invitationCode !== 'farmer2025') {
      alert('Invalid invitation code');
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    localStorage.setItem('registeredUser', username);
    localStorage.setItem('registeredPass', password);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Left side */}
      <div style={{ flex: 4, backgroundColor: '#e6f4ea', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <img src="/Logo.png" alt="Logo" style={{ height: '130px', marginTop: '30px' }} />
          <h1 style={{ fontSize: '27px', fontWeight: 'bold', color: '#065f46' }}>Greenhouse Environmental Monitoring and Control System</h1>
        </div>
        <div style={{ color: '#555', fontSize: '16px', lineHeight: '2', textAlign: 'center', fontWeight: '500' }}>
          <p>• Real-time monitoring of sensor data</p>
          <p>• Device management</p>
          <p>• Threshold configuration and visualization</p>
          <p>• Historical data access and review</p>
        </div>
      </div>

      {/* Right side */}
      <div style={{ flex: 6, backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '520px', background: 'white', padding: '48px', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '24px' }}>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '14px', fontSize: '16px', backgroundColor: '#e6f4ea', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
            required
          />
          <input
            type="text"
            placeholder="Invitation Code"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '14px', fontSize: '16px', backgroundColor: '#e6f4ea', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
            required
          />
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: '#e6f4ea', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#065f46' }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
                  <path d="M12 9c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5c-2.21 0-4.26.896-5.735 2.344l1.428 1.428c1.069-.887 2.443-1.372 3.885-1.372 3.861 0 7.082 2.607 8.509 4.6-.6.845-1.383 1.698-2.324 2.455l1.421 1.421c1.262-1.042 2.302-2.256 3.094-3.457 0 0-4-7-11-7zm-9.293-.707l2.293 2.293c-1.537 1.325-2.755 2.884-3.683 4.414 1.237 2.059 3.705 4.66 7.293 5.758l1.516 1.516c-.698.13-1.422.226-2.133.226-7 0-11-7-11-7 1.163-2.033 3.076-4.26 5.717-6.5l-2.21-2.21 1.414-1.414z" />
                </svg>
              )}
            </span>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '24px', fontSize: '16px', backgroundColor: '#e6f4ea', border: '1px solid #ccc', borderRadius: '6px', boxSizing: 'border-box' }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px', backgroundColor: '#065f46', color: 'white', border: 'none', borderRadius: '6px', boxSizing: 'border-box' }}>
            Register
          </button>
          <p style={{ marginTop: '14px', textAlign: 'center', fontSize: '15px' }}>
            Already have an account? <Link to="/login" style={{ color: '#065f46', fontWeight: '500' }}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
