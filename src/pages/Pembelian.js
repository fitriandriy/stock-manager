import React, { useState, useEffect } from 'react';
import { getPurchases, addCikIraPurchases, deletePurchaseData } from '../api';
import NavBar from "../components/NavBar";
import "react-datepicker/dist/react-datepicker.css";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const Pembelian = () => {
  const now = new Date();
  const defaultMonth = now.getMonth() + 1;
  const defaultYear = now.getFullYear();
  const defaultMonthString = now.toISOString().slice(0, 7);

  const [date, setDate] = useState('');
  const [materialType, setMaterialType] = useState(3);
  const [amount, setAmount] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [openAddStock, setOpenAddStock] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonthString);
  const [month, setMonth] = useState(defaultMonth);
  const [startDate, setStartDate] = useState(now);
  const [reports, setReports] = useState([]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(defaultYear, i, 1);
    return date.toISOString().slice(0, 7);
  });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: null, y: null, rowIndex: null });
  const [activeRow, setActiveRow] = useState(null);
  const [dataId, setDataId] = React.useState()

  const handleClose = () => {
    setOpenAddStock(false);
    setOpenSuccess(false);
    setOpenDelete(false)
    setDeleteSuccess(false)
    setAmount('');
    setDate('');
  };

  const handleAddStock = async () => {
    const parsedAmount = Number(amount);

    if (!date || !parsedAmount || isNaN(parsedAmount)) {
      alert("Semua field harus diisi dengan benar!");
      return;
    }

    try {
      const response = await addCikIraPurchases(date, 1, Number(materialType), parsedAmount);
      if (response.data.status === true) {
        const [year, month] = selectedMonth.split("-").map(Number);
        const newData = await getPurchases(month, year);
        setReports(newData.data.data.data);
        setTotalPurchase(newData.data.data.total)
        handleClose();
        setOpenSuccess(true);
      } else {
        alert("Gagal menambahkan data: " + response.data.message);
      }
    } catch (error) {
      console.error("Error detail:", error);
      alert("Terjadi kesalahan saat menambahkan stok: " + (error.message || "Unknown error"));
    }
  };

  const handleClickOutside = () => {
    setContextMenu({ visible: false, x: 0, y: 0, rowIndex: null });
    setActiveRow(null)
  };

  const handleRightClick = (event, index, id) => {
    event.preventDefault();
    setActiveRow(index)
    setDataId(id)
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      rowIndex: index,
    });
  };

  const handleOpenDeleteStock = () => {
    setOpenDelete(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePurchaseData(id)
      const [year, month] = selectedMonth.split("-").map(Number);
      if(response.data.status === true) {
        const newData = await getPurchases(month, year)
        setReports(newData.data.data.data)
        setTotalPurchase(newData.data.data.total)
        handleClose();
        setDeleteSuccess(true);
      }
    } catch (error) {
      alert("Error:", error);
    }
    handleClickOutside();
  };


  useEffect(() => {
    const fetchData = async () => {
      const [year, month] = selectedMonth.split("-").map(Number);
      try {
        const response = await getPurchases(month, year);
        setReports(response.data.data.data);
        setTotalPurchase(response.data.data.total)
      } catch (err) {
        alert(err.message);
      }
    };
    fetchData();
  }, [selectedMonth]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    const [year, month] = value.split("-").map(Number);
    setMonth(month);
    setStartDate(new Date(year, month - 1, 1));
  };

  return (
    <div onClick={handleClickOutside} className='text-[#585858]'>
      {/* Modal Tambah Stok */}
      <Modal open={openAddStock} onClose={handleClose}>
        <Box className="text-center border rounded-xl p-5 w-[400px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>TAMBAH STOK MASUK</h2>
          <div>
            <div className='flex justify-between my-2'>
              <label>Tanggal:</label>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='border w-[250px] p-[3px] rounded-md'
              />
            </div>
            <div className='flex justify-between my-2'>
              <label>Jenis Beras:</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className='border p-[4px] w-[250px] rounded-md'
              >
                <option value={3}>BERAS PS HIJAU @ 25 KG</option>
                <option value={4}>BERAS PS HIJAU @ 10 KG</option>
                <option value={5}>BERAS PS HIJAU @ 5 KG</option>
                <option value={6}>BERAS PS MERAH @ 25 KG</option>
                <option value={7}>BERAS PS MERAH @ 10 KG</option>
                <option value={8}>BERAS PS MERAH @ 5 KG</option>
                <option value={26}>BERAS PS KUNING @ 25 KG</option>
                <option value={27}>BERAS PS KUNING @ 10 KG</option>
                <option value={28}>BERAS PS KUNING @ 5 KG</option>
              </select>
            </div>
            <div className='flex justify-between my-2'>
              <label>Jumlah:</label>
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='border w-[250px] p-[3px] rounded-md'
                min={1}
              />
            </div>
          </div>
          <button
            className='bg-blue-1 text-[white] px-7 py-2 mt-5 rounded-xl font-semibold'
            onClick={() => handleAddStock()}
          >
            TAMBAH
          </button>
        </Box>
      </Modal>

      {/* Modal Success Add Data */}
      <Modal open={openSuccess} onClose={handleClose}>
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt='' />
          <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DITAMBAH</p>
        </Box>
      </Modal>

      {/* delete success */}
      <Modal open={deleteSuccess} onClose={handleClose}>
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt='' />
          <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DIHAPUS</p>
        </Box>
      </Modal>

      {/* DELETE STOK */}
      <Modal
        open={openDelete}
        onClose={handleClose}
      >
        <Box className="text-center border rounded-lg p-5 w-[300px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center'>HAPUS DATA?</h2>
          <div className='flex gap-1'>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={() => handleDelete(dataId)}
            >HAPUS</button>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleClose}
            >BATAL</button>
          </div>
        </Box>
      </Modal>

      <NavBar />

      <div className='flex items-center justify-between gap-5 px-5 mx-44 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <p className='font-semibold'>DATA PEMBELIAN PRODUK</p>
      </div>

      <div className='flex justify-between items-center mx-44 mt-5'>
        <div>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedMonth}
            onChange={handleChange}
          >
            <option value="">-- Pilih Bulan --</option>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <button
          className='bg-blue-1 rounded-xl py-2 px-4 text-[white]'
          onClick={() => setOpenAddStock(true)}
        >
          TAMBAH DATA
        </button>
      </div>

      <div className='mx-44 mt-2'>
        <p>Total pembelian saat ini: {Number(totalPurchase).toLocaleString('id-ID')} kg</p>
      </div>

      <div className='overflow-x-auto mt-2 h-90 border border-1 rounded-xl mx-44 text-[14px]'>
        <table className='table-auto overflow-auto border-collapse'>
          <thead className='sticky top-0 bg-blue-1 text-[white] font-semibold'>
            <tr>
              <td>NO</td>
              <td>TANGGAL</td>
              <td>SUPPLIER</td>
              <td>PRODUK</td>
              <td>NOMINAL</td>
            </tr>
          </thead>
          <tbody>
            {reports.map((row, idx) => (
              <tr key={row.id} onContextMenu={(event) => handleRightClick(event, idx, row.id)}>
                <td>{idx + 1}</td>
                <td>{row.date}</td>
                <td>{row.supplier.toUpperCase()}</td>
                <td>{row.product}</td>
                <td>{row.nominal}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 9 - reports.length) }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                <td className="border">&nbsp;</td>
                <td className="border">&nbsp;</td>
                <td className="border">&nbsp;</td>
                <td className="border">&nbsp;</td>
                <td className="border">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && (
        <div
          className="absolute bg-[#d2c1ff] shadow-md border border-[#9789ff] p-2 rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <p
            className="cursor-pointer hover:bg-gray-100 px-2 text-[black]"
            onClick={handleOpenDeleteStock}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default Pembelian;
