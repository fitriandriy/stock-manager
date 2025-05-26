/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import React, { useState, useEffect } from 'react'
import NavBar from "../components/NavBar"
import DatePicker from "react-datepicker";
import { useApp } from '../context'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { create, getData, getSuppliers, getCustomers, moveStock, deleteStock } from '../api'
import { jwtDecode } from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [startDate, setStartDate] = useState(new Date());
  const date = startDate.toLocaleDateString('en-CA')
  const [openAddStock, setOpenAddStock] = React.useState(false);
  const [openReduceStock, setOpenReduceStock] = React.useState(false);
  const [openTransfer, setOpenTransferStock] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const { currentWarehouse } = useApp()
  const [openStockPurchase, setOpenStockPurchase] = React.useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };
  const [warehouse, setWarehouse] = React.useState(1);
  const [destinationWarehouse, setDestinationWarehouse] = React.useState(1);
  const [stocks, setStocks] = React.useState([])
  const [suppliers, setSuppliers] = React.useState([])
  const [customers, setCustomers] = React.useState([])
  const [error, setError] = React.useState("")
  const [dataId, setDataId] = React.useState()
  const token = localStorage.getItem("token")
  let editorId = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      editorId = decoded.id;
      role = decoded.role;
    } catch (error) {
      console.error("Invalid token:", error.message);
    }
  }

  const [supplierId, setSupplierId] = useState(1)
  const [customerId, setCustomerId] = useState(1)
  const [materialType, setMaterialType] = useState(1)
  const [amount, setAmount] = useState(0)
  const [plateNumber, setPlateNumber] = useState()
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowIndex: null });
  const [activeRow, setActiveRow] = useState(null);

  const handleChange = (event, newWarehouse) => {
    setWarehouse(newWarehouse);
  };

  const handleOpenAddStock = () => {
    setOpenAddStock(true);
    setSupplierId(1);
    setMaterialType(1);
  };

  const handleOpenDeleteStock = () => {
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpenAddStock(false);
    setOpenReduceStock(false);
    setOpenTransferStock(false);
    setOpenSuccess(false);
    setDeleteSuccess(false)
    setOpenDelete(false);
    setOpenStockPurchase(false);
  };

  const handleOpenReduceStock = () => {
    setOpenReduceStock(true);
    setMaterialType(1);
  };

  const handleOpenStockPurchase = () => {
    setOpenStockPurchase(true);
    setCustomerId(1);
    setMaterialType(1);
  };

  const handleOpenTransferStock = () => {
    setOpenTransferStock(true);
    setDestinationWarehouse(1);
    setMaterialType(1);
  };

  const handleAddStock = async () => {
    if (!supplierId || !materialType || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await create(warehouse, supplierId, null, materialType, amount, plateNumber, 1, editorId, date);

      if(response.data.status === true) {
        const newData = await getData(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  const handleAddStockPurchase = async () => {
    if (!customerId || !materialType || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await create(warehouse, null, customerId, materialType, amount, "", 4, editorId, date);

      if(response.data.status === true) {
        const newData = await getData(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  const handleReduceStock = async () => {
    if ( !materialType || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await create(warehouse, 0, null, materialType, amount, "", 2, editorId, date);

      if(response.data.status === true) {
        const newData = await getData(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  const handleMoveStock = async () => {
    if (!destinationWarehouse || !materialType || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await moveStock(warehouse, destinationWarehouse, materialType, amount, editorId, date);

      if(response.data.status === true) {
        const newData = await getData(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert(error);
    }
  }

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

  const handleClickOutside = () => {
    setContextMenu({ visible: false, x: 0, y: 0, rowIndex: null });
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteStock(id)
      if(response.data.status === true) {
        const newData = await getData(warehouse, date)
        setStocks(newData.data.data)
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
      try {
        const stock = await getData(warehouse, date)
        const supplier = await getSuppliers()
        const customer = await getCustomers()
        setStocks(stock.data.data); 
        setSuppliers(supplier.data.data); 
        setCustomers(customer.data.data);
      } catch (err) {
        setError(err.message); 
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(warehouse, date)
        setStocks(response.data.data)
      } catch (err) {
        setError(err.message);
        alert(error)
      }
    };

    if (startDate && warehouse) {
      fetchData();
    }
  }, [startDate, warehouse]);

  if ( role === 'superadmin' ) {
    return (
      <div onClick={handleClickOutside} className='text-[#585858]'>
        <NavBar />
  
        <div className='flex justify-between gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
          <div className='flex w-full gap-2 py-1 px-5 rounded-2xl bg-blue-1'>
            <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="bg-blue-1 w-[95px] text-white font-semibold"
              dateFormat="d-MM-yyyy"
            />
          </div>
          <button
            onClick={handleOpenAddStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
          >+ STOK MASUK</button>
          <button
            onClick={handleOpenReduceStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
          >+ GILING</button>
          <button
            onClick={handleOpenStockPurchase}
            className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
          >+ PENJUALAN</button>
          <button
            onClick={handleOpenTransferStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
          >PINDAH GUDANG</button>
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
          open={deleteSuccess}
          onClose={handleClose}
        >
          <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
            <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt=''></img>
            <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DIHAPUS</p>
          </Box>
        </Modal>
  
        {/* ADD STOCK */}
        <Modal
          open={openAddStock}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 px-10" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH STOK MASUK</h2>
            <div className='grid grid-cols-1 gap-3'>
              <div className='grid grid-cols-7 items-center'>
                <label className='col-span-2 text-left'>Supplier</label>
                <p className='col-span-1'>:</p>
                <select
                  className='col-span-4 border p-[2px] w-[150px] rounded-md' name="suppliers" id="suppliers"
                  onChange={(e) => {
                    const value = e.target.value
                    setSupplierId(value)
                  }}
                >
                  {
                    suppliers.slice(1).map((data) => (
                      <option key={data.id} value={data.id}>{data.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='grid grid-cols-7 items-center'>
                <label className='col-span-2 text-left'>Nopol</label>
                <p className='col-span-1'>:</p>
                <input
                  className='col-span-4 border w-[150px] rounded-md'
                  onChange={(e) => setPlateNumber(e.target.value)}
                ></input>
              </div>
              <div className='grid grid-cols-7 items-center'>
                <label className='col-span-2 text-left'>Jenis Beras</label>
                <p className='col-span-1'>:</p>
                <select
                  className='col-span-4 border p-[2px] w-[150px] rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaterialType(value);
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='grid grid-cols-7 items-center'>
                <label className='col-span-2 text-left'>Jumlah</label>
                <p className='col-span-1'>:</p>
                <input
                  className='col-span-4 border w-[150px] rounded-md'
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleAddStock}
            >TAMBAH</button>
          </Box>
        </Modal>
  
        {/* ADD PURCHASE */}
        <Modal
          open={openStockPurchase}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 w-[500px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH DATA PENJUALAN</h2>
            <div className='flex gap-2'>
              <div className='text-left'>
                <label>Customer:</label>
                <select
                  className='border p-[2px] w-[150px] rounded-md' name="customers" id="customers"
                  onChange={(e) => {
                    const value = e.target.value
                    setCustomerId(value)
                    console.log(value)
                  }}
                >
                  {
                    customers.map((data) => (
                      <option key={data.id} value={data.id}>{data.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='text-left'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[2px] w-[150px] rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='text-left'>
                <label>Jumlah:</label>
                <input
                  className='border w-[150px] rounded-md'
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleAddStockPurchase}
            >TAMBAH</button>
          </Box>
        </Modal>
  
        {/* PINDAH GUDANG */}
        <Modal
          open={openTransfer}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 w-[500px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>PINDAH GUDANG</h2>
            <div className='flex gap-4'>
              <div className='text-left w-[50%]'>
                <label>Tujuan:</label>
                <select 
                  onChange={(e) => {
                    const value = e.target.value
                    setDestinationWarehouse(value)
                  }}
                  className='border p-[2px] w-full rounded-md' 
                  name="cars" id="cars">
                  <option value={1}>GD 1</option>
                  <option value={2}>GD 2</option>
                  <option value={3}>GD 3</option>
                  <option value={4}>GD 4</option>
                  <option value={5}>GD 5</option>
                  <option value={6}>GD 6</option>
                </select>
              </div>
              <div className='text-left w-[50%]'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[2px] w-full rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='text-left w-[50%]'>
                <label>Jumlah:</label>
                <input
                  className='border w-full rounded-md'
                  onChange={(e) => {
                    const value = e.target.value
                    setAmount(value)
                  }}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleMoveStock}
            >TAMBAH</button>
          </Box>
        </Modal>
  
        {/* STOK KELUAR */}
        <Modal
          open={openReduceStock}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 w-[400px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH STOK KELUAR</h2>
            <div className='flex gap-4 justify-beetween w-full'>
              <div className='text-left w-[50%]'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[2px] w-full rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='text-left w-[50%]'>
                <label>Jumlah:</label>
                <input
                  className='border w-full rounded-md'
                  onChange={(e) => {
                    const value = e.target.value
                    setAmount(value)
                  }}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleReduceStock}
            >TAMBAH</button>
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
  
        {/* BUTTON GROUP */}
        <div className='border border-[#f4f4f4] flex gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#707070] mt-5'>
          <ToggleButtonGroup
            color="primary"
            value={warehouse}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 1
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value={1}
            >
              GD1
            </ToggleButton>
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 2
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value={2}
            >
              GD2
            </ToggleButton>
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 3
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value= {3}
            >
              GD3
            </ToggleButton>
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 4
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value={4}
            >
              GD4
            </ToggleButton>
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 5
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value={5}
            >
              GD5
            </ToggleButton>
            <ToggleButton
              className={`border !border-[white] rounded-full !w-[100px] !p-[1px] ${
                warehouse === 6
                  ? "!rounded-full !w-[100px] !p-1 !bg-blue-1 !text-[white] !font-bold"
                  : ""
              }`}
              value={6}
            >
              GD6
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
  
        <div className="overflow-x-auto mt-5 mx-20 h-80 border border-1 rounded-xl">
          <table className="text-[12px] table-auto overflow-auto border-collapse border border-gray-800 text-center w-full">
            <thead className="sticky top-0 bg-blue-1">
              <tr className="bg-blue-600 text-[white]">
                <th rowSpan="2" className="border border-[white] p-2">NO</th>
                <th rowSpan="2" className="border border-[white] p-2">SUPPLIER</th>
                <th rowSpan="2" className="border border-[white] p-2">NOPOL</th>
                <th colSpan="4" className="border border-[white] p-2">MASUK</th>
                <th colSpan="4" className="border border-[white] p-2">KELUAR</th>
                <th colSpan="4" className="border border-[white] p-2">TOTAL</th>
                <th colSpan="2" className="border border-[white] p-2">GLOBAL</th>
              </tr>
              <tr className="bg-blue-600 text-[white]">
                <th className="border border-[white] p-2">A</th>
                <th className="border border-[white] p-2">B</th>
                <th className="border border-[white] p-2">C</th>
                <th className="border border-[white] p-2">BR</th>
                <th className="border border-[white] p-2">A</th>
                <th className="border border-[white] p-2">B</th>
                <th className="border border-[white] p-2">C</th>
                <th className="border border-[white] p-2">BR</th>
                <th className="border border-[white] p-2">A</th>
                <th className="border border-[white] p-2">B</th>
                <th className="border border-[white] p-2">C</th>
                <th className="border border-[white] p-2">BR</th>
                <th className="border border-[white] p-2">IR64</th>
                <th className="border border-[white] p-2">BR</th>
              </tr>
            </thead>          
            <tbody className='text-[#000000] border-[white]'>
              { role === "superadmin" ?
                stocks.map((row, idx) => (
                  <tr key={idx} onContextMenu={(event) => handleRightClick(event, idx, row.id)} className={activeRow === idx ? "bg-[#d2c1ff]" : ""}>
                    <td>{idx + 1}</td>
                    <td 
                      className={
                        row.transaction_type === 'giling' 
                          ? 'text-[white] bg-[red] text-left w-[150px]' 
                          : row.transaction_type === 'pindah'
                          ? 'text-[#000000] bg-[#fbff0d] text-left w-[150px]'
                          : row.transaction_type === 'jual'
                          ? 'text-[#000000] bg-[#52ff0d] text-left w-[150px]'
                          : 'text-left w-[150px]'
                      }>
                      {
                        row.transaction_type === 'giling' 
                          ? 'GILING' 
                          : row.transaction_type === 'pindah' 
                          ? row.description.toUpperCase()
                          : row.transaction_type === 'jual' 
                          ? row.customer.toUpperCase()
                          : row.supplier === 'Others' 
                          ? row.description.toUpperCase()
                          : row.supplier.toUpperCase()
                      }
                    </td>
                    <td>{ row.plate_number }</td>
                    <td>{ row.material === 'A' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'A' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{row.totalA}</td>
                    <td>{row.totalB}</td>
                    <td>{row.totalC}</td>
                    <td>{row.totalBr}</td>
                    <td>{row.totalIR64}</td>
                    <td>{row.totalGlobalBr}</td>
                  </tr>
                ))
                :
                stocks.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td 
                      className={
                        row.transaction_type === 'giling' 
                          ? 'text-[white] bg-[red] text-left w-[150px]' 
                          : row.transaction_type === 'pindah'
                          ? 'text-[#000000] bg-[#fbff0d] text-left w-[150px]'
                          : row.transaction_type === 'jual'
                          ? 'text-[#000000] bg-[#66ff0d] text-left w-[150px]'
                          : 'text-left w-[150px]'
                      }>
                      {
                        row.transaction_type === 'giling' 
                          ? 'GILING' 
                          : row.transaction_type === 'pindah' 
                          ? row.description.toUpperCase()
                          : row.transaction_type === 'jual' 
                          ? row.customer.toUpperCase()
                          : row.supplier === 'Others' 
                          ? row.description.toUpperCase()
                          : row.supplier.toUpperCase()
                      }
                    </td>
                    <td>{ row.plate_number }</td>
                    <td>{ row.material === 'A' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'A' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{row.totalA}</td>
                    <td>{row.totalB}</td>
                    <td>{row.totalC}</td>
                    <td>{row.totalBr}</td>
                    <td>{row.totalIR64}</td>
                    <td>{row.totalGlobalBr}</td>
                  </tr>
                ))
              }
              {
                Array.from({ length: Math.max(0, 9 - stocks.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
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
    )
  } else {
    return (
      <div onClick={handleClickOutside} className='text-[#585858]'>
        <NavBar />

        <div className='flex justify-between text-bold gap-2 py-2 px-5 mx-5 rounded-2xl bg-blue-1 text-[#ffff]'>
          <div className='flex items-center'>
            <img className='w-5 h-5 mr-3' src="./assets/date.png" alt='date-icon'></img>
            {date}
          </div>
          <p>GUDANG {currentWarehouse.slice(2)}</p>
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
          open={deleteSuccess}
          onClose={handleClose}
        >
          <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
            <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt=''></img>
            <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DIHAPUS</p>
          </Box>
        </Modal>

        {/* ADD STOCK */}
        <Modal
          open={openAddStock}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-xl p-5 w-[300px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH STOK MASUK</h2>
            <div className=''>
              <div className='flex justify-between'>
                <label>Supplier:</label>
                <select
                  className='border p-[4px] w-[150px] rounded-md' name="suppliers" id="suppliers"
                  onChange={(e) => {
                    const value = e.target.value
                    setSupplierId(value)
                  }}
                >
                  {
                    suppliers.slice(1).map((data) => (
                      <option key={data.id} value={data.id}>{data.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='flex justify-between my-3'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[4px] w-[150px] rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value;
                    setMaterialType(value);
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='flex justify-between'>
                <label>Jumlah:</label>
                <input
                  className='border w-[150px] p-[3px] rounded-md'
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-5 rounded-xl font-semibold m-auto"}
              onClick={handleAddStock}
            >TAMBAH</button>
          </Box>
        </Modal>

        {/* ADD PURCHASE */}
        <Modal
          open={openStockPurchase}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-xl p-5 w-[300px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH DATA PENJUALAN</h2>
            <div className=''>
              <div className='flex items-center justify-between'>
                <label>Customer:</label>
                <select
                  className='border p-[5px] w-[150px] rounded-md' name="customers" id="customers"
                  onChange={(e) => {
                    const value = e.target.value
                    setCustomerId(value)
                    console.log(value)
                  }}
                >
                  {
                    customers.map((data) => (
                      <option key={data.id} value={data.id}>{data.name}</option>
                    ))
                  }
                </select>
              </div>
              <div className='flex items-center justify-between my-3'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[5px] w-[150px] my-2 rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='flex items-center justify-between'>
                <label>Jumlah:</label>
                <input
                  className='border p-[5px] w-[150px] rounded-md'
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-5 rounded-xl font-semibold m-auto"}
              onClick={handleAddStockPurchase}
            >TAMBAH</button>
          </Box>
        </Modal>

        {/* PINDAH GUDANG */}
        <Modal
          open={openTransfer}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 w-[500px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>PINDAH GUDANG</h2>
            <div className='flex gap-4'>
              <div className='text-left w-[50%]'>
                <label>Tujuan:</label>
                <select 
                  onChange={(e) => {
                    const value = e.target.value
                    setDestinationWarehouse(value)
                  }}
                  className='border p-[2px] w-full rounded-md' 
                  name="cars" id="cars">
                  <option value={1}>GD 1</option>
                  <option value={2}>GD 2</option>
                  <option value={3}>GD 3</option>
                  <option value={4}>GD 4</option>
                  <option value={5}>GD 5</option>
                  <option value={6}>GD 6</option>
                </select>
              </div>
              <div className='text-left w-[50%]'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-[2px] w-full rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='text-left w-[50%]'>
                <label>Jumlah:</label>
                <input
                  className='border w-full rounded-md'
                  onChange={(e) => {
                    const value = e.target.value
                    setAmount(value)
                  }}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleMoveStock}
            >TAMBAH</button>
          </Box>
        </Modal>

        {/* STOK KELUAR */}
        <Modal
          open={openReduceStock}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box className="text-center border rounded-lg p-5 w-[300px]" sx={{ ...style }}>
            <h2 className='font-semibold text-center pb-3'>TAMBAH STOK KELUAR</h2>
            <div className='text-center'>
              <div className='text-left'>
                <label>Jenis Beras:</label>
                <select
                  className='border p-2 w-full rounded-md' name='material_type' id='materials'
                  onChange={(e) => {
                    const value = e.target.value
                    setMaterialType(value)
                  }}
                >
                  <option key={1} value={1}>IR64 A</option>
                  <option key={2} value={2}>IR64 B</option>
                  <option key={3} value={3}>IR64 C</option>
                  <option key={4} value={4}>Bramo</option>
                </select>
              </div>
              <div className='text-left mt-3'>
                <label>Jumlah:</label>
                <input
                  className='border p-2 w-full rounded-md'
                  onChange={(e) => {
                    const value = e.target.value
                    setAmount(value)
                  }}
                ></input>
              </div>
            </div>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-5 rounded-xl font-semibold m-auto"}
              onClick={handleReduceStock}
            >TAMBAH</button>
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

        <div className="overflow-x-auto mt-5 mx-5 h-80 border border-1 rounded-xl">
          <table className="text-[12px] table-auto overflow-auto border-collapse border border-gray-800 text-center">
            <thead className="sticky top-0 bg-blue-1">
              <tr className="bg-blue-600 text-[white]">
                <th rowSpan="2" className="border border-[white] p-2">NO</th>
                <th rowSpan="2" className="border border-[white] p-2">SUPPLIER</th>
                <th colSpan="4" className="border border-[white] p-2">MASUK</th>
                <th colSpan="4" className="border border-[white] p-2">KELUAR</th>
              </tr>
              <tr className="bg-blue-600 text-[white]">
                <th className="border border-[white] p-2">A</th>
                <th className="border border-[white] p-2">B</th>
                <th className="border border-[white] p-2">C</th>
                <th className="border border-[white] p-2">BR</th>
                <th className="border border-[white] p-2">A</th>
                <th className="border border-[white] p-2">B</th>
                <th className="border border-[white] p-2">C</th>
                <th className="border border-[white] p-2">BR</th>
              </tr>
            </thead>          
            <tbody className='text-[#000000] border-[white]'>
              {
                stocks.map((row, idx) => (
                  <tr key={idx} onContextMenu={(event) => handleRightClick(event, idx, row.id)} className={activeRow === idx ? "bg-[#d2c1ff]" : ""}>
                    <td>{idx + 1}</td>
                    <td 
                      className={
                        row.transaction_type === 'giling' 
                          ? 'text-[white] bg-[red] text-left w-[150px]' 
                          : row.transaction_type === 'pindah'
                          ? 'text-[#000000] bg-[#fbff0d] text-left w-[150px]'
                          : row.transaction_type === 'jual'
                          ? 'text-[#000000] bg-[#52ff0d] text-left w-[150px]'
                          : 'text-left w-[150px]'
                      }>
                      {
                        row.transaction_type === 'giling' 
                          ? 'GILING' 
                          : row.transaction_type === 'pindah' 
                          ? row.description.toUpperCase()
                          : row.transaction_type === 'jual' 
                          ? row.customer.toUpperCase()
                          : row.supplier === 'Others' 
                          ? row.description.toUpperCase()
                          : row.supplier.toUpperCase()
                      }
                    </td>
                    <td>{ row.material === 'A' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && row.transaction_type === 'masuk' ? row.amount : '' }</td>
                    <td>{ row.material === 'A' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'B' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'C' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                    <td>{ row.material === 'Bramo' && (row.transaction_type === 'giling' || row.transaction_type === 'pindah' || row.transaction_type === 'jual') ? row.amount : '' }</td>
                  </tr>
                ))
              }
              {
                Array.from({ length: Math.max(0, 9 - stocks.length) }).map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
                    <td className="border border-gray-800">&nbsp;</td>
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

        <div className='mx-5 mt-3'>
          <button
            onClick={handleOpenAddStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-2 mt-3 rounded-2xl font-semibold w-full"}
          >+ STOK MASUK</button>
          <button
            onClick={handleOpenReduceStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-2 mt-3 rounded-2xl font-semibold w-full"}
          >+ GILING</button>
          <button
            onClick={handleOpenStockPurchase}
            className={"bg-blue-1 text-[#ffff] px-4 py-2 mt-3 rounded-2xl font-semibold w-full"}
          >+ PENJUALAN</button>
          <button
            onClick={handleOpenTransferStock}
            className={"bg-blue-1 text-[#ffff] px-4 py-2 mt-3 rounded-2xl font-semibold w-full"}
          >PINDAH GUDANG</button>
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
    )
  }
}

export default Home;