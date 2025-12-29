import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyReports({ refreshKey }) {
  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [refreshKey]);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");
      setReports(res.data.reports);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  /* =========================
     Download Report
  ========================= */
  const downloadReport = async (id, filename) => {
    try {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed");
    }
  };


  /* =========================
     WhatsApp Share
  ========================= */
  const shareOnWhatsApp = (report) => {
    const url = `http://localhost:5000/uploads/${report.filename}`;
    const message = `Medical Report (${report.report_type}) - ${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">My Reports</h2>

      {reports.length === 0 ? (
        <p>No reports uploaded</p>
      ) : (
        reports.map((r) => (
          <div
            key={r.id}
            className="border p-3 mb-3 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{r.report_type}</p>
              <p className="text-sm text-gray-500">{r.report_date}</p>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              <button
                onClick={() => downloadReport(r.id, r.filename)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Download
              </button>

              <button
                onClick={() => setSelectedReport(r)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                View
              </button>

              <button
                onClick={() => shareOnWhatsApp(r)}
                className="bg-green-700 text-white px-3 py-1 rounded"
              >
                WhatsApp
              </button>





            </div>
          </div>
        ))
      )}

      {/* =========================
         Inline View Section
      ========================= */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedReport(null)} // click outside closes
        >
          <div
            className="
    bg-white
    rounded-md
    shadow-xl
    max-w-4xl
    w-full
    mx-auto
    max-h-[85vh]
    overflow-auto
    p-4
  "
            onClick={(e) => e.stopPropagation()} // prevent close on inside click
          >
            <h3 className="text-lg font-semibold mb-4 text-center">
              View Report
            </h3>

            <div className="flex justify-center">
              {selectedReport.filename.endsWith(".pdf") ? (
                <iframe
                  src={`http://localhost:5000/uploads/${selectedReport.filename}`}
                  className="w-full max-w-4xl h-[75vh] border mx-auto"
                  title="Report Viewer"
                />
              ) : (
                <img
                  src={`http://localhost:5000/uploads/${selectedReport.filename}`}
                  className="w-full max-w-4xl mx-auto object-contain"
                  alt="Report"
                />
              )}
            </div>



            <div className="flex justify-center mt-4">
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
