import { useState } from "react";
import Navbar from "./Navbar";
import UploadReport from "./UploadReport";
import MyReports from "./MyReports";
import AddVital from "./AddVital";
import VitalsChart from "./VitalsChart";


export default function Dashboard() {
  const [vitalRefreshKey, setVitalRefreshKey] = useState(0);
  const [reportRefreshKey, setReportRefreshKey] = useState(0);

  const handleVitalAdded = () => {
    setVitalRefreshKey(prev => prev + 1);
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="p-6 space-y-6">
        {/* Reports */}
        <UploadReport
          onUploaded={() => setReportRefreshKey(prev => prev + 1)}
        />
        <MyReports refreshKey={reportRefreshKey} />

        {/* Add Vitals */}
        <AddVital onAdded={handleVitalAdded} />

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Vitals Overview
        </h2>


        {/* Charts */}
        <VitalsChart
          vitalType="BP"
          title="Blood Pressure Trend"
          refreshKey={vitalRefreshKey}
        />

        <VitalsChart
          vitalType="Sugar"
          title="Sugar Level Trend"
          refreshKey={vitalRefreshKey}
        />

        <VitalsChart
          vitalType="HR"
          title="Heart Rate Trend"
          refreshKey={vitalRefreshKey}
        />
      </div>
    </div>
  );
}
