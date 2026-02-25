import React, { useState, useEffect } from 'react'
import { addReturData, getProductionProcessReport, getReturData } from '../api';
import DatePicker from "react-datepicker";
import NavBar from "../components/NavBar";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "react-datepicker/dist/react-datepicker.css";

const ReturData = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [reports, setReports] = useState([])
  const [retur, setRetur] = useState([])
  const [formData, setFormData] = useState([
    { product_id: 3, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // ps25
    { product_id: 4, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // ps10
    { product_id: 5, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // ps5
    { product_id: 6, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // prem25
    { product_id: 7, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // prem10
    { product_id: 8, stock: '', stock_description: '', items_out: '', items_out_description: '' },  // prem5
    { product_id: 11, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // bpre
    { product_id: 12, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // mkp
    { product_id: 14, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // eko
    { product_id: 20, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // tepung
    { product_id: 26, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // pk25
    { product_id: 27, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // pk10
    { product_id: 28, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // pk5
    { product_id: 31, stock: '', stock_description: '', items_out: '', items_out_description: '' }, // ketan ps 25
  ]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };

  const handleInputChange = (product_id, field, value) => {
    setRetur(prevData =>
      prevData.map(item =>
        item.product_id === product_id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleClose = () => {
    setOpenSuccess(false);
  };

  const date = startDate.toLocaleDateString('en-CA')

  const handleSubmit = async () => {
    try {
      const res = await addReturData(date, retur)
      setOpenSuccess(true);
      const newretur = await getReturData(date)
      setRetur(newretur.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductionProcessReport(date)
        setReports(response.data.data)

        const retur = await getReturData(date)
        setRetur(retur.data.data)

        console.log(`INI RETUR MAS ARIS ${JSON.stringify(response.data.data)}`)

        const mappedFormData = formData.map(item => {
          const matchedRetur = retur.data.data.find(r => r.product_id === item.product_id);
          return matchedRetur ? {
            ...item,
            stock: matchedRetur.stock || '',
            stock_description: matchedRetur.stock_description || '',
            items_out: matchedRetur.items_out || '',
            items_out_description: matchedRetur.items_out_description || ''
          } : item;
        });
        setFormData(mappedFormData);
      } catch (err) {
        alert(err.message)
      }
    }

    if (startDate) {
      fetchData();
    }
  }, [startDate, date])

  if (!reports || !retur) {
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
        <div className='flex items-center justify-between gap-2 px-5 mx-80 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
          <p className=''>LAPORAN PROSES PRODUKSI DAN DATA RETUR</p>
        </div>
        <div className='flex justify-between mx-80 pt-5'>
          <div className='flex gap-2 py-1 px-10 rounded-2xl bg-blue-1'>
            <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="bg-blue-1 w-[95px] text-white font-semibold"
              dateFormat="d-MM-yyyy"
            />
          </div>
          <button
            className="flex gap-2 py-1 px-10 rounded-2xl bg-blue-1 text-[white] font-semibold"
            onClick={() => handleSubmit()}
          >SIMPAN PERUBAHAN</button>
        </div>
        <div className='overflow-x-auto mt-2 h-[500px] mx-80 border border-1 rounded-xl text-[14px] mb-10'>
          <table className='table-auto overflow-auto border-collapse'>
            <thead className='sticky top-0 bg-blue-1 text-[white] font-semibold'>
              <tr>
                <th>PRODUK</th>
                <th></th>
                <th>NOMINAL</th>
                <th className='px-7'>HP</th>
                <th className='w-10'></th>
                <th>KETERANGAN</th>
              </tr>
            </thead>
            {[
              { id: 3, name: 'BERAS PS @ 25 KG', kg: 25 },
              { id: 4, name: 'BERAS PS @ 10 KG', kg: 10 },
              { id: 5, name: 'BERAS PS @ 5 KG', kg: 5 },
              { id: 6, name: 'PREMIUM @ 25 KG', kg: 25 },
              { id: 7, name: 'PREMIUM @ 10 KG', kg: 10 },
              { id: 8, name: 'PREMIUM @ 5 KG', kg: 5 },
              { id: 11, name: 'BERAS BP @ 50 KG', kg: 50 },
              { id: 12, name: 'MKP @ 50 KG', kg: 50 },
              { id: 14, name: 'BERAS EKO @ 25 KG', kg: 25 },
              { id: 20, name: 'TEPUNG @ 10 KG', kg: 10 },
              { id: 26, name: 'PK @ 25 KG', kg: 25 },
              { id: 27, name: 'PK @ 10 KG', kg: 10 },
              { id: 28, name: 'PK @ 5 KG', kg: 5 },
              { id: 31, name: 'KETAN PS @ 25 KG', kg: 25 },
            ].map((item, index) => {
              const reportIndex = item.id - 1;
              const report = reports[reportIndex];
              const data = retur.find(d => d.product_id === item.id) || {};
              return (
                <React.Fragment key={item.id}>
                  <tbody>
                    <tr className='text-[12px]'>
                      <td className="text-left">{item.name}</td>
                      <td className="text-left">STOK</td>
                      <td>{reports.find(r => r.product_id === item.id)?.stock}</td>
                      <td>{reports.find(r => r.product_id === item.id)?.hasil_giling * item.kg} KG</td>
                      <td>
                        <input
                          value={data.stock || ''}
                          onChange={(e) => handleInputChange(item.id, 'stock', e.target.value)}
                          className="w-full h-6 text-center"
                        />
                      </td>
                      <td>
                        <input
                          value={data.stock_description || ''}
                          onChange={(e) => handleInputChange(item.id, 'stock_description', e.target.value)}
                          className="w-full h-6 text-center"
                        />
                      </td>
                    </tr>
                    <tr className='text-[12px]'>
                      <td>{reports.find(r => r.product_id === item.id)?.stock * item.kg}</td>
                      <td className="text-left">KELUAR</td>
                      <td>{reports.find(r => r.product_id === item.id)?.keluar?.jual}{reports.find(r => r.product_id === item.id)?.keluar?.giling ? ` + ${report?.keluar.giling}` : ''}</td>
                      <td>sak: {(reports.find(r => r.product_id === item.id)?.hasil_giling * item.kg) / item.kg}</td>
                      <td>
                        <input
                          value={data.items_out || ''}
                          onChange={(e) => handleInputChange(item.id, 'items_out', e.target.value)}
                          className="w-full h-6 text-center"
                        />
                      </td>
                      <td>
                        <input
                          value={data.items_out_description || ''}
                          onChange={(e) => handleInputChange(item.id, 'items_out_description', e.target.value)}
                          className="w-full h-6 text-center"
                        />
                      </td>
                    </tr>
                  </tbody>
                </React.Fragment>
              );
            })}
          </table>
        </div>

        <Modal open={openSuccess} onClose={handleClose}>
          <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
            <img className='w-[40px] m-auto pb-4' src='./assets/success.png' alt='' />
            <p className='text-[12px] font-bold text-[#666666]'>DATA BERHASIL DITAMBAH</p>
          </Box>
        </Modal>
      </div>
    )
  }
}

export default ReturData
