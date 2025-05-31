import { useEffect, useState } from 'react';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistoryData = async () => {
    try {
      console.log('开始获取数据...');
      
      const response = await fetch('http://127.0.0.1:5002/getHistoryData');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('收到的原始数据:', result);
      
      // 检查是否是错误响应
      if (result.status === 'error') {
        throw new Error(result.message);
      }
      
      // 处理不同的数据格式
      let processedData = [];
      
      if (Array.isArray(result)) {
        // 如果直接返回数组
        processedData = result.map(d => ({
          DeviceID: d.deviceID,
          Location: d.deviceLocation,
          DeviceType: d.deviceType,
          Value: d.value,
          Unit: d.unit,
          Time: d.timestamp
        }));
      } else if (result.data && typeof result.data === 'object') {
        // 如果返回的是 {status: "success", data: {...}}
        processedData = Object.entries(result.data).map(([deviceId, deviceData]) => {
          if (deviceData) {
            return {
              DeviceID: deviceData.deviceID || deviceId,
              Location: deviceData.deviceLocation,
              DeviceType: deviceData.deviceType,
              Value: deviceData.value,
              Unit: deviceData.unit,
              Time: deviceData.timestamp
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      console.log('处理后的数据:', processedData);
      setData(processedData);
      setError(null);
      
    } catch (err) {
      console.error("获取数据失败:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          backgroundColor: '#4A7755',
          color: 'white',
          padding: '10px 24px',
          width: '100%',
        }}
      >
        History
      </h1>

      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px', 
          border: '1px solid red', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          error: {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <p>Loading</p>
      )}

      {!loading && !error && data.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>DeviceID</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>DeviceType</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{entry.DeviceID}</td>
                <td style={tdStyle}>{entry.Location}</td>
                <td style={tdStyle}>{entry.DeviceType}</td>
                <td style={tdStyle}>{entry.Value}</td>
                <td style={tdStyle}>{entry.Unit}</td>
                <td style={tdStyle}>{entry.Time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: '8px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #ccc',
};

const tdStyle = {
  padding: '8px',
};