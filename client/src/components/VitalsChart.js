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
      try {
        const res = await api.get(`/vitals?vital_type=${vitalType}`);

        // ✅ backend may return array OR object
        const vitals = res.data.vitals || res.data || [];

        const formatted = vitals.map((v) => {
          if (vitalType === "BP") {
            const [systolic, diastolic] = (v.value || "").split("/");
            return {
              date: v.date,
              systolic: Number(systolic),
              diastolic: Number(diastolic),
            };
          }

          return {
            date: v.date,
            value: Number(v.value),
          };
        });

        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch vitals", err);
        setData([]);
      }
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
            <BarChart
              data={data}
              barGap={4}
              barCategoryGap={40}
              maxBarSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 150]} />
              <Tooltip />
              <Bar
                dataKey="systolic"
                fill="#ef4444"
                barSize={18}
                name="Systolic"
              />
              <Bar
                dataKey="diastolic"
                fill="#3b82f6"
                barSize={18}
                name="Diastolic"
              />
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
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
