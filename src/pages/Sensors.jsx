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
  const [newDeviceType, setNewDeviceType] = useState('All');
  const [thresholds, setThresholds] = useState({});
  const [thresholdsInput, setThresholdsInput] = useState({ min: '', max: '' });
  const [activeSection, setActiveSection] = useState(null); //'addDevice' / 'threshold' / null

  useEffect(()=>{
    fetchDevices();
    fetchThreshold();
  },[])

  useEffect(() => {
    if (newDeviceType !== 'All' && thresholds[newDeviceType]) {
    setThresholdsInput({
      min: thresholds[newDeviceType].min,
      max: thresholds[newDeviceType].max
    });
    } else {
      setThresholdsInput({ min: '', max: '' });
    }
  }, [newDeviceType, thresholds]);

  const fetchDevices = () => {
    fetch('http://127.0.0.1:8081/sensor/getSensorDevice')
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

  const fetchThreshold = () => {
    fetch('http://127.0.0.1:8082/controller/getControllerThreshold')
      .then(res => res.json())
      .then(data => {
        const mapped = {};
          data.forEach(d => {
          mapped[d.deviceType] = {
            min: d.thresholdMin,
            max: d.thresholdMax
          };
        });
    setThresholds(mapped);
      })
      .catch(err => console.error("Failure to obtain:", err));
  };

  const handleAddDeviceSubmit = async () => {
    const location = document.getElementById('newLocation').value.trim();
    const frequency = Number(document.getElementById('newFrequency').value);

    if (!location && !frequency) {
    alert("Location and Frequency is required.");
    return;
  }

    try {
      const response = await fetch('http://127.0.0.1:8081/sensor/addSensorDevice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({type: newDeviceType,
                              location: location,
                              updateFrequency: frequency,
                              unit: unitMap[newDeviceType]})
        });
      if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
      const result = await response.json();
      console.log(result.message);
      // reloading the updated information from the BackEnd
    await fetchDevices();
    } catch (err) {
      console.error('Failed to send device to backend:', err);
    }
    document.getElementById('newLocation').value = '';
    document.getElementById('newFrequency').value = '';
  };  

  const deleteSensorDevice = async (id) => {
    const deviceID = {
      deviceID: id.split('-')[1]
    };
    try {
      const response = await fetch('http://127.0.0.1:8081/sensor/deleteSensorDevice',{
        method: 'POST',
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

  const updateSensorStatus = async (deviceIDs, targetStatus) => {
    try {
      const response = await fetch('http://127.0.0.1:8081/sensor/updateSensorStatus',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          device_ids: deviceIDs,
          target_status: targetStatus
        })
      });
      if (!response.ok){
        throw new Error('Update failed')
      }
      fetchDevices()
    } catch (err) {
      console.log('Failed to update device status',err)
    }
  }

  const toggleDevice = (id, active) => {
    updateSensorStatus([id.split('-')[1]], !active)
  };

  const toggleAll = (turnOn) => {
    const ids = filteredDevices.map(d => d.id.split('-')[1]);
    updateSensorStatus(ids, turnOn)
  };

  const handleSetThreshold = async () => {
    const minVal = Number(document.getElementById('changeMinThreshold').value.trim());
    const maxVal = Number(document.getElementById('changeMaxThreshold').value.trim());

    if (minVal >= maxVal) {
        alert("Please make the Min value lower than Max.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8082/controller/updateControllerThreshold', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          deviceType: newDeviceType,
          thresholdMin: minVal,
          thresholdMax: maxVal
        })
      })
      
      if (!response.ok){
        throw new Error('Update threshold value failed')
      }
      await fetchThreshold()
    } catch (err) {
      console.log('Failed to set threshold',err)
    }
    document.getElementById('changeMinThreshold').value = '';
    document.getElementById('changeMaxThreshold').value = '';
  };

  const filteredDevices = newDeviceType === 'All' ? devices : devices.filter(device => device.type === newDeviceType);
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
          <option value="All">All</option>
          <option value="Temperature">Temperature</option>
          <option value="Soil_Moisture">Soil_Moisture</option>
          <option value="Lightness">Lightness</option>
          <option value="CO2_Concentration">CO2_Concentration</option>
        </select>
        <button style={{backgroundColor: newDeviceType === 'All' ? '#ccc' : switchBtnStyle.backgroundColor, padding: '6px 12px', 
          border: 'none', borderRadius: '4px', cursor: newDeviceType === 'All' ? 'not-allowed' : 'pointer' }}
          onClick={() => setActiveSection(prev => (prev === 'add' ? null : 'add'))} disabled={newDeviceType === 'All'}>Add Device</button>
        {/* <button style={{marginLeft: '15px',backgroundColor: newDeviceType === 'All' ? '#ccc' : switchBtnStyle.backgroundColor, padding: '6px 12px', 
          border: 'none', borderRadius: '4px', cursor: newDeviceType === 'All' ? 'not-allowed' : 'pointer' }}
          onClick={() => setActiveSection(prev => (prev === 'threshold' ? null : 'threshold'))} disabled={newDeviceType === 'All'}>Set Threshold</button> */}
        <button style={{ ...switchBtnStyle, marginLeft: '15px' }} onClick={() => toggleAll(true)}>Turn On All </button>
        <button style={{ ...switchBtnStyle, marginLeft: '15px' }} onClick={() => toggleAll(false)}>Turn Off All </button>
      </div>

      {activeSection === 'add' && newDeviceType !== 'All' &&  (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>New Device Info</h3>
          <label>
            Location:{' '}
            <input
              id = "newLocation"
              type="text"
            />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Frequency (s):{' '}
            <input
              id = "newFrequency"
              type="number"
              min="1"
            />
          </label>
          <button style={{ ...switchBtnStyle, marginLeft: '10px', backgroundColor: newDeviceType === 'All' ? '#ccc' : switchBtnStyle.backgroundColor,
                                                          cursor: newDeviceType === 'All' ? 'not-allowed' : 'pointer' }} onClick={handleAddDeviceSubmit} >Submit</button>
        </div>
      )}

      {newDeviceType !== 'All' && (<>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>Threshold</h3>
          <label>
            Min ({unitMap[newDeviceType]}):{' '}
            <input id = "changeMinThreshold"  value={thresholdsInput.min}
                  onChange={(e) => setThresholdsInput(prev => ({ ...prev, min: e.target.value }))}  type="number" />
          </label>
          <label style={{ marginLeft: '10px' }}>
            Max ({unitMap[newDeviceType]}):{' '}
            <input id = "changeMaxThreshold" value={thresholdsInput.max}
                  onChange={(e) => setThresholdsInput(prev => ({ ...prev, max: e.target.value }))} type="number" />
          </label>
          <button onClick={handleSetThreshold} style={{ ...switchBtnStyle, marginLeft: '10px',backgroundColor: switchBtnStyle.backgroundColor,
                      cursor: 'pointer' }} >Save</button>
        </div>
      </> )}
          
      <div style={{ marginTop: '10px', marginBottom: '20px', fontStyle: 'italic', color: '#555' }}>
        {newDeviceType === 'All'
          ? 'Please select a specific device type to add a new device or modify thresholds.'
          : thresholds[newDeviceType]
            ? `Threshold set for ${newDeviceType}: min = ${thresholds[newDeviceType].min} ${unitMap[newDeviceType]}, max = ${thresholds[newDeviceType].max} ${unitMap[newDeviceType]}`
            : `No threshold set for ${newDeviceType} yet.`}
      </div>  

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
                <button style={switchBtnStyle} onClick={() => toggleDevice(device.id, device.active)}>Switch</button>
                <button style={deleteBtnStyle} onClick={() => deleteSensorDevice(device.id)} >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
