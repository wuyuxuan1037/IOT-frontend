// src/pages/Actuators.jsx
import { useState } from 'react';

const initialDevices = [
  ...Array.from({ length: 15 }, (_, i) => ({ id: `Heater-${i + 1}`, type: 'Heater', active: true })),
  ...Array.from({ length: 15 }, (_, i) => ({ id: `Cooler-${i + 1}`, type: 'Cooler', active: true })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `Drip-${i + 1}`, type: 'Drip irrigation pipe', active: true })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `Led-${i + 1}`, type: 'LED Light', active: true })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `Co2_generator-${i + 1}`, type: 'Carbon Dioxide Generator', active: true })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `Fan-${i + 1}`, type: 'Exhaust Fan', active: true })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `Shade-${i + 1}`, type: 'Sunshade Net', active: true })),
];

export default function Actuators() {
  const [devices, setDevices] = useState(initialDevices);
  const [newDeviceType, setNewDeviceType] = useState('Heater');

  const addDevice = () => {
    const id = `${newDeviceType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '')}-${devices.length + 1}`;
    setDevices([...devices, { id, type: newDeviceType, active: true }]);
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const toggleDevice = (id) => {
    setDevices(devices.map(device => device.id === id ? { ...device, active: !device.active } : device));
  };

  const toggleAll = () => {
    const currentStatus = filteredDevices.some(d => !d.active);
    setDevices(devices.map(d => d.type === newDeviceType ? { ...d, active: currentStatus } : d));
  };

  const filteredDevices = devices.filter(device => device.type === newDeviceType);

  const actuatorTypes = [
    'Heater',
    'Cooler',
    'Drip irrigation pipe',
    'LED Light',
    'Carbon Dioxide Generator',
    'Exhaust Fan',
    'Sunshade Net'
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          backgroundColor: '#4A7755',
          color: 'white',
          padding: '10px 24px'
        }}
      >
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
        <button
          style={{ backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px' }}
          onClick={addDevice}
        >
          Add Device
        </button>
        <button
          style={{ backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px', marginLeft: '10px' }}
          onClick={toggleAll}
        >
          Turn On/Off
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          backgroundColor: '#f9f9f9',
          boxShadow: '0 0 8px rgba(0,0,0,0.05)',
          border: '1px solid #ddd'
        }}
      >
        <thead style={{ backgroundColor: '#e6f4ea' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Actuator ID</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Type</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Active</th>
            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device, index) => (
            <tr
              key={device.id}
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5'}
            >
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{device.id}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{device.type}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: device.active ? 'green' : 'red' }}>
                {device.active ? 'on' : 'off'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                <button
                  style={{
                    backgroundColor: '#d4edda',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  onClick={() => toggleDevice(device.id)}
                >
                  Switch
                </button>
                <button
                  style={{
                    backgroundColor: '#f8d7da',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    marginLeft: '10px'
                  }}
                  onClick={() => deleteDevice(device.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
