import { useEffect, useState } from "react";
import api from "../services/api";

export default function SharedReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchSharedReports();
  }, []);

  const fetchSharedReports = async () => {
    try {
      const res = await api.get("/shared-reports");
      setReports(res.data.reports);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Reports Shared With You
      </h2>

      {reports.length === 0 ? (
        <p>No shared reports</p>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="border p-3 mb-2 rounded">
            <p className="font-medium">{r.report_type}</p>
            <p className="text-sm text-gray-500">{r.report_date}</p>
          </div>
        ))
      )}
    </div>
  );
}
