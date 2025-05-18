import React, { useState, useEffect } from 'react'
import { getProductStockReport } from '../api';
import NavBar from "../components/NavBar";
import "react-datepicker/dist/react-datepicker.css";

const LaporanProduk = () => {
  const [startDate] = useState(new Date());
  const [reports, setReports] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const date = startDate.toLocaleDateString('en-CA')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductStockReport(date)
        setReports(response.data.data)
      } catch (err) {
        alert(err.message)
      }
    }

    if (startDate) {
      fetchData();
    }
  }, [startDate, date])

  const filteredReports = reports.filter((row) =>
    row.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='text-[#585858]'>
      <NavBar />
      <div className='flex items-center justify-between gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <p className=''>LAPORAN STOK PRODUK</p>
        <div>
          <input
            className='border-[1px] w-[300px] font-thin rounded-full p-1'
            placeholder='Cari Berdasarkan Nama'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-5 mx-20 h-[400px] border border-1 rounded-xl">
        <table className="text-[14px] table-auto overflow-auto border-collapse border border-gray-800 text-center w-full">
          <thead className="sticky top-0 bg-blue-1">
            <tr className="bg-blue-600 text-[white]">
              <th className="border border-white px-2 py-2">NO</th>
              <th className="border border-white px-2 py-2">NAMA PRODUK</th>
              <th className="border border-white px-2 py-2">TOTAL STOK (SAK)</th>
              <th className="border border-white px-2 py-2">GD1</th>
              <th className="border border-white px-2 py-2">GD2</th>
              <th className="border border-white px-2 py-2">GD3</th>
              <th className="border border-white px-2 py-2">GD4</th>
              <th className="border border-white px-2 py-2">GD5</th>
              <th className="border border-white px-2 py-2">GD6</th>
            </tr>
          </thead>
          <tbody className='text-[#000000] border-[white]'>
            {
              filteredReports.length > 0 ? filteredReports.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-800 h-[40px]">{idx + 1}</td>
                  <td className='border border-gray-800 text-left h-[40px]'>{row.nama_produk}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD1"]}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD2"]}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD3"]}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD4"]}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD5"]}</td>
                  <td className="border border-gray-800 h-[40px]">{row.total_stok_gudang["GD6"]}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="text-center py-2 h-[40px] border border-gray-800">Data tidak ditemukan</td>
                </tr>
              )
            }

            {
              Array.from({ length: Math.max(0, 9 - filteredReports.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  {Array.from({ length: 9 }).map((_, cellIdx) => (
                    <td key={cellIdx} className="border border-gray-800 h-[40px] bg-gray-50">&nbsp;</td>
                  ))}
                </tr>
              ))
            }
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default LaporanProduk
