/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react'
import { getSalesRetur, updateReturData, deleteRetur } from '../api'
import NavBar from "../components/NavBar"
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import "react-datepicker/dist/react-datepicker.css"

const ReturPenjualan = () => {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)
    return lastMonth
  })
  const [endDate, setEndDate] = useState(new Date())

  const [retur, setRetur] = useState([])     // raw data hasil fetch
  const [data, setData] = useState([])       // data setelah transform & filter
  const [dataId, setDataId] = useState()
  const [originalData, setOriginalData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  const [status, setStatus] = useState("all")
  const [name, setName] = useState("")
  const [totalWeight, setTotalWeight] = useState("")
  const [openSuccess, setOpenSuccess] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: null, y: null, rowIndex: null });
  const [activeRow, setActiveRow] = useState(null);

  const inputsRef = useRef([])

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  }

  const columns = [
    { key: "NO", width: "24px" },
    { key: "TANGGAL", width: "70px" },
    { key: "NAMA TOKO", width: "150px" },
    { key: "PS25", width: "34px" },
    { key: "PS10", width: "34px" },
    { key: "PS5", width: "34px" },
    { key: "P10", width: "34px" },
    { key: "P5", width: "34px" },
    { key: "PK25", width: "34px" },
    { key: "PK10", width: "34px" },
    { key: "PK5", width: "34px" },
    { key: "TP (DUS)", width: "36px" },
    { key: "TP (BKS)", width: "36px" },
    { key: "EKO", width: "30px" },
    { key: "BP", width: "30px" },
    { key: "MKP", width: "30px" },
    { key: "TGL KEMBALI", width: "70px" },
    { key: "SOPIR", width: "80px" },
    { key: "SOPIR OUT", width: "80px" },
    { key: "KETERANGAN", width: "160px" },
  ]

  const columnToProductId = {
    "PS25": 3,
    "PS10": 4,
    "PS5": 5,
    "P10": 7,
    "P5": 8,
    "PK25": 26,
    "PK10": 27,
    "PK5": 28,
    "TP (DUS)": 20,
    "TP (BKS)": 32,
    "EKO": 14,
    "BP": 11,
    "MKP": 12
  }

  const normalFieldMap = {
    "SOPIR OUT": "sopir_out",
    "SOPIR": "sopir_in",
    "KETERANGAN": "description",
    "TGL KEMBALI": "return_date"
  }

  const transformChangesForApi = (changedRows) => {
    return changedRows.map(row => {
      const payload = {
        id: row.original.ID
      }

      const returnitems = []

      Object.entries(row.changes).forEach(([key, value]) => {
        // === PRODUK ===
        if (columnToProductId[key]) {
          if (value !== "" && Number(value) > 0) {
            returnitems.push({
              id: row.id,
              product_id: columnToProductId[key],
              amount: Number(value)
            })
          }
        }

        // === FIELD BIASA ===
        if (normalFieldMap[key]) {
          payload[normalFieldMap[key]] = value || null
        }
      })

      if (returnitems.length > 0) {
        payload.returnitems = returnitems
      }

      return payload
    })
  }

  const createEmptyRow = (index) => {
    const row = {}
    columns.forEach(col => {
      row[col.key] = col.key === "NO" ? index + 1 : ""
    })
    return row
  }

  const transformSalesReturData = (apiData) => {
    return apiData.map((item, index) => {
      const row = createEmptyRow(index)
      row["ID"] = item.id
      row["TANGGAL"] = item.date
      row["NAMA TOKO"] = item.toko
      row["TGL KEMBALI"] = item.return_date
      row["SOPIR"] = item.sopir_in
      row["SOPIR OUT"] = item.sopir_out
      row["KETERANGAN"] = item.description || ""

      item.returnitems.forEach(it => {
        const map = {
          3: "PS25",  4: "PS10", 5: "PS5",
          7: "P10",   8: "P5",
          26: "PK25",  27: "PK10", 28: "PK5",
          20: "TP (DUS)", 32: "TP (BKS)",
          14: "EKO", 11: "BP", 12: "MKP"
        }

        const colName = map[it.product_id]
        if (colName) row[colName] = it.amount
      })

      return row
    })
  }

  const handleChange = (rowIndex, field, value) => {
    const newData = [...data]
    newData[rowIndex][field] = value
    setData(newData)
  }

  const handleKeyDown = (e, rowIndex, colIndex) => {
    const numRows = data.length
    const numCols = columns.length
    let nextRow = rowIndex
    let nextCol = colIndex

    switch (e.key) {
      case "ArrowDown": nextRow = Math.min(rowIndex + 1, numRows - 1); break
      case "ArrowUp": nextRow = Math.max(rowIndex - 1, 0); break
      case "ArrowLeft": nextCol = Math.max(colIndex - 1, 0); break
      case "ArrowRight": nextCol = Math.min(colIndex + 1, numCols - 1); break
      default: return
    }

    e.preventDefault()
    const nextInput = inputsRef.current[nextRow * numCols + nextCol]
    nextInput?.focus()
  }

  const handleClose = () => {
    setOpenSuccess(false)
    setOpenDelete(false)
  }

  const getChangedRows = () => {
    const changes = []

    data.forEach((row, rowIndex) => {
      const originalRow = originalData[rowIndex]
      if (!originalRow) return

      const changedFields = {}

      Object.keys(row).forEach(key => {
        if (row[key] !== originalRow[key]) {
          changedFields[key] = row[key]
        }
      })

      if (Object.keys(changedFields).length > 0) {
        changes.push({
          id: data.ID,
          rowIndex,
          changes: changedFields,
          original: originalRow
        })
      }
    })

    return changes
  }

  const handleClickOutside = () => {
    setContextMenu({ visible: false, x: 0, y: 0, rowIndex: null });
    setActiveRow(null)
    setDeleteSuccess(false)
  };

  const handleOpenDeleteStock = () => {
    setOpenDelete(true);
  };
  
  const handleDelete = async (id) => {
    try {
      const res = await deleteRetur(id);
      
      if (res.data.status) {
        const start_date = new Date(startDate).toLocaleDateString("en-CA")
        const end_date = new Date(endDate).toLocaleDateString("en-CA")
        const res = await getSalesRetur(start_date, end_date, status)

        const transformed = transformSalesReturData(res.data.data)
        setRetur(res.data.data)
        setTotalWeight(res.data.total_weight)
        setData(transformed)
        
        handleClose();
        setDeleteSuccess(true);
      }

      data.filter(item => item.id !== id)
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const start_date = new Date(startDate).toLocaleDateString("en-CA")
        const end_date = new Date(endDate).toLocaleDateString("en-CA")

        const res = await getSalesRetur(start_date, end_date, status)

        const transformed = transformSalesReturData(res.data.data)

        setRetur(res.data.data)
        setTotalWeight(res.data.total_weight)
        setData(transformed)

        console.log(`INI DATAAAA ${JSON.stringify(res.data.total_weight)}`)

        // ini udah ada id nya
        setOriginalData(JSON.parse(JSON.stringify(transformed))) // deep copy
      } catch (err) {
        alert(err.message)
      }
    }

    fetchData()
  }, [startDate, endDate, status])

  useEffect(() => {
    if (!name) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter(row =>
      row["NAMA TOKO"]
        ?.toLowerCase()
        .includes(name.toLowerCase())
    )

    setFilteredData(filtered)
  }, [name, data])

  const handleSubmit = async () => {
    try {
      const changedRows = getChangedRows()

      if (changedRows.length === 0) {
        alert("Tidak ada data yang berubah")
        return
      }

      const payload = transformChangesForApi(changedRows)

      await updateReturData(payload)

      setOpenSuccess(true)
      setOriginalData(JSON.parse(JSON.stringify(data)))
    } catch (error) {
      console.log(error)
      alert("Gagal menyimpan data.")
    }
  }

  return (
    <div onClick={handleClickOutside} className='text-[#585858]'>
      <NavBar />

      <div className='flex items-center justify-between gap-2 px-5 mx-10 rounded-2xl p-1 shadow-md shadow-[#868686]'>
        <p>DATA RETUR</p>
        <p>TOTAL RETUR: {totalWeight || 0} KG</p>
      </div>

      <div className='flex justify-between mx-10 pt-5'>
        <div className='flex gap-4'>
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
          
          {/* Filter Nama */}
          <input
            className='border-[1px] border-[#8b8b8b] p-1 rounded-xl text-black'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cari berdasarkan nama"
          />

          {/* Filter Tanggal */}
          <div className='flex gap-2 py-1 px-1 rounded-xl border-[1px] border-[#8b8b8b]'>
            <input
              type="date"
              value={startDate.toLocaleDateString("en-CA")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="text-black w-full"
            />
            <p className='text-black font-bold'>-</p>
            <input
              type="date"
              value={endDate.toLocaleDateString("en-CA")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="text-black w-full"
            />
          </div>

          {/* Filter Status */}
          <div className='flex text-black justify-between py-1 px-5 items-center rounded-xl border-[1px] border-[#8b8b8b]'>
            <label>STATUS:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">ALL</option>
              <option value="false">BELUM DIGANTI</option>
              <option value="true">SELESAI DIRETUR</option>
            </select>
          </div>
        </div>

        <div className='flex gap-4 text-[white]'>
          <button className="py-1 px-10 rounded-xl bg-blue-1 text-white font-semibold">
            CARI
          </button>

          <button
            className="py-1 px-10 rounded-xl bg-blue-1 text-white font-semibold"
            onClick={handleSubmit}
          >
            SIMPAN
          </button>
        </div>
      </div>

      {/* TABEL */}
      <div className="h-[70vh] overflow-y-auto border mx-10 mt-5 rounded-lg">
        <table className="min-w-full border-collapse border text-sm table-fixed">
          <thead className="bg-gray-200 sticky top-0 text-[white]">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="border p-2 text-center bg-blue-1 text-white text-[12px]"
                >
                  {col.key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {
              filteredData.map((row) => {
                const rowIndex = data.findIndex(d => d.ID === row.ID)
                return (
                  <tr
                    key={row.ID}
                    onContextMenu={(event) => handleRightClick(event, rowIndex, row.ID)}
                    className={activeRow === rowIndex ? "border-2" : ""}
                  >
                    {columns.map((col, colIndex) => (
                      <td key={col.key} className="border p-1 text-[12px]">
                        {col.key === "NO" ? (
                          <div className="text-center py-1 bg-gray-50">
                            {row[col.key]}
                          </div>
                        ) : (
                          <input
                            ref={(el) =>
                              (inputsRef.current[rowIndex * columns.length + colIndex] = el)
                            }
                            value={row[col.key] || ""}
                            readOnly={!normalFieldMap[col.key]}
                            onChange={(e) =>
                              handleChange(rowIndex, col.key, e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, rowIndex, colIndex)
                            }
                            className="w-full outline-none p-1 text-center"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                )})
            }
            {
              Array.from({ length: Math.max(0, 13 - data.length) }).map((_, idx) => (
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
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                  <td className="border border-gray-800">&nbsp;</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* SUCCESS MODAL */}
      <Modal open={openSuccess} onClose={handleClose}>
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt='' />
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

export default ReturPenjualan
