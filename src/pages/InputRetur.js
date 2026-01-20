/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { addSalesRetur } from "../api";
import EditableTable from "../components/EditableTable";
import DatePicker from "react-datepicker";
import NavBar from "../components/NavBar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useReactToPrint } from "react-to-print";
import PrintRetur from "../components/PrintRetur";
import "react-datepicker/dist/react-datepicker.css";

const InputRetur = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openSuccess, setOpenSuccess] = useState(false);
  const [printData, setPrintData] = useState([]);

  const printRef = useRef(null);

  const columns = [
    { key: "NO", width: "40px" },
    { key: "NAMA TOKO", width: "150px" },
    { key: "PS25", width: "40px" },
    { key: "PS10", width: "40px" },
    { key: "PS5", width: "40px" },
    { key: "P10", width: "40px" },
    { key: "P5", width: "40px" },
    { key: "PK25", width: "40px" },
    { key: "PK10", width: "40px" },
    { key: "PK5", width: "40px" },
    { key: "TP (DUS)", width: "60px" },
    { key: "TP (BKS)", width: "60px" },
    { key: "EKO", width: "40px" },
    { key: "BP", width: "40px" },
    { key: "MKP", width: "40px" },
    { key: "SOPIR", width: "80px" },
    { key: "KETERANGAN", width: "160px" },
  ];

  const createEmptyRow = (index) => {
    const row = {};
    columns.forEach((col) => {
      row[col.key] = col.key === "NO" ? index + 1 : "";
    });
    return row;
  };

  const [retur, setRetur] = useState(
    Array.from({ length: 15 }, (_, i) => createEmptyRow(i))
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };

  const productMap = {
    PS25: 3,
    PS10: 4,
    PS5: 5,
    P10: 7,
    P5: 8,
    PK25: 26,
    PK10: 27,
    PK5: 28,
    "TP (DUS)": 20,
    "TP (BKS)": 32,
    EKO: 14,
    BP: 11,
    MKP: 12,
  };

  const handleSubmit = async () => {
    const payload = retur
      .filter(
        (row) =>
          row["NAMA TOKO"]?.trim() &&
          row["SOPIR"]?.trim()
      )
      .map((row) => {
        const items = Object.entries(productMap)
          .map(([key, product_id]) => ({
            product_id,
            amount: Number(row[key]) || 0,
          }))
          .filter((item) => item.amount > 0);

        return {
          date: startDate.toISOString().slice(0, 10),
          toko: row["NAMA TOKO"],
          sopir_in: row["SOPIR"],
          description: row["KETERANGAN"] || "",
          status: false,
          items,
        };
      })
      .filter((row) => row.items.length > 0);

    if (payload.length === 0) {
      alert("Tidak ada data retur valid");
      return;
    }

    try {
      await addSalesRetur(payload);
      setPrintData(payload); // 🔑 PENTING
      setOpenSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data retur");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Retur Barang",
  });

  useEffect(() => {
    setRetur(Array.from({ length: 15 }, (_, i) => createEmptyRow(i)));
  }, [startDate]);

  return (
    <div className="text-[#585858]">
      <NavBar />

      <div className="flex justify-between mx-10 mb-5 pt-5">
        <div className="flex gap-2 py-1 px-10 rounded-2xl bg-blue-1">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="bg-blue-1 text-white font-semibold"
            dateFormat="d-MM-yyyy"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-8 py-1 rounded-2xl bg-blue-1 text-[white] font-semibold"
          >
            SIMPAN
          </button>

          <button
            onClick={handlePrint}
            disabled={printData.length === 0}
            className="px-6 py-1 rounded-2xl bg-blue-1 text-[white] font-semibold disabled:opacity-50"
          >
            PRINT RETUR
          </button>
        </div>
      </div>

      <EditableTable
        data={retur}
        onDataChange={setRetur}
        columns={columns}
      />

      <Modal open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt='' />
          <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DITAMBAH</p>
        </Box>
      </Modal>

      {/* AREA PRINT */}
      <div className="print-area">
        <PrintRetur ref={printRef} data={printData} />
      </div>
    </div>
  );
};

export default InputRetur;
