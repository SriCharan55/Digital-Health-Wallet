import { useState } from "react";
import api from "../services/api";

export default function AddVital({ onAdded }) {
  const [vitalType, setVitalType] = useState(""); // 👈 default empty
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const handleVitalTypeChange = (e) => {
    setVitalType(e.target.value);

    // reset fields when type changes
    setSystolic("");
    setDiastolic("");
    setValue("");
    setDate("");
  };

  const handleSubmit = async () => {
    if (!vitalType) {
      alert("Please select vital type");
      return;
    }

    if (!date) {
      alert("Date is required");
      return;
    }

    if (vitalType === "BP" && (!systolic || !diastolic)) {
      alert("Please enter systolic and diastolic values");
      return;
    }

    if (vitalType !== "BP" && !value) {
      alert("Please enter value");
      return;
    }

    const payload =
      vitalType === "BP"
        ? {
          vital_type: "BP",
          value: `${systolic}/${diastolic}`,
          date,
        }
        : {
          vital_type: vitalType,
          value,
          date,
        };


    try {
      await api.post("/vitals", payload);

      if (onAdded) onAdded();

      // ✅ reset everything (IMPORTANT)
      setVitalType("");     // 👈 reset dropdown
      setSystolic("");
      setDiastolic("");
      setValue("");
      setDate("");
    } catch {
      alert("Failed to add vital");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Vital</h2>

      <div className="flex gap-3 flex-wrap items-center">
        <select
          className="border p-2 rounded"
          value={vitalType}
          onChange={handleVitalTypeChange}
        >
          <option value="" disabled>
            Select Vital Type
          </option>
          <option value="BP">Blood Pressure</option>
          <option value="Sugar">Sugar</option>
          <option value="HR">Heart Rate</option>
        </select>

        {vitalType === "BP" ? (
          <>
            <input
              type="number"
              placeholder="Systolic"
              className="border p-2 rounded"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
            />
            <input
              type="number"
              placeholder="Diastolic"
              className="border p-2 rounded"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
            />
          </>
        ) : vitalType ? (
          <input
            type="number"
            placeholder="Value"
            className="border p-2 rounded"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : null}

        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}
