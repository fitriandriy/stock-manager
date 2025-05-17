import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { addFullskill, getFullskillByMonth } from '../api';
import NavBar from "../components/NavBar";
import { jwtDecode } from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";

const Fullskill = () => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [reports, setReports] = useState([])
  const [f1, setF1] = useState()
  const [f2, setF2] = useState()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openHandle, setOpenHandle] = useState(false)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };
  const token = localStorage.getItem("token")
  let editorId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      editorId = decoded.id;
    } catch (error) {
      console.error("Invalid token:", error.message);
    }
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), i, 1);
    return date.toISOString().slice(0, 7);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFullskillByMonth(selectedMonth)
        setReports(response.data || [])
      } catch (err) {
        alert("Gagal ambil data: " + err.message)
      }
    }

    if (selectedMonth) {
      fetchData();
    }
  }, [selectedMonth])

  const handleOpen = () => {
    setOpenHandle(true);
  };

  const handleClose = () => {
    setOpenHandle(false);
    setOpenSuccess(false)
  };

  const addData = async () => {
    if (!f1 || !f2 || !date) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await addFullskill(date, f1, f2, editorId);

      if(response.data.status === true) {
        const response = await getFullskillByMonth(selectedMonth)
        setReports(response.data || [])
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  return (
    <div className='text-[#585858]'>
      <NavBar />
      <div className='flex items-center justify-between gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <p>DATA FULLSKILL GUDANG 6</p>
        <div className="flex items-center gap-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Pilih Bulan:
          </label>
          <select
            className="p-2 border rounded-md"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Pilih Bulan --</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Modal
        open={openSuccess}
        onClose={handleClose}
      >
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt=''></img>
          <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DITAMBAH</p>
        </Box>
      </Modal>

      <Modal
        open={openHandle}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box className="text-center border rounded-lg p-5 w-[500px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>TAMBAH DATA FULLSKILL</h2>
          <div className='flex gap-4'>
            <div className='text-left w-[50%]'>
              <label>Tanggal:</label>
              <input
                className='border w-full rounded-md'
                type='date'
                value={date}
                onChange={(e) => {
                  const value = e.target.value
                  setDate(value)
                }}
              ></input>
            </div>
            <div className='text-left w-[50%]'>
              <label>Fullskill 1:</label>
              <input
                className='border w-full rounded-md'
                onChange={(e) => {
                  const value = e.target.value
                  setF1(value)
                }}
              ></input>
            </div>
            <div className='text-left w-[50%]'>
              <label>Fullskill 2:</label>
              <input
                className='border w-full rounded-md'
                onChange={(e) => {
                  const value = e.target.value
                  setF2(value)
                }}
              ></input>
            </div>
          </div>
          <button
            className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
            onClick={addData}
          >TAMBAH</button>
        </Box>
      </Modal>
      <div>
        <button
          className='bg-blue-1 text-[#ffff] my-5 mx-20 px-4 py-1 rounded-2xl font-semibold'
          onClick={handleOpen}
        >
          + DATA FULLSKILL
        </button>
      </div>

      <div className="overflow-x-auto mx-20 h-[400px] border border-1 rounded-xl">
        <table className="text-[14px] table-auto overflow-auto border-collapse border border-gray-800 text-center w-full">
          <thead className="sticky top-0 bg-blue-1">
            <tr className="bg-blue-600 text-[white]">
              <th className="border border-white px-2 py-2">TANGGAL</th>
              <th className="border border-white px-2 py-2">BAHAN GILING (KG)</th>
              <th className="border border-white px-2 py-2">FULLSKILL-1 (KG)</th>
              <th className="border border-white px-2 py-2">HASIL GILING</th>
              <th className="border border-white px-2 py-2">FULLSKILL-2 (KG)</th>
            </tr>
          </thead>
          <tbody className='text-[#000000] border-[white]'>
            {reports && reports.length > 0 ? (
              reports.map((row, idx) => (
                <tr key={row.tanggal + idx}>
                  <td className="border border-gray-800 px-2 py-1">{row.tanggal}</td>
                  <td className="border border-gray-800 px-2 py-1">{row.bahan_giling * 50} KG</td>
                  <td className="border border-gray-800 px-2 py-1">{row.f1}</td>
                  <td className="border border-gray-800 px-2 py-1">{row.hasil_giling}</td>
                  <td className="border border-gray-800 px-2 py-1">{row.f2}</td>
                </tr>
              ))
            ) : ""}

            {
              Array.from({ length: Math.max(0, 12 - reports.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Fullskill
