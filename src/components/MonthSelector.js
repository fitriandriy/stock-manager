import React, { useState } from "react";
import axios from "axios";
import { getFullskillByMonth } from '../api';

const MonthSelector = ({ warehouseId, onDataFetched }) => {
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = Array.from({ length: 12 }, (_, i) => {
    const now = new Date();
    const date = new Date(now.getFullYear(), i, 1);
    return date.toISOString().slice(0,7)
  });

  const handleChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    try {
      const res = await getFullskillByMonth(month)
      onDataFetched(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Pilih Bulan:
      </label>
      <select
        className="w-full p-2 border rounded-md"
        value={selectedMonth}
        onChange={handleChange}
      >
        <option value="">-- Pilih Bulan --</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
