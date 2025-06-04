// src/pages/Dashboard.jsx
import RealtimeChart from '../components/RealtimeChart';

export default function Dashboard() {
  return (
    <div>
      <h1
  style={{
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    backgroundColor: '#4A7755', // 深绿色背景
    color: 'white',              // 字体白色更清晰
    padding: '10px 24px'
  }}
>
  Real-time Sensor Data
</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginLeft: '22px' }}>
        <RealtimeChart sensorType="Temperature" />
        <RealtimeChart sensorType="Soil_Moisture" />
        <RealtimeChart sensorType="Light_Intensity" />
        <RealtimeChart sensorType="CO2_Concentration" />
      </div>
    </div>
  );
}