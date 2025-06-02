import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Sensors from './pages/Sensors';
import Actuators from './pages/Actuators';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function MainLayout() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (token && savedUser) {
      setUserId(savedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserId(null);
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const navItemStyle = (path) => ({
    color: location.pathname === path ? '#ffffff' : '#000000',
    backgroundColor: location.pathname === path ? '#065f46' : 'transparent',
    padding: '6px 10px',
    borderRadius: '6px',
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '17px',
    width: '100%'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isLoggedIn && (
        <nav style={{ width: '260px', backgroundColor: '#f4fbf7', padding: '20px', borderRight: '1px solid #e5e7eb', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#065f46', fontSize: '18px', fontWeight: 'bold', marginBottom: '24px' }}>
            Greenhouse Environmental Monitoring and Control System
          </h2>
          <div style={{ marginBottom: '24px', fontWeight: 'bold', color: '#000' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '16px' }}>Login: {userId || 'Not Logged In'}</span>
            <button onClick={handleLogout} style={{ display: 'block', marginTop: '10px', padding: '6px 10px', fontSize: '13px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '15px' }}>
            <li style={{ marginBottom: '16px' }}>
              <Link to="/dashboard" style={navItemStyle('/dashboard')}>
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '16px' }}>
              <Link to="devices/sensors" style={navItemStyle('/devices/sensors')}>
                Sensors Management
              </Link>
            </li>
            <li style={{ marginBottom: '16px' }}>
              <Link to="devices/actuators" style={navItemStyle('/devices/actuators')}>
                Actuator Management
              </Link>
            </li>
            {/* <li style={{ marginBottom: '16px' }}>
              <Link to="/devices" style={navItemStyle('/devices')}>
                Devices Management
              </Link>
              <ul style={{ paddingLeft: '10px', marginTop: '8px', listStyle: 'none' }}>
                <li style={{ marginBottom: '12px' }}>
                  <Link to="/devices/sensors" style={navItemStyle('/devices/sensors')}>
                    Sensors
                  </Link>
                </li>
                <li>
                  <Link to="/devices/actuators" style={navItemStyle('/devices/actuators')}>
                    Actuators
                  </Link>
                </li>
              </ul>
            </li> */}
            <li style={{ marginTop: '16px' }}>
              <Link to="/history" style={navItemStyle('/history')}>
                History
              </Link>
            </li>
          </ul>
        </nav>
      )}
      <main style={{ flex: 1, padding: '24px', backgroundColor: '#ffffff' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setUserId={setUserId} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} /> */}
          <Route path="/devices/sensors" element={<ProtectedRoute><Sensors /></ProtectedRoute>} />
          <Route path="/devices/actuators" element={<ProtectedRoute><Actuators /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
