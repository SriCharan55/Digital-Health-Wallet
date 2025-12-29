import { useState } from "react";
import api from "../services/api";

function UploadReport({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState("");
  const [associatedVital, setAssociatedVital] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !reportType || !associatedVital || !reportDate) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);
    formData.append("report_type", reportType);
    formData.append("associated_vital", associatedVital);
    formData.append("report_date", reportDate);

    try {
      await api.post("/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (onUploaded) onUploaded();

      alert("Report uploaded successfully");

      setFile(null);
      setReportType("");
      setAssociatedVital("");
      setReportDate("");
      setFileInputKey(Date.now());
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">
          Upload Medical Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* File */}
          <input
            key={fileInputKey}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          {/* Report Type */}
          <select
            className="w-full border p-2 rounded"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            required
          >
            <option value="">Select Report Type</option>
            <option value="Blood Test">Blood Test</option>
            <option value="X-Ray">X-Ray</option>
            <option value="MRI">MRI</option>
            <option value="CT Scan">CT Scan</option>
            <option value="ECG">ECG</option>
          </select>

          {/* Associated Vital */}
          <select
            className="w-full border p-2 rounded"
            value={associatedVital}
            onChange={(e) => setAssociatedVital(e.target.value)}
            required
          >
            <option value="">Select Associated Vital</option>
            <option value="BP">Blood Pressure</option>
            <option value="Sugar">Sugar</option>
            <option value="HR">Heart Rate</option>
          </select>

          {/* Date */}
          <input
            type="date"
            className="w-full border p-2"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </form>
      </div>
    );
  }

  export default UploadReport;
