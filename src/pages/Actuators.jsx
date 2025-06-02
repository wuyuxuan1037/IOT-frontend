import { useState, useEffect } from 'react';

const actuatorTypes = [
    'All',  
    'Heater',
    'Cooler',
    'Drip_Irrigation_Pipe',
    'LED_Light',
    'Carbon_Dioxide_Generator',
    'Exhaust_Fan',
    'Sunshade_Net'
];

export default function Actuators() {
  const [devices, setDevices] = useState([]);
  const [newDeviceType, setNewDeviceType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeviceData, setNewDeviceData] = useState({ location: ''});

  useEffect(()=>{
    fetchActuatorDevice()
  },[])

  const fetchActuatorDevice = () =>{
      fetch('http://127.0.0.1:8083/actuator/getActuatorDevice')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(d =>({
          type: d.deviceType,
          id: `${d.deviceType}-${d.deviceID}`,
          location: d.deviceLocation,
          lastStatusUpdate: d.lastStatusUpdate,
          status: d.status
        }))
        setDevices(mapped)
      })
      .catch(err => console.error("Failure to obtain:", err));
  }

  const handleAddDeviceSubmit = async () => {
    const location = document.getElementById('newLocation').value.trim();

    if (!location) {
      alert("Please enter location.");
      return;
    }

    const newDevice = {
      type: newDeviceType,
      location: location,
    };

    try {
      const response = await fetch('http://127.0.0.1:8083/actuator/addActuatorDevice', {
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
      fetchActuatorDevice();
    } catch (err) {
      console.error('Failed to send device to backend:', err);
    }
    setNewDeviceData({ location: '', frequency: '' });
  };  

  const deleteActuatorDevice = async (id) => {
    const deviceID = {
      deviceID: id.split('-')[1]
    };
    try {
      const response = await fetch('http://127.0.0.1:8083/actuator/deleteActuatorDevice',{
        method: 'POST',
        headers:  {'Content-Type':'application/json'},
        body: JSON.stringify(deviceID)
      });

      if (!response.ok){
        throw new Error(`Failed to delete device. Status: ${response.status}`)
      }

      const result = await response.json();
      console.log(result.message);
      
      fetchActuatorDevice()

    } catch (err) {
      console.error('Failed to delete:', err)
    }
  };

  const updateActuatorStatus = async (deviceIDs, targetStatus) => {
    try {
      const response = await fetch('http://127.0.0.1:8083/actuator/updateActuatorStatus',{
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
      fetchActuatorDevice()
    } catch (err) {
      console.log('Failed to update device status',err)
    }
  }

  const toggleAll = (status) => {
    const ids = filteredDevices.map(d => d.id.split('-')[1]);
    updateActuatorStatus(ids, status)
  };

  const toggleDevice = (id,status) => {
    updateActuatorStatus([id.split('-')[1]], !status)
  };

  const filteredDevices = newDeviceType === 'All' ? devices : devices.filter(device => device.type === newDeviceType);

  const thStyle = { padding: '12px', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid #ccc' };
  const tdStyle = { padding: '12px', borderBottom: '1px solid #eee' };
  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
    transition: 'background-color 0.2s',
  });
  const switchBtnStyle = { backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
  const deleteBtnStyle = { backgroundColor: '#f8d7da', padding: '6px 12px', border: 'none', borderRadius: '4px', marginLeft: '10px', cursor: 'pointer' };
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
          style={{ marginRight: '10px', cursor: 'pointer'}}
        >
          {actuatorTypes.map(type => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <button style={{backgroundColor: newDeviceType === 'All' ? '#ccc' : switchBtnStyle.backgroundColor, padding: '6px 12px', 
          border: 'none', borderRadius: '4px', cursor: newDeviceType === 'All' ? 'not-allowed' : 'pointer' }} onClick={() => setShowAddForm(!showAddForm)} disabled={newDeviceType === 'All'}>Add Device</button>
        <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={()=>toggleAll(true)}>Turn On All</button>
        <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={()=>toggleAll(false)}>Turn Off All</button>
      </div>

      {showAddForm && newDeviceType !== 'All' && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>New Actuator Info</h3>
          <label>
            Location:{' '}
            <input
              id = "newLocation"
              type="text"
              value={newDeviceData.location}
              onChange={(e) => setNewDeviceData({ ...newDeviceData, location: e.target.value })}
            />
          </label>
          {/* <label style={{ marginLeft: '10px' }}>
            Update Frequency (s):{' '}
            <input
              type="text"
              value={newDeviceData.frequency}
              onChange={(e) => setNewDeviceData({ ...newDeviceData, frequency: e.target.value })}
            />
          </label> */}
          <button style={{ ...switchBtnStyle, marginLeft: '10px' }} onClick={handleAddDeviceSubmit}>
            Submit
          </button>
        </div>
        
      )}
      <div style={{ marginTop: '10px', marginBottom: '20px', fontStyle: 'italic', color: '#555' }}>
            {newDeviceType === 'All'
              ? 'Please select a specific device type to add a new device.'
              : ''}
      </div>
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
            <th style={thStyle}>Last Status Update</th>
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
              <td style={tdStyle}>{device.lastStatusUpdate}</td>
              <td style={{
                ...tdStyle,
                fontWeight: 'bold',
                color: device.status ? 'green' : 'red'
              }}>
                {device.status ? 'on' : 'off'}
              </td>
              <td style={tdStyle}>
                <button style={switchBtnStyle} onClick={() => toggleDevice(device.id, device.status)}>Switch</button>
                <button style={deleteBtnStyle} onClick={() => deleteActuatorDevice(device.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
