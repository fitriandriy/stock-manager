/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import React, { useState, useEffect, useRef } from 'react'
import NavBar from "../components/NavBar"
import DatePicker from "react-datepicker";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { addReduceStock, getStockProducts, getProducts, addStockProduct, deleteStockProduct, addPurchase, moveStockProduct, getProductReports } from '../api'
import { jwtDecode } from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";

const Produk = () => {
  const [startDate, setStartDate] = useState(new Date());
  const date = startDate.toLocaleDateString('en-CA')
  const [openAddStock, setOpenAddStock] = React.useState(false);
  const [openReduceStock, setOpenReduceStock] = React.useState(false);
  const [openTransfer, setOpenTransferStock] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
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
  const [keteranganGiling, setKeteranganGiling] = React.useState('');
  const [stocks, setStocks] = React.useState([])
  const [products, setProducts] = React.useState([])
  const [productReports, setProductReports] = React.useState([])
  const [dataId, setDataId] = React.useState()
  const token = localStorage.getItem("token")
  const currentWarehouse = localStorage.getItem("warehouse")
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

  const [productName, setProductName] = useState(3)
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowIndex: null });
  const [activeRow, setActiveRow] = useState(null);

  const handleChange = (event, newWarehouse) => {
    setWarehouse(newWarehouse);
  };

  const handleOpenAddStock = () => {
    setOpenAddStock(true);
    setProductName(3);
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
  };

  const handleOpenStockPurchase = () => {
    setOpenStockPurchase(true);
    setProductName(3);
  };

  const handleOpenTransferStock = () => {
    setOpenTransferStock(true);
    setDestinationWarehouse(1);
    setProductName(3);
  };

  const handleAddStock = async () => {
    if (!productName || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await addStockProduct(warehouse, productName, amount, description, editorId, date);

      if(response.data.status === true) {
        const newData = await getStockProducts(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  const handleAddStockPurchase = async () => {
    if (!productName || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await addPurchase(warehouse, productName, amount, description, editorId, date);

      if(response.data.status === true) {
        const newData = await getStockProducts(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  // tambah stok untuk digiling
  const handleReduceStock = async () => {
    if ( !productName || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await addReduceStock(warehouse, productName, amount, keteranganGiling, editorId, date);

      if(response.data.status === true) {
        const newData = await getStockProducts(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setOpenSuccess(true);
        setKeteranganGiling("Giling untuk PS")
      }
    } catch (error) {
      alert("Error saat membuat stok:", error);
    }
  }

  const handleMoveStock = async () => {
    if (!destinationWarehouse || !productName || !amount) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      const response = await moveStockProduct(warehouse, destinationWarehouse, productName, amount, editorId, date);

      if(response.data.status === true) {
        const newData = await getStockProducts(warehouse, date)
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
    setActiveRow(null)
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteStockProduct(id)
      if(response.data.status === true) {
        const newData = await getStockProducts(warehouse, date)
        setStocks(newData.data.data)
        handleClose();
        setDeleteSuccess(true);
      }
    } catch (error) {
      alert("Error:", error);
    }
    handleClickOutside();
  };

  const handleContextOrLongPress = (e, idx, id) => {
    e.preventDefault();
    setActiveRow(idx)
    setDataId(id)
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      rowIndex: idx,
    });
  };
  
  const longPressTimeoutRef = useRef(null);

  const createEventHandlers = (idx, id) => ({
    onContextMenu: (e) => handleContextOrLongPress(e, idx, id),
    onTouchStart: (e) => {
      longPressTimeoutRef.current = setTimeout(() => {
        setActiveRow(idx)
        setDataId(id)
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          rowIndex: idx,
        });
      }, 1);
    },
    onTouchEnd: () => {
      clearTimeout(longPressTimeoutRef.current);
    },
    onTouchMove: () => {
      clearTimeout(longPressTimeoutRef.current);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate) return;

        let targetWarehouse = warehouse;

        if (role !== 'superadmin') {
          const current = parseInt(currentWarehouse.slice(-1));
          if (!warehouse || warehouse !== current) {
            setWarehouse(current);
            return;
          }
          targetWarehouse = current;
        }

        const stock = await getStockProducts(targetWarehouse, startDate);
        setStocks(stock.data.data);

        const product = await getProducts();
        setProducts(product.data.data);

        const productReport = await getProductReports(targetWarehouse, startDate);
        setProductReports(productReport.data.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, [warehouse, startDate]);
  
  return (
    <div onClick={handleClickOutside} className='text-[#585858]'>
      <NavBar />

      <div className='md:hidden flex justify-between text-bold gap-2 py-2 px-5 mx-5 rounded-2xl bg-blue-1 text-[#ffff]'>
        <div className='flex items-center'>
          <img className='w-5 h-5 mr-3' src="./assets/date.png" alt='date-icon'></img>
          {date}
        </div>
        <p>GUDANG {currentWarehouse}</p>
      </div>

      <div className='flex justify-between lg:gap-2 lg:px-5 mx-5 lg:mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <div className='hidden lg:flex w-[20%] gap-2 py-1 px-5 rounded-2xl bg-blue-1'>
          <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="bg-blue-1 w-[95px] text-white font-semibold"
            dateFormat="d-MM-yyyy"
          />
        </div>
        <div className="lg:flex lg:gap-2 w-full mt-2 lg:mt-0">
          <div className='flex gap-1 lg:gap-2 lg:w-full'>
            <button
              onClick={handleOpenAddStock}
              className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
            >+ HASIL GILING</button>
            <button
              onClick={handleOpenReduceStock}
              className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
            >+ GILING</button>
          </div>
          <div className='flex gap-1 lg:gap-2 mt-2 lg:mt-0 lg:w-full'>
            <button
              onClick={handleOpenStockPurchase}
              className={"bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
            >+ PENJUALAN</button>
            <button
              onClick={handleOpenTransferStock}
              className={"hidden lg:block bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
            >PINDAH GUDANG</button>
            <button
              onClick={handleOpenTransferStock}
              className={"block lg:hidden bg-blue-1 text-[#ffff] px-4 py-1 rounded-2xl font-semibold w-full"}
            >PINDAH</button>
          </div>
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
        <Box className="text-center border rounded-lg p-5 w-[80%] lg:w-[500px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>TAMBAH HASIL GILING</h2>
          <div className='grid grid-cols-1 gap-2 lg:gap-3'>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jenis Produk</label>
              <p className='col-span-1'>:</p>
              <select
                className='col-span-4 border p-[6px] rounded-md w-full'
                name='material_type'
                id='materials'
                onChange={(e) => {
                  const value = e.target.value;
                  setProductName(value);
                }}
              >
                {products?.slice(2).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Stok Saat Ini</label>
              <p className='col-span-1'>:</p>
              <input
                type='number'
                className='col-span-4 border p-[6px] rounded-md w-full'
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Deskripsi</label>
              <p className='col-span-1'>:</p>
              <textarea
                className='col-span-4 border p-[6px] rounded-md w-full'
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button
            className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-3 rounded-xl font-semibold m-auto"}
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
        <Box className="text-center border rounded-lg p-5 w-[80%] lg:w-[500px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>TAMBAH DATA PENJUALAN</h2>
          <div className='grid grid-cols-1 gap-3'>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jenis Produk</label>
              <p className='col-span-1'>:</p>
              <select
                className='col-span-4 border p-[6px] rounded-md w-full'
                name='material_type'
                id='materials'
                onChange={(e) => {
                  const value = e.target.value;
                  setProductName(value);
                }}
              >
                {products.slice(2).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jumlah</label>
              <p className='col-span-1'>:</p>
              <input
                type='number'
                className='col-span-4 border p-[6px] rounded-md w-full'
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Deskripsi</label>
              <p className='col-span-1'>:</p>
              <textarea
                className='col-span-4 border p-[6px] rounded-md w-full'
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <button
            className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-3 rounded-xl font-semibold m-auto"}
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
        <Box className="text-center border rounded-lg p-5 w-[80%] lg:w-[500px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>PINDAH GUDANG</h2>
          <div className='grid grid-cols-1 gap-3'>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Tujuan:</label>
              <p className='col-span-1'>:</p>
              <select 
                onChange={(e) => {
                  const value = e.target.value
                  setDestinationWarehouse(value)
                }}
                className='col-span-4 border p-[2px] rounded-md h-10' 
                name="cars" id="cars">
                <option value={1}>GD 1</option>
                <option value={2}>GD 2</option>
                <option value={3}>GD 3</option>
                <option value={4}>GD 4</option>
                <option value={5}>GD 5</option>
                <option value={6}>GD 6</option>
              </select>
            </div>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jenis Produk</label>
              <p className='col-span-1'>:</p>
              <select
                className='col-span-4 border p-[2px] rounded-md w-full h-10'
                name='material_type'
                id='materials'
                onChange={(e) => {
                  const value = e.target.value;
                  setProductName(value);
                }}
              >
                {products.slice(2).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jumlah</label>
              <p className='col-span-1'>:</p>
              <input
                className='border col-span-4 rounded-md h-10'
                onChange={(e) => {
                  const value = e.target.value
                  setAmount(value)
                }}
              ></input>
            </div>
          </div>
          <button
            className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-3 rounded-xl font-semibold m-auto"}
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
        <Box className="text-center border rounded-lg p-5 w-[80%] lg:w-[500px]" sx={{ ...style }}>
          <h2 className='font-semibold text-center pb-3'>TAMBAH BAHAN UNTUK GILING</h2>
          <div className='grid grid-cols-1 gap-3'>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jenis Produk</label>
              <p className='col-span-1'>:</p>
              <select
                className='col-span-4 border p-[6px] rounded-md w-full'
                name='material_type'
                id='materials'
                onChange={(e) => {
                  const value = e.target.value;
                  setProductName(value);
                }}
              >
                {products?.slice(2).map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Jumlah</label>
              <p className='col-span-1'>:</p>
              <input
                className='col-span-4 border p-[6px] rounded-md w-full'
                onChange={(e) => {
                  const value = e.target.value
                  setAmount(value)
                }}
              ></input>
            </div>
            <div className='grid grid-cols-7 items-center text-left'>
              <label className='col-span-2'>Keterangan</label>
              <p className='col-span-1'>:</p>
              <select
                className='col-span-4 border p-[6px] rounded-md w-full'
                name='keteranganGiling'
                id='keteranganGiling'
                onChange={(e) => {
                  const value = e.target.value;
                  setKeteranganGiling(value);
                }}
              >
                <option>Giling untuk PS</option>
                <option>Giling untuk Kuning</option>
                <option>Giling untuk Tepung</option>
                <option>Giling untuk Lebah</option>
                <option>Giling untuk Ketan</option>
                <option>Giling untuk Ekonomi</option>
              </select>
            </div>
          </div>
          <button
            className={"bg-blue-1 text-[#ffff] px-7 py-2 mt-3 rounded-xl font-semibold m-auto"}
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
              onClick={() => {
                console.log(`INI ID NYA ${dataId}`)
                handleDelete(dataId)
              }}
            >HAPUS</button>
            <button
              className={"bg-blue-1 text-[#ffff] px-4 py-1 mt-3 rounded-xl font-semibold m-auto"}
              onClick={handleClose}
            >BATAL</button>
          </div>
        </Box>
      </Modal>

      {/* SELECT WAREHOUSE */}
      <div className='hidden border border-[#f4f4f4] lg:flex gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#707070] mt-5'>
        <ToggleButtonGroup
          color="primary"
          value={warehouse}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          className='flex justify-between w-full'
        >
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 1
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value={1}
          >
            GD1
          </ToggleButton>
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 2
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value={2}
          >
            GD2
          </ToggleButton>
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 3
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value= {3}
          >
            GD3
          </ToggleButton>
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 4
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value={4}
          >
            GD4
          </ToggleButton>
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 5
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value={5}
          >
            GD5
          </ToggleButton>
          <ToggleButton
            className={`border !border-[white] rounded-full !w-full !p-[1px] ${
              warehouse === 6
                ? "!rounded-full !w-full !p-1 !bg-blue-1 !text-[white] !font-bold"
                : ""
            }`}
            value={6}
          >
            GD6
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="overflow-x-auto mt-2 lg:mt-5 mx-5 lg:mx-20 h-80 border border-1 rounded-xl">
        <table className="text-[12px] table-auto overflow-auto border-collapse border border-gray-800 text-center w-full">
          <thead className="sticky top-0 bg-blue-1">
            <tr className="bg-blue-600 text-[white]">
              <th className="border border-[white] p-2">NO</th>
              <th className="border border-[white] p-2">JENIS TRANSAKSI</th>
              <th className="border border-[white] p-2">NAMA PRODUK</th>
              <th className="border border-[white] p-2">JUMLAH (SAK)</th>
              <th className="border border-[white] p-2">KETERANGAN</th>
            </tr>
          </thead>          
          <tbody className='text-[#000000] border-[white]'>
            { role === "superadmin" ?
              stocks.map((row, idx) => {
                const bind = createEventHandlers(idx, row.id);
                return (
                  <tr key={idx} {...bind} onContextMenu={(event) => handleRightClick(event, idx, row.id)} className={activeRow === idx ? "bg-[#d2c1ff]" : ""}>
                    <td>{idx + 1}</td>
                    <td className='text-left'>
                      {
                        row.transaksi === "masuk" && row.deskripsi.slice(0, 2) === "GD" ? `PINDAH DARI ${row.deskripsi}`
                        : row.transaksi === "masuk" ? "HASIL GILING"
                        : row.transaksi === "jual" ? "STOK KELUAR"
                        : row.transaksi === "giling" ? "STOK KELUAR"
                        : row.transaksi === "pindah" ? "PINDAH"
                        : row.deskripsi.toUpperCase()
                      }
                    </td>
                    <td>{row.produk}</td>
                    <td>{row.total}</td>
                    <td>{row.deskripsi !== "" ? row.deskripsi.toUpperCase() : "-"}</td>
                  </tr>
                )
              })
              :
              stocks.map((row, idx) => {
                const bind = createEventHandlers(idx, row.id);
                return (
                  <tr key={idx} {...bind} className={activeRow === idx ? "bg-[#d2c1ff]" : ""}>
                    <td>{idx + 1}</td>
                    <td className='text-left'>
                      {
                        row.transaksi === "masuk" && row.deskripsi.slice(0, 2) === "GD" ? `PINDAH DARI ${row.deskripsi}`
                        : row.transaksi === "masuk" ? "HASIL GILING"
                        : row.transaksi === "jual" ? "STOK KELUAR"
                        : row.transaksi === "giling" ? "STOK KELUAR"
                        : row.transaksi === "pindah" ? "PINDAH"
                        : row.deskripsi.toUpperCase()
                      }
                    </td>
                    <td>{row.produk}</td>
                    <td>{row.total}</td>
                    <td>{row.deskripsi !== "" ? row.deskripsi : "-"}</td>
                  </tr>
                )
              })
            }
            {
              Array.from({ length: Math.max(0, 10 - stocks.length) }).map((_, idx) => (
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

      <div className='border border-[#f4f4f4] px-5 mx-5 lg:mx-20 rounded-2xl p-1 shadow-md shadow-[#707070] my-5'>
        <p className='font-bold'>RINCIAN</p>
        <div className='lg:flex justify-between'>
          <div>
            <p className='font-bold'>TOTAL STOK</p>
            {
              productReports.stok?.map((row, idx) => (
                row.total_stok !== 0 ?
                  <div>
                    <li id={idx}>{row.product_name} : {row.total_stok} sak</li>
                  </div>
                : <div></div>
              ))
            }
          </div>
          <div>
            <p className='font-bold'>HASIL GILING</p>
            {
              productReports.hasil_giling?.map((row, idx) => (
                row.hasil_giling !== 0 ?
                  <div>
                    <li id={idx}>{row.product_name} : {row.hasil_giling} sak</li>
                  </div>
                : <div></div>
              ))
            }
          </div>
          <div>
            <p className='font-bold'>STOK KELUAR</p>
            {
              productReports.stok_keluar?.map((row, idx) => (
                row.total_keluar !== 0 ?
                  <div>
                    <li id={idx}>{row.product_name} : {row.total_keluar} sak</li>
                  </div>
                : <div></div>
              ))
            }
          </div>
        </div>
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

export default Produk;