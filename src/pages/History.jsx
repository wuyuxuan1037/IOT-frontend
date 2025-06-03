import { useEffect, useState } from 'react';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchHistoryData = async () => {
    try {
      console.log('开始获取数据...');
      const response = await fetch('http://127.0.0.1:8084/DBreader/getAllHistoryData');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('收到的原始数据:', result);

      if (result.status === 'error') {
        throw new Error(result.message);
      }

      let processedData = [];

      if (Array.isArray(result)) {
        processedData = result.map(d => ({
          DeviceID: d.deviceID,
          Location: d.deviceLocation,
          DeviceType: d.deviceType,
          Value: d.value,
          Unit: d.unit,
          Time: d.timestamp
        }));
      } else if (result.data && typeof result.data === 'object') {
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

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
        <p>No data available.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={thStyle}>DeviceID</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>DeviceType</th>
                <th style={thStyle}>Value/Status</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((entry, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{entry.DeviceID}</td>
                  <td style={tdStyle}>{entry.Location}</td>
                  <td style={tdStyle}>{entry.DeviceType}</td>
                  <td style={tdStyle}>
                    {typeof entry.Value === 'boolean' ? (entry.Value ? 'On' : 'Off') : entry.Value}
                  </td>
                  <td style={tdStyle}>
                    {typeof entry.Value === 'boolean' ? '' : entry.Unit}
                  </td>
                  <td style={tdStyle}>
                    {new Date(entry.Time * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
            <button style={pagebutton} onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}  / Total {totalPages} </span>
            <button style={pagebutton}onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const pagebutton = {
  backgroundColor: '#d4edda', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' 
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
