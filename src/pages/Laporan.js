import React, { useState, useEffect } from 'react'
import { getReports } from '../api';
import NavBar from "../components/NavBar";
import DatePicker from "react-datepicker";
import Switch from '@mui/material/Switch';
import "react-datepicker/dist/react-datepicker.css";

const Laporan = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = React.useState("")
  const [reports, setReports] = React.useState()
  const [checked, setChecked] = React.useState(true);
  const date = startDate.toLocaleDateString('en-CA')

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports(date)
        setReports(response.data.data)
      } catch (err) {
        setError(err.message)
        console.log(error)
        alert(err.message)
      }
    }

    if (startDate) {
      fetchData();
    }
  }, [startDate, date, error])

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
        <div className='flex mx-20 gap-2'>
          <div className='flex items-center w-[300px] py-1 gap-2 px-5 rounded-2xl bg-blue-1'>
            <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="bg-blue-1 w-[100px] text-white font-semibold"
              dateFormat="d-MM-yyyy"
            />
          </div>
          <div className='flex items-center w-full gap-2 py-1 px-5 rounded-2xl shadow-md'>
            <p>GILING HARI INI:</p>
            <p className='font-bold mx-10'>IR 64: { checked ? reports.giling64+' SAK' : reports.giling64*50+' KG' }</p>
            <p className='font-bold'>BRAMO: { checked ? reports.gilingBr+' SAK' : reports.gilingBr*50+' KG' }</p>
          </div>
          <div className='flex items-center gap-2 px-5 rounded-2xl shadow-md'>
            <p>KG</p>
            <Switch
              checked={checked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <p>SAK</p>
          </div>
        </div>
        <div className='mx-20 shadow-lg p-3 rounded-lg'>
          <p className='font-semibold py-2'>TOTAL STOK</p>
          <div className='flex justify-between text-[#232323]'>
            <div className='rounded-lg text-center py-4 px-[50px] bg-[#FABA57]'>
              <p>IR64 A</p>
              <p className='font-bold'>{ checked ? reports.totalA+' SAK' : reports.totalA*50+' KG' }</p>
            </div>
            <div className='rounded-lg text-center py-4 px-[50px] bg-[#78BDDC]'>
              <p>IR64 B</p>
              <p className='font-bold'>{ checked ? reports.totalB+' SAK' : reports.totalB*50+' KG' }</p>
            </div>
            <div className='rounded-lg text-center py-4 px-[50px] bg-[#6FBF9C]'>
              <p>IR64 C</p>
              <p className='font-bold'>{ checked ? reports.totalC+' SAK' : reports.totalC*50+' KG' }</p>
            </div>
            <div className='rounded-lg text-center py-4 px-[50px] bg-[#A25FA4]'>
              <p>IR64</p>
              <p className='font-bold'>{ checked ? reports.totalIR64+' SAK' : reports.totalIR64*50+' KG' }</p>
            </div>
            <div className='rounded-lg text-center py-4 px-[50px] bg-[#6CA7AC]'>
              <p>BRAMO</p>
              <p className='font-bold'>{ checked ? reports.totalBr+' SAK' : reports.totalBr*50+' KG' }</p>
            </div>
          </div>
        </div>
        <div className='mx-20 px-3 my-3 grid grid-cols-3'>
          {
            reports.stokGudang.map((row, id) => (
              <div key={id} className='p-5 m-2 rounded-lg bg-[white] shadow-lg'>
                <p className='font-bold'>TOTAL STOK {row.warehouse}</p>
                <div className='flex gap-6'>
                  <div>
                    <p>IR64 A: { checked ? row.totalA+' SAK' : row.totalA*50+' KG' }</p>
                    <p>IR64 B: { checked ? row.totalB+' SAK' : row.totalB*50+' KG' }</p>
                    <p>IR64 C: { checked ? row.totalC+' SAK' : row.totalC*50+' KG' }</p>
                  </div>
                  <div>
                    <p>IR64: { checked ? row.totalIR64+' SAK' : row.totalIR64*50+' KG' }</p>
                    <p>BRAMO: { checked ? row.totalBr+' SAK' : row.totalBr*50+' KG' }</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Laporan