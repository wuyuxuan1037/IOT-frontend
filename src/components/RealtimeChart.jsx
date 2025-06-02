import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import dayjs from 'dayjs';

const THRESHOLD_API = 'http://127.0.0.1:8082/controller/getControllerThreshold';
const AVERAGE_API = 'http://127.0.0.1:8082/controller/getControllerAverageValue';

const LABELS = {
  Temperature: 'Temperature (Cel)',
  Soil_Moisture: 'Moisture (%)',
  Lightness: 'Lightness (lx)',
  CO2_Concentration: 'CO2_Concentration (ppm)',
};

export default function RealtimeChart({ sensorType }) {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState({ min: 0, max: 100 }); // 设置默认阈值
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchThreshold = async () => {
    try {
      const res = await fetch(THRESHOLD_API);
      if (!res.ok) throw new Error('Failed to fetch threshold');
      const json = await res.json();
      const match = json.find(item => item.deviceType === sensorType);
      
      if (match) {
        setThreshold({ 
          min: Number(match.thresholdMin), 
          max: Number(match.thresholdMax) 
        });
      }
    } catch (err) {
      console.error('Failed to fetch threshold:', err);
      // 保持默认阈值
    }
  };

  const fetchAverageValue = async () => {
    try {
      const res = await fetch(AVERAGE_API);
      if (!res.ok) throw new Error('Failed to fetch average values');
      const json = await res.json();
      
      // 更安全的数据转换
      const mapped = json.map(d => ({
        time: new Date(d.time).getTime(), // 确保时间是数字
        [sensorType]: Number(d[sensorType]) || 0 // 确保有数值
      }));
      
      setData(mapped);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch average values:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAverageValue();
    fetchThreshold();

    const intervalId = setInterval(() => {
      fetchAverageValue();
      fetchThreshold();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sensorType]);

  // 更详细的加载和错误状态
  if (loading) return (
    <div style={{ 
      width: '500px', 
      height: '400px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      Loading chart data...
    </div>
  );

  if (error) return (
    <div style={{ 
      width: '500px', 
      height: '400px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#fff5f5',
      color: '#ff4d4f'
    }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ 
      width: '500px', 
      height: '400px',
      backgroundColor: 'white',
      padding: '10px',
      border: '1px transparent #f0f0f0', // 添加边框便于调试
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '8px', fontSize: '24px' }}>{LABELS[sensorType]}</h2>
      <div style={{ color: 'gray', marginBottom: '10px', fontSize: '16px' }}>
        Threshold: {threshold.min} - {threshold.max} | Data points: {data.length}
      </div>
      
      {/* 添加边界检查 */}
      {data.length > 0 ? (
        <LineChart 
          width={480}
          height={320}
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
          <XAxis 
            dataKey="time"
            type="number"
            domain={['dataMin', (dataMax) => dataMax + 15 * 60 * 1000]}
            tickFormatter={(tick) => dayjs(tick).format('HH:mm')}
            scale="time"
            tick={{ fontSize: 12, fill: '#666' }} 
          />
          <YAxis 
            domain={[
              (dataMin) => Math.min(dataMin, threshold ? threshold.min - 10 : dataMin),
              (dataMax) => Math.max(dataMax, threshold ? threshold.max + 10 : dataMax)
            ]}
            tick={{ fontSize: 14, fill: '#666' }}
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <Tooltip 
            labelFormatter={(label) => dayjs(label).format('HH:mm:ss')}
          />
          <Line
            type="monotone"
            dataKey={sensorType}
            stroke="#007acc"
            strokeWidth={1.2}
            dot={{ r: 3, stroke: 'transparent', fill: 'transparent' }}
            activeDot={{ r: 5, stroke: '#007acc', strokeWidth: 1, fill: '#007acc' }}
            isAnimationActive={false}
          />
          <ReferenceLine
            y={threshold.max}
            stroke="#FF4D4F"            
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{
              // value: `Max ${threshold.max}`,
              position: 'insideTopLeft',
              fill: '#FF4D4F',
              fontWeight: 'bold',
              fontSize: 12,
              backgroundColor: 'rgba(255, 77, 79, 0.15)',
              padding: '2px 6px',
              borderRadius: 4,
  }}
          />
          <ReferenceLine
            y={threshold.min}
            stroke="#FF4D4F"            
            strokeWidth={2}             
            strokeDasharray="5 5"       
            label={{
              // value: `Min ${threshold.min}`,
              position: 'insideBottomLeft',
              fill: '#FF4D4F',
              fontWeight: 'bold',
              fontSize: 12,
              backgroundColor: 'rgba(255, 77, 79, 0.15)', 
              padding: '2px 6px',
              borderRadius: 4,
            }}
          />
        </LineChart>
      ) : (
        <div style={{ 
          height: '320px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: '#999'
        }}>
          No data to display
        </div>
      )}
    </div>
  );
}