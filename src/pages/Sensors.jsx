// src/pages/Sensors.jsx
import { useState, useEffect  } from 'react';

const unitMap = {
  'Temperature': 'Cel',
  'Soil_Moisture': '%',
  'Lightness': 'lx',
  'CO2_Concentration': 'ppm',
};

export default function Sensors() {
  const [devices, setDevices] = useState([]);
  const [newDeviceType, setNewDeviceType] = useState('Temperature');
  const [thresholds, setThresholds] = useState({});
  const [thresholdsInput, setThresholdsInput] = useState({ min: '', max: '' });
  const [activeSection, setActiveSection] = useState(null); //'addDevice' / 'threshold' / null
  const [loading, setLoading] = useState(false);

  const fetchDevices = () => {
    fetch('http://127.0.0.1:8081/getSensorDevice')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(d => ({
          id: `${d.deviceType}-${d.deviceID}`,
          type: d.deviceType,
          location: d.deviceLocation,
          updateFrequency: d.info_frequency,
          unit: d.unit,
          active: d.status
        }));
        setDevices(mapped);
      })
      .catch(err => console.error("Failure to obtain:", err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDeviceSubmit = async () => {
    const location = document.getElementById('newLocation').value.trim();
    const freq = Number(document.getElementById('newFrequency').value.trim());

    if (!location || isNaN(freq) || Number(freq) <= 0) {
      alert("Please enter valid location and a positive numeric frequency.");
      return;
    }

    const newDevice = {
      type: newDeviceType,
      location: location,
      updateFrequency: freq,
      unit:unitMap[newDeviceType]
    };

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8081/addSensorDevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      });
      if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
      const result = await response.json();
      console.log(result.message);
      // reloading the updated information from the BackEnd
      fetchDevices();
    } catch (err) {
      console.error('Failed to send device to backend:', err);
    }finally{
      setLoading(false);
    }
    document.getElementById('newLocation').value = '';
    document.getElementById('newFrequency').value = '';
  };  

  const deleteDevice = async (id) => {
    const deviceID = {
      deviceID: id.split('-')[1]
    };
    try {
      const response = await fetch('http://127.0.0.1:8081/deleteSensorDevice',{
        method: 'DELETE',
        headers:  {'Content-Type':'application/json'},
        body: JSON.stringify(deviceID)
      });

      if (!response.ok){
        throw new Error(`Failed to delete device. Status: ${response.status}`)
      }

      const result = await response.json();
      console.log(result.message);
      
      fetchDevices();

    } catch (err) {
      console.error('Failed to delete:', err)
    }
  };

  const toggleDevice = (id) => {
    setDevices(devices.map(device => device.id === id ? { ...device, active: !device.active } : device));
  };

  const toggleAll = () => {
    const currentStatus = filteredDevices.some(d => !d.active);
    setDevices(devices.map(d => d.type === newDeviceType ? { ...d, active: currentStatus } : d));
  };

  const handleSetThreshold = () => {
    const { min, max } = thresholdsInput;
    if (isNaN(min) || isNaN(max)) {
      alert("Please enter valid numeric values for thresholds.");
      return;
    }
    setThresholds(prev => ({
      ...prev,
      [newDeviceType]: { min, max }
    }));
    alert(`Threshold for ${newDeviceType}: min=${min}${unitMap[newDeviceType]}, max=${max}${unitMap[newDeviceType]}`);

    setThresholdsInput({ min: '', max: '' });
  };

  const filteredDevices = devices.filter(device => device.type === newDeviceType);
  const thStyle = { padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
    transition: 'background-color 0.2s'
  });
  const switchBtnStyle = { backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const deleteBtnStyle = { backgroundColor: '#f8d7da', padding: '6px 12px', border: 'none', borderRadius: '4px', marginLeft: '10px', cursor: 'pointer' };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', backgroundColor: '#4A7755', color: 'white', padding: '10px 24px' }}>
        Sensors Management
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="deviceType">Filter & Add Devices by Type: </label>
        <select id="deviceType" value={newDeviceType} onChange={(e) => setNewDeviceType(e.target.value)} style={{ marginRight: '10px', cursor: 'pointer' }}>
          <option>Temperature</option>
          <option>Soil_Moisture</option>
          <option>Lightness</option>
          <option>CO2_Concentration</option>
        </select>
        <button style={switchBtnStyle} onClick={() => setActiveSection(prev => (prev === 'add' ? null : 'add'))}>Add Device</button>
        <button style={{...switchBtnStyle, marginLeft: '15px' }} onClick={() => setActiveSection(prev => (prev === 'threshold' ? null : 'threshold'))}>Set Threshold</button>
        <button style={{ ...switchBtnStyle, marginLeft: '15px' }} onClick={toggleAll}>Turn On All </button>
        <button style={{ ...switchBtnStyle, marginLeft: '15px' }} onClick={toggleAll}>Turn Off All </button>
      </div>

      {activeSection === 'add' && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>New Device Info</h3>
          <label>
            Location:{' '}
            <input
              id = "newLocation"
              type="text"
              placeholder = "Device Location"
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Frequency (s):{' '}
            <input
              id = "newFrequency"
              type="number"
              min="1"
              placeholder="Update Frequency (s)"
            />
          </label>
          <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={handleAddDeviceSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
        </div>
      )}

      {activeSection === 'threshold' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '8px' }}>Threshold</h3>
            <label>
              Min ({unitMap[newDeviceType]}):{' '}
              <input type="text" value={thresholdsInput.min} onChange={(e) => setThresholdsInput({ ...thresholdsInput, min: e.target.value })} />
            </label>
            <label style={{ marginLeft: '10px' }}>
              Max ({unitMap[newDeviceType]}):{' '}
              <input type="text" value={thresholdsInput.max} onChange={(e) => setThresholdsInput({ ...thresholdsInput, max: e.target.value })} />
            </label>
            <button onClick={handleSetThreshold} style={{ ...switchBtnStyle, marginLeft: '10px' }}>Save</button>
          </div>

          <div style={{ marginTop: '10px', marginBottom: '20px', fontStyle: 'italic', color: '#555' }}>
            {thresholds[newDeviceType]
              ? `Threshold set for ${newDeviceType}: min = ${thresholds[newDeviceType].min}${unitMap[newDeviceType]}, max = ${thresholds[newDeviceType].max}${unitMap[newDeviceType]}`
              : `No threshold set for ${newDeviceType} yet.`}
          </div>
        </>       
      )}

      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, backgroundColor: '#f9f9f9', boxShadow: '0 0 8px rgba(0,0,0,0.05)', border: '1px solid #ddd' }}>
        <thead style={{ backgroundColor: '#e6f4ea' }}>
          <tr>
            <th style={thStyle}>Device ID</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Frequency(s)</th>
            <th style={thStyle}>Active</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device, index) => (
            <tr key={device.id} style={rowStyle(index)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef2f0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5'}>
              <td style={tdStyle}>{device.id}</td>
              <td style={tdStyle}>{device.location}</td>
              <td style={tdStyle}>{device.updateFrequency}</td>
              <td style={{ ...tdStyle, fontWeight: 'bold', color: device.active ? 'green' : 'red' }}>{device.active ? 'on' : 'off'}</td>
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
