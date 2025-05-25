import { useEffect, useState } from 'react';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 替换成你自己的 API 地址
  const API_URL = 'https://api.thingspeak.com/channels/123456/feeds.json?days=1';

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        // 假设我们后端返回的是我们需要的平均值数组
        setData(json);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Temperature (°C)</th>
              <th style={thStyle}>Moisture (%)</th>
              <th style={thStyle}>Lightness (lx)</th>
              <th style={thStyle}>CO₂ (ppm)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tdStyle}>{new Date(entry.timestamp).toLocaleString()}</td>
                <td style={tdStyle}>{entry.temperature}</td>
                <td style={tdStyle}>{entry.moisture}</td>
                <td style={tdStyle}>{entry.lightness}</td>
                <td style={tdStyle}>{entry.co2}</td>
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
