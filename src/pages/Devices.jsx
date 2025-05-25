// src/pages/Devices.jsx
import { useNavigate } from 'react-router-dom';

export default function Devices() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px' }}>
      <h1
  style={{
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    backgroundColor: '#4A7755', // 深绿色背景
    color: 'white',              // 字体白色更清晰
    padding: '10px 24px'
  }}
>
  Devices Management
</h1>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div
          style={{
            flex: 1,
            backgroundColor: '#e6f4ea',
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          onClick={() => navigate('/devices/sensors')}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Sensors Management</h2>
          <p>Manage all sensor devices</p>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: '#e6f4ea',
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
          onClick={() => navigate('/devices/actuators')}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Actuators Management</h2>
          <p>Manage all actuator devices</p>
        </div>
      </div>
    </div>
  );
}