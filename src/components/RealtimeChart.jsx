import { useEffect, useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';

const WS_URL = 'ws://localhost:8000/ws/sensor'; // WebSocket 接口
const THRESHOLD_API = 'http://localhost:8000/api/thresholds'; // REST API 获取阈值

const LABELS = {
  Temperature: 'Temperature (°C)',
  Moisture: 'Moisture (%)',
  Lightness: 'Lightness (lx)',
  Co2: 'CO2 Concentration (ppm)',
};

export default function RealtimeChart({ sensorType }) {
  const [data, setData] = useState([]);
  const [threshold, setThreshold] = useState(null);
  const ws = useRef(null);

  // 从后端获取当前 sensorType 的阈值
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const res = await fetch(THRESHOLD_API);
        const json = await res.json();
        const value = json[sensorType.toLowerCase()];
        if (value !== undefined) {
          setThreshold(value);
        }
      } catch (err) {
        console.error('Failed to fetch threshold:', err);
      }
    };

    fetchThreshold();
  }, [sensorType]);

  // 建立 WebSocket 连接并接收实时数据
  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const sensorBatch = JSON.parse(event.data);
        const values = sensorBatch[sensorType];
        if (Array.isArray(values) && values.length > 0) {
          const avg =
            values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
          const time = new Date().toLocaleTimeString();
          const newEntry = { time, [sensorType]: parseFloat(avg.toFixed(2)) };
          setData(prev => [...prev.slice(-47), newEntry]); // 最多保留48个点
        }
      } catch (error) {
        console.error('Invalid sensor data:', error);
      }
    };

    return () => ws.current.close();
  }, [sensorType]);

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>{LABELS[sensorType]}</h2>
      <LineChart width={450} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={sensorType}
          stroke="black"
          dot={false}
          isAnimationActive={false}
        />
        {threshold !== null && (
          <ReferenceLine
            y={threshold}
            stroke="red"
            label="Threshold"
            strokeDasharray="3 3"
          />
        )}
      </LineChart>
    </div>
  );
}
