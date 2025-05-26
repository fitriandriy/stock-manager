import { useState, useEffect } from 'react'
import { useApp } from '../context'
import { useNavigate } from 'react-router-dom'
import { getWarehouses } from '../api'

const SelectWarehouse = () => {
  const navigate = useNavigate()
  const [ warehouses, setWarehouse ] = useState([])
  const { setCurrentWarehouse } = useApp()

  const changeWarehouse = (warehouse) => {
    setCurrentWarehouse(warehouse);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWarehouses()
        setWarehouse(res.data.data); 
        console.log(JSON.stringify(res))
      } catch (err) {
        console.log(err.message); 
      }
    };

    fetchData();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      navigate('/home')
    } catch (error) {
      console.log(error.message)
    }
  }

  if (!warehouses) {
    return (
      <p className='font-semibold text-[16px] text-[#525151] text-center mt-32'>Loading...</p>
    )
  } else {
    return (
      <div className="text-center h-screen mx-5 mt-32">
        <p className='font-semibold text-[22px] text-[#525151]'>PILIH GUDANG YANG DITUJU</p>
        <div className="flex items-center text-center">
          <form onSubmit={handleSubmit}>
            <div className='mt-3'>
              {
                warehouses.map((row, idx) => (
                  <button
                    key={idx}
                    className={"bg-blue-1 text-[#ffff] px-4 py-2 mt-3 rounded-2xl font-semibold w-full"}
                    onClick={() => {
                      changeWarehouse(row.name)
                      navigate('/home')
                    }}
                  >GUDANG {row.name.slice(2)}</button>
                ))
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SelectWarehouse;
