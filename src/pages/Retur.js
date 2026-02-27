import React, { useState, useEffect } from 'react'
import { addReturData, getProductionProcessReport, getReturData } from '../api';
import DatePicker from "react-datepicker";
import NavBar from "../components/NavBar";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import "react-datepicker/dist/react-datepicker.css";

const ReturData = () => {

  const [startDate, setStartDate] = useState(new Date());
  const [reports, setReports] = useState([]);
  const [retur, setRetur] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24
  };

  const date = startDate.toLocaleDateString('en-CA');

  // 🔥 FIXED HANDLE INPUT
  const handleInputChange = (product_id, field, value) => {
    setRetur(prevData => {
      const existing = prevData.find(item => item.product_id === product_id);

      if (existing) {
        return prevData.map(item =>
          item.product_id === product_id
            ? { ...item, [field]: value }
            : item
        );
      } else {
        return [
          ...prevData,
          {
            product_id,
            stock: '',
            stock_description: '',
            items_out: '',
            items_out_description: '',
            [field]: value
          }
        ];
      }
    });
  };

  const handleClose = () => {
    setOpenSuccess(false);
  };

  const handleSubmit = async () => {
    try {
      await addReturData(date, retur);
      setOpenSuccess(true);

      const newRetur = await getReturData(date);
      setRetur(newRetur.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductionProcessReport(date);
        setReports(response.data.data);

        const returResponse = await getReturData(date);
        setRetur(returResponse.data.data);

      } catch (err) {
        alert(err.message);
      }
    };

    if (startDate) {
      fetchData();
    }
  }, [startDate]); // 🔥 cukup startDate

  if (!reports) {
    return (
      <div className='text-[#585858]'>
        <NavBar />
        <div className='text-center'>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='text-[#585858]'>
      <NavBar />

      <div className='flex items-center justify-between gap-2 px-5 mx-80 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <p>LAPORAN PROSES PRODUKSI DAN DATA RETUR</p>
      </div>

      <div className='flex justify-between mx-80 pt-5'>
        <div className='flex gap-2 py-1 px-10 rounded-2xl bg-blue-1'>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="bg-blue-1 w-[95px] text-white font-semibold"
            dateFormat="d-MM-yyyy"
          />
        </div>

        <button
          className="flex gap-2 py-1 px-10 rounded-2xl bg-blue-1 text-white font-semibold text-[white]"
          onClick={handleSubmit}
        >
          SIMPAN PERUBAHAN
        </button>
      </div>

      <div className='overflow-x-auto mt-2 h-[500px] mx-80 border rounded-xl text-[14px] mb-10'>
        <table className='table-auto border-collapse w-full'>
          <thead className='sticky top-0 bg-blue-1 text-white font-semibold text-[white]'>
            <tr>
              <th>PRODUK</th>
              <th></th>
              <th>NOMINAL</th>
              <th className='px-7'>HP</th>
              <th className='w-20'>INPUT</th>
              <th>KETERANGAN</th>
            </tr>
          </thead>

          <tbody>
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
            ].map(item => {

              const report = reports.find(r => r.product_id === item.id);
              const data = retur.find(d => d.product_id === item.id) || {};

              return (
                <React.Fragment key={item.id}>
                  <tr className='text-[12px]'>
                    <td>{item.name}</td>
                    <td>STOK</td>
                    <td>{report?.stock}</td>
                    <td>{report?.hasil_giling * item.kg} KG</td>
                    <td>
                      <input
                        value={data.stock || ''}
                        onChange={(e) => handleInputChange(item.id, 'stock', e.target.value)}
                        className="w-full h-6 text-center border"
                      />
                    </td>
                    <td>
                      <input
                        value={data.stock_description || ''}
                        onChange={(e) => handleInputChange(item.id, 'stock_description', e.target.value)}
                        className="w-full h-6 text-center border"
                      />
                    </td>
                  </tr>

                  <tr className='text-[12px]'>
                    <td>{report?.stock * item.kg}</td>
                    <td>KELUAR</td>
                    <td>
                      {report?.keluar?.jual}
                      {report?.keluar?.giling ? ` + ${report?.keluar?.giling}` : ''}
                    </td>
                    <td>sak: {report?.hasil_giling}</td>
                    <td>
                      <input
                        value={data.items_out || ''}
                        onChange={(e) => handleInputChange(item.id, 'items_out', e.target.value)}
                        className="w-full h-6 text-center border"
                      />
                    </td>
                    <td>
                      <input
                        value={data.items_out_description || ''}
                        onChange={(e) => handleInputChange(item.id, 'items_out_description', e.target.value)}
                        className="w-full h-6 text-center border"
                      />
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={openSuccess} onClose={handleClose}>
        <Box className="text-center rounded-xl shadow-lg p-5 w-[250px]" sx={{ ...style }}>
          <p className='text-[12px] font-bold text-[#666666]'>
            DATA BERHASIL DITAMBAH
          </p>
        </Box>
      </Modal>
    </div>
  )
}

export default ReturData;