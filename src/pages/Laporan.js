import React, { useState, useEffect } from 'react'
import NavBar from "../components/NavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Laporan = () => {
  const [startDate, setStartDate] = useState(new Date());
  const date = startDate.toLocaleDateString('en-CA')
  return (
    <div className='text-[#585858]'>
      <NavBar />
      <div className='flex mx-20 gap-2'>
        <div className='flex w-[300px] py-1 gap-2 px-5 rounded-2xl bg-blue-1'>
          <img className='w-5 h-5 mt-[3px]' src="./assets/date.png" alt='date-icon'></img>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="bg-blue-1 w-[100px] text-white font-semibold"
            dateFormat="d-MM-yyyy"
          />
        </div>
        <div className='flex w-full gap-2 py-1 px-5 rounded-2xl shadow-md'>
          <p>GILING HARI INI:</p>
          <p className='font-bold mx-10'>IR 64: 108.000{}</p>
          <p className='font-bold'>BRAMO: 64.000{}</p>
        </div>
      </div>
      <div className='mx-20 shadow-lg p-3 rounded-lg'>
        <p className='font-semibold py-2'>TOTAL STOK</p>
        <div className='flex justify-between text-[#232323]'>
          <div className='rounded-lg text-center py-4 px-[50px] bg-[#FABA57]'>
            <p>IR64 A</p>
            <p className='font-bold'>108000 SAK</p>
          </div>
          <div className='rounded-lg text-center py-4 px-[50px] bg-[#78BDDC]'>
            <p>IR64 B</p>
            <p className='font-bold'>108000 SAK</p>
          </div>
          <div className='rounded-lg text-center py-4 px-[50px] bg-[#6FBF9C]'>
            <p>IR64 C</p>
            <p className='font-bold'>108000 SAK</p>
          </div>
          <div className='rounded-lg text-center py-4 px-[50px] bg-[#A25FA4]'>
            <p>IR64</p>
            <p className='font-bold'>108000 SAK</p>
          </div>
          <div className='rounded-lg text-center py-4 px-[50px] bg-[#6CA7AC]'>
            <p>BRAMO</p>
            <p className='font-bold'>108000 SAK</p>
          </div>
        </div>
      </div>
      <div className='flex mx-20 justify-between px-3 my-3'>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex mx-20 justify-between px-3'>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
        <div className='p-5 rounded-lg bg-[white] shadow-lg'>
          <p className='font-bold'>TOTAL STOK GD 1{}</p>
          <div className='flex gap-6'>
            <div>
              <p>IR64 A: 30.000{}KG</p>
              <p>IR64 B: 25.000{}KG</p>
              <p>IR64 C: 5.000{}KG</p>
            </div>
            <div>
              <p>IR64: 60.000{}KG</p>
              <p>BRAMO: 35.000{}KG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Laporan