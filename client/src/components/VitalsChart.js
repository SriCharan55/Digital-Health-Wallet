import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";

export default function VitalsChart({ vitalType, title, refreshKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchVitals = async () => {
    const res = await api.get(`/vitals?vital_type=${vitalType}`);

    const formatted = res.data.vitals.map(v => ({
      date: v.date,
      systolic: v.systolic,
      diastolic: v.diastolic,
      value: v.value,
    }));

    setData(formatted);
  };

  fetchVitals();
}, [refreshKey, vitalType]);

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-2">{title}</h2>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {/* BP → Bar Chart */}
          {vitalType === "BP" && (
            <BarChart data={data} barGap={8} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 150]} />
              <Tooltip />
              <Bar dataKey="systolic" fill="#ef4444" barSize={30} name="Systolic" />
              <Bar dataKey="diastolic" fill="#3b82f6" barSize={30} name="Diastolic" />
            </BarChart>
          )}

          {/* Sugar → Line Chart */}
          {vitalType === "Sugar" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[50, 300]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Sugar Level"
              />
            </LineChart>
          )}

          {/* Heart Rate → Area Chart */}
          {vitalType === "HR" && (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[40, 200]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                fill="#fed7aa"
                name="Heart Rate"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
