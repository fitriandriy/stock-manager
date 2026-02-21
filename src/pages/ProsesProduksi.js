import React, { useState, useEffect } from 'react'
import { getProductionProcessReport } from '../api';
import DatePicker from "react-datepicker";
import NavBar from "../components/NavBar";
import "react-datepicker/dist/react-datepicker.css";

const ProsesProduksi = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [reports, setReports] = useState([])
  const [beli64, setBeli64] = useState([])
  const [beliBr, setBeliBr] = useState([])
  const [purchase, setPurchase] = useState('')
  const date = startDate.toLocaleDateString('en-CA')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductionProcessReport(date)
        setReports(response.data.data)
        console.log(`INI REPORTS ${JSON.stringify(reports)}`)
        setBeli64(response.data.beli64)
        setBeliBr(response.data.beliBr)
        setPurchase(response.data.pembelian)
      } catch (err) {
        alert(err.message)
      }
    }

    if (startDate) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, date])

  if (!reports) {
    return (
      <div className='text-[#585858]'>
        <NavBar />
        <div className='text-center'>
          <p>Loading...</p>
        </div>
      </div>
    )
  } else {
    return (
      <div className='text-[#585858]'>
        <NavBar />
        <div className='flex items-center justify-between gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
          <p className=''>LAPORAN PROSES PRODUKSI</p>
          <div className='flex gap-2 py-1 px-10 rounded-2xl bg-blue-1'>
            <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="bg-blue-1 w-[95px] text-white font-semibold"
              dateFormat="d-MM-yyyy"
            />
          </div>
        </div>
        <div className='flex justify-evenly mt-5 p-1 bg-[#e2e0e0] mx-44 rounded-lg'>
          <div className='flex justify-between gap-10'>
            <p className='font-bold'>BAHAN BELI : {reports.beli64}</p>
            <p>IR 64 : {(beli64 * 50).toLocaleString('id-ID')} KG</p>
            <p>BRAMO : {(beliBr * 50).toLocaleString('id-ID')} KG</p>
          </div>
          <div className='flex justify-between gap-10'>
            <p className='font-bold'>STOK BAHAN :</p>
            <p>IR 64 : {(parseInt(reports[0]?.stock) * 50).toLocaleString('id-ID')} KG</p>
            <p>BRAMO : {(parseInt(reports[1]?.stock) * 50).toLocaleString('id-ID')} KG</p>
          </div>
        </div>
        <div className='flex gap-5 justify-between mx-44 pt-5 mb-10'>
          <div>
            <table className='rounded-lg'>
              <thead className='bg-[#29c631] text-[white]'>
                <tr>
                  <th>PRODUK</th>
                  <th></th>
                  <th>NOMINAL</th>
                  <th>HASIL PRODUKSI (KG)</th>
                </tr>
              </thead>
              <tbody className='text-[12px]'>
                <tr>
                  <td className='text-left'>BERAS PS @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 3)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 3)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 3)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 3)?.keluar.jual}</td>
                  <td>sak: {(reports.find(r => r.product_id === 3)?.hasil_giling * 25)/25}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PS @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 4)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 4)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 4)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 4)?.keluar.jual}</td>
                  <td>sak: {(reports.find(r => r.product_id === 4)?.hasil_giling * 10)/10}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PS @ 5 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 5)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 5)?.hasil_giling * 5} {purchase ? '- ' + purchase : ''} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 5)?.stock * 5}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 5)?.keluar.jual}</td>
                  <td>sak: {(reports.find(r => r.product_id === 5)?.hasil_giling * 5)/5} {purchase ? '- ' + (purchase / 5) : ''}</td>
                </tr>
                <tr>
                  <td className='text-left'>MENIR KETAN @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 18)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 18)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 18)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 18)?.keluar.jual}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>MENIR KIBI @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 19)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 19)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 19)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 19)?.keluar.jual} + {reports.find(r => r.product_id === 19)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>MENIR @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 13)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 13)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 13)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 13)?.keluar.jual} + {reports.find(r => r.product_id === 13)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>TEPUNG @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 20)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 20)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 20)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 20)?.keluar.jual}</td>
                  <td>roll: {((reports.find(r => r.product_id === 20)?.hasil_giling * 10)/1500).toFixed(1)}</td>
                </tr>
                <tr>
                  <td className='text-left'>TAPIOKA @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 21)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 21)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 21)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 21)?.keluar.jual} + {reports.find(r => r.product_id === 21)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>KIBI POLOS @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 22)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 22)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 22)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 22)?.keluar.jual}</td>
                  <td>sak: {(reports.find(r => r.product_id === 22)?.hasil_giling * 25)/25}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS REJECT @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 15)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 15)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 15)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 15)?.keluar.jual} + {reports.find(r => r.product_id === 15)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>REJECT KETAN</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 23)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 23)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 23)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 23)?.keluar.jual}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PS KUNING @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 26)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 26)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 26)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 26)?.keluar.jual} + {reports.find(r => r.product_id === 26)?.keluar.giling}</td>
                  <td>sak: {reports.find(r => r.product_id === 26)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PS KUNING @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 27)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 27)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 27)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 27)?.keluar.jual} + {reports.find(r => r.product_id === 27)?.keluar.giling}</td>
                  <td>sak: {reports.find(r => r.product_id === 27)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PS KUNING @ 5 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 28)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 28)?.hasil_giling * 5} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 28)?.stock * 5}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 28)?.keluar.jual} + {reports.find(r => r.product_id === 28)?.keluar.giling}</td>
                  <td>sak: {reports.find(r => r.product_id === 28)?.hasil_giling}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className='rounded-xl'>
              <thead className='bg-[#c62929] text-[white] rounded-xl'>
                <tr>
                  <th>PRODUK</th>
                  <th></th>
                  <th>NOMINAL</th>
                  <th>HASIL PRODUKSI (KG)</th>
                </tr>
              </thead>
              <tbody className='text-[12px]'>
              <tr>
                  <td className='text-left'>BAHAN BAKU IR 64</td>
                  <td></td>
                  <td>{reports.find(r => r.product_id === 1)?.keluar.giling * 50} KG</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td className='text-left'>BAHAN BAKU MEMBRAMO</td>
                  <td></td>
                  <td>{reports.find(r => r.product_id === 2)?.keluar.giling * 50} KG</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PRE @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 6)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 6)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 6)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 6)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 6)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PRE @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 7)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 7)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 7)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 7)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 7)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS PRE @ 5 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 8)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 8)?.hasil_giling * 5} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 8)?.stock * 5}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 8)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 8)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS MANGGA @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 9)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 9)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 9)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 9)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 9)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS MANGGA @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 10)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 10)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 10)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 10)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 10)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS MANGGA @ 5 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 29)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 29)?.hasil_giling * 5} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 29)?.stock * 5}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 29)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 29)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS LEBAH @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 16)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 16)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 16)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 16)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 16)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS LEBAH @ 10 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 17)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 17)?.hasil_giling * 10} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 17)?.stock * 10}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 17)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 17)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>BROKEN PREMIUM @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 11)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 11)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 11)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 11)?.keluar.jual} + {reports.find(r => r.product_id === 11)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>MENIR KIBI PREM @ 50 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 12)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 12)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 12)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 12)?.keluar.jual} + {reports.find(r => r.product_id === 12)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>BERAS EKONOMI @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 14)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 14)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 14)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 14)?.keluar.jual} + {reports.find(r => r.product_id === 14)?.keluar.giling}</td>
                  <td>sak: {reports.find(r => r.product_id === 14)?.hasil_giling}</td>
                </tr>
                <tr>
                  <td className='text-left'>KETAN PUTIH</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 18)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 18)?.hasil_giling * 50} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 18)?.stock * 50}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 18)?.keluar.jual} + {reports.find(r => r.product_id === 18)?.keluar.giling}</td>
                  <td></td>
                </tr>
                <tr>
                  <td className='text-left'>KETAN PS @ 25 KG</td>
                  <td className='text-left'>STOK</td>
                  <td>{reports.find(r => r.product_id === 31)?.stock}</td>
                  <td>{reports.find(r => r.product_id === 31)?.hasil_giling * 25} KG</td>
                </tr>
                <tr>
                  <td>{reports.find(r => r.product_id === 31)?.stock * 25}</td>
                  <td className='text-left'>KELUAR</td>
                  <td>{reports.find(r => r.product_id === 31)?.keluar.jual}</td>
                  <td>sak: {reports.find(r => r.product_id === 31)?.hasil_giling}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default ProsesProduksi
