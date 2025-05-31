import { useState } from 'react';

const generateActuators = (label, count) => {
  const baseName = label
    .replace(/ /g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');
  const devices = [];
  for (let i = 0; i < count; i++) {
    const index = i + 1;
    devices.push({
      id: `${baseName}_${index}`,
      type: label,
      location: `location_${index}`,
      active: true,
      updateFrequency: '10s'
    });
  }
  return devices;
};

const initialDevices = [
  ...generateActuators('Heater', 6),
  ...generateActuators('Cooler', 6),
  ...generateActuators('Drip_Irrigation_Pipe', 6),
  ...generateActuators('LED_Light', 6),
  ...generateActuators('Carbon_Dioxide_Generator', 6),
  ...generateActuators('Exhaust_Fan', 6),
  ...generateActuators('Sunshade_Net', 6),
];
export default function Actuators() {
  const [devices, setDevices] = useState(initialDevices);
  const [newDeviceType, setNewDeviceType] = useState('Heater');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeviceData, setNewDeviceData] = useState({ location: '', frequency: '' });

  const actuatorTypes = [
    'Heater',
    'Cooler',
    'Drip_Irrigation_Pipe',
    'LED_Light',
    'Carbon_Dioxide_Generator',
    'Exhaust_Fan',
    'Sunshade_Net'
  ];

  const turnOnAll = () => {
    setDevices(devices.map(d =>
      d.type === newDeviceType ? { ...d, active: true } : d
    ));
  };

  const turnOffAll = () => {
    setDevices(devices.map(d =>
      d.type === newDeviceType ? { ...d, active: false } : d
    ));
  };
  const handleAddDeviceSubmit = async () => {
    const location = newDeviceData.location.trim();
    const freq = newDeviceData.frequency.trim();
    if (!location || isNaN(freq) || Number(freq) <= 0) {
      alert("Please enter a valid location and a positive numeric frequency.");
      return;
    }

    const sameType = devices.filter(d => d.type === newDeviceType);
    const index = sameType.length + 1;
    const baseName = newDeviceType
      .replace(/ /g, '_')
      .replace(/-/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');

    const newDevice = {
      id: `${baseName}_${index}`,
      type: newDeviceType,
      location,
      active: true,
      updateFrequency: `${freq}s`
    };

    setDevices([...devices, newDevice]);
    setNewDeviceData({ location: '', frequency: '' });
    setShowAddForm(false);

    try {
      await fetch('/api/actuators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      });
      console.log('Actuator submitted to backend');
    } catch (err) {
      console.error('Failed to submit actuator:', err);
    }
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const toggleDevice = (id) => {
    setDevices(devices.map(device =>
      device.id === id ? { ...device, active: !device.active } : device
    ));
  };

  const filteredDevices = devices.filter(device => device.type === newDeviceType);

  const thStyle = { padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  });
  const switchBtnStyle = { backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px' };
  const deleteBtnStyle = { backgroundColor: '#f8d7da', padding: '6px 12px', border: 'none', borderRadius: '4px', marginLeft: '10px' };
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        backgroundColor: '#4A7755',
        color: 'white',
        padding: '10px 24px'
      }}>
        Actuators Management
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="deviceType">Filter & Add Actuators by Type: </label>
        <select
          id="deviceType"
          value={newDeviceType}
          onChange={(e) => setNewDeviceType(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          {actuatorTypes.map(type => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <button style={switchBtnStyle} onClick={() => setShowAddForm(!showAddForm)}>Add Device</button>
        <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={turnOnAll}>Turn On All</button>
        <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={turnOffAll}>Turn Off All</button>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>New Actuator Info</h3>
          <label>
            Location:{' '}
            <input
              type="text"
              value={newDeviceData.location}
              onChange={(e) => setNewDeviceData({ ...newDeviceData, location: e.target.value })}
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Update Frequency (s):{' '}
            <input
              type="text"
              value={newDeviceData.frequency}
              onChange={(e) => setNewDeviceData({ ...newDeviceData, frequency: e.target.value })}
            />
          </label>
          <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={handleAddDeviceSubmit}>
            Submit
          </button>
        </div>
      )}
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 8px rgba(0,0,0,0.05)',
        border: '1px solid #ddd'
      }}>
        <thead style={{ backgroundColor: '#e6f4ea' }}>
          <tr>
            <th style={thStyle}>Actuator ID</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Active</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device, index) => (
            <tr
              key={device.id}
              style={rowStyle(index)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5'}
            >
              <td style={tdStyle}>{device.id}</td>
              <td style={tdStyle}>{device.location}</td>
              <td style={tdStyle}>{device.updateFrequency}</td>
              <td style={{
                ...tdStyle,
                fontWeight: 'bold',
                color: device.active ? 'green' : 'red'
              }}>
                {device.active ? 'on' : 'off'}
              </td>
              <td style={tdStyle}>
                <button style={switchBtnStyle} onClick={() => toggleDevice(device.id)}>Switch</button>
                <button style={deleteBtnStyle} onClick={() => deleteDevice(device.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
