import React, { useEffect } from 'react';
import { getHasilProduksi } from '../api';
import NavBar from "../components/NavBar";
import "react-datepicker/dist/react-datepicker.css";

const LaporanHasilProduksi = () => {
  const [hasilProduksi, setHasilProduksi] = React.useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hasil = await getHasilProduksi();
        console.log("HASIL:", hasil.data);
        setHasilProduksi(hasil.data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchData();
  }, []);

  if (!hasilProduksi) {
    return (
      <div className='text-[#585858]'>
        <NavBar />
        <div className='text-center'>
          <p>Loading...</p>
        </div>
      </div>
    );
  } 

  // Total hasil produksi dalam kg
  let totalHasilProduksiKg = 0;

  // Array produk dengan ID dan berat kemasan yang sesuai
  const produkBerat = [
    { product_id: 3, beratKemasan: 25 },
    { product_id: 4, beratKemasan: 10 },
    { product_id: 5, beratKemasan: 5 },
    { product_id: 6, beratKemasan: 25 },
    { product_id: 7, beratKemasan: 10 },
    { product_id: 8, beratKemasan: 5 },
    { product_id: 9, beratKemasan: 25 },
    { product_id: 10, beratKemasan: 10 },
    { product_id: 11, beratKemasan: 50 },
    { product_id: 12, beratKemasan: 50 },
    { product_id: 13, beratKemasan: 50 },
    { product_id: 14, beratKemasan: 25 },
    { product_id: 15, beratKemasan: 50 },
    { product_id: 16, beratKemasan: 25 },
    { product_id: 17, beratKemasan: 10 },
    { product_id: 18, beratKemasan: 50 },
    { product_id: 19, beratKemasan: 50 },
    { product_id: 22, beratKemasan: 25 },
    { product_id: 23, beratKemasan: 50 },
    { product_id: 24, beratKemasan: 1 },
    { product_id: 25, beratKemasan: 1 },
    { product_id: 26, beratKemasan: 25 },
    { product_id: 27, beratKemasan: 10 },
    { product_id: 28, beratKemasan: 5 }
  ];

  // Menghitung total hasil produksi
  produkBerat.forEach(produk => {
    const produkData = hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === produk.product_id);
    if (produkData) {
      totalHasilProduksiKg += produkData.total * produk.beratKemasan;
    }
  });
  return (
    <div className='text-[#585858]'>
      <NavBar />
      <div className='flex gap-5 px-5 mx-20 rounded-2xl p-1 shadow-md shadow-[#a1acff]'>
        <p className=''>LAPORAN HASIL PRODUKSI</p>
      </div>

      <div className="mx-20 mt-5 overflow-auto border rounded-lg border-gray-300 h-[400px]">
        <table className="min-w-[1000px] border-collapse relative">
          <thead className='sticky top-0 bg-blue-1'>
            <tr className="bg-gray-100 text-[white]">
              <th className="bg-gray-100 border w-full text-center" rowSpan="2">
                TGL
              </th>
              <th className="bg-gray-100 border w-full" rowSpan="2">
                SILO(KG)
              </th>
              <th key='3' className="sticky z-10 bg-gray-100 border w-full">PS25</th>
              <th key='4' className="sticky z-10 bg-gray-100 border w-full">PS10</th>
              <th key='5' className="sticky z-10 bg-gray-100 border w-full">PS5</th>
              <th key='6' className="sticky z-10 bg-gray-100 border w-full">PREM@25</th>
              <th key='7' className="sticky z-10 bg-gray-100 border w-full">PREM@10</th>
              <th key='8' className="sticky z-10 bg-gray-100 border w-full">PREM@5</th>
              <th key='25' className="sticky z-10 bg-gray-100 border w-full">KUNING@25</th>
              <th key='26' className="sticky z-10 bg-gray-100 border w-full">KUNING@10</th>
              <th key='27' className="sticky z-10 bg-gray-100 border w-full">KUNING@5</th>
              <th key='9' className="sticky z-10 bg-gray-100 border w-full">MANGGA@25</th>
              <th key='10' className="sticky z-10 bg-gray-100 border w-full">MANGGA@10</th>
              <th key='11' className="sticky z-10 bg-gray-100 border w-full">BROPRE</th>
              <th key='12' className="sticky z-10 bg-gray-100 border w-full">MKPRE</th>
              <th key='13' className="sticky z-10 bg-gray-100 border w-full">MENIR</th>
              <th key='14' className="sticky z-10 bg-gray-100 border w-full">EKONOMI</th>
              <th key='15' className="sticky z-10 bg-gray-100 border w-full">REJECT</th>
              <th key='16' className="sticky z-10 bg-gray-100 border w-full">LEBAH25</th>
              <th key='17' className="sticky z-10 bg-gray-100 border w-full">LEBAH10</th>
              <th key='18' className="sticky z-10 bg-gray-100 border w-full">BROKEN</th>
              <th key='19' className="sticky z-10 bg-gray-100 border w-full">MENIR KIBI</th>
              <th key='21' className="sticky z-10 bg-gray-100 border w-full">KATUL</th>
              <th key='22' className="sticky z-10 bg-gray-100 border w-full">MENDANG</th>
              <th key='23' className="sticky z-10 bg-gray-100 border w-full">POLOS</th>
              <th key='24' className="sticky z-10 bg-gray-100 border w-full">MURMER</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* hasil produksi */}
            {
              hasilProduksi.hasil_produksi.map((row, idx) => (
                <tr>
                  <td className='text-left'>{row.tanggal}</td>
                  <td>{(row.bahan_giling * 50).toLocaleString('id-ID')}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 3)?.total ? (row.hasil_produksi.find(item => item.product_id === 3)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 4)?.total ? (row.hasil_produksi.find(item => item.product_id === 4)?.total * 10).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 5)?.total ? (row.hasil_produksi.find(item => item.product_id === 5)?.total * 5).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 6)?.total ? (row.hasil_produksi.find(item => item.product_id === 6)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 7)?.total ? (row.hasil_produksi.find(item => item.product_id === 7)?.total * 10).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 8)?.total ? (row.hasil_produksi.find(item => item.product_id === 8)?.total * 5).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 26)?.total ? (row.hasil_produksi.find(item => item.product_id === 26)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 27)?.total ? (row.hasil_produksi.find(item => item.product_id === 27)?.total * 10).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 28)?.total ? (row.hasil_produksi.find(item => item.product_id === 28)?.total * 5).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 9)?.total ? (row.hasil_produksi.find(item => item.product_id === 9)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 10)?.total ? (row.hasil_produksi.find(item => item.product_id === 10)?.total * 10).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 11)?.total ? (row.hasil_produksi.find(item => item.product_id === 11)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 12)?.total ? (row.hasil_produksi.find(item => item.product_id === 12)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 13)?.total ? (row.hasil_produksi.find(item => item.product_id === 13)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 14)?.total ? (row.hasil_produksi.find(item => item.product_id === 14)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 15)?.total ? (row.hasil_produksi.find(item => item.product_id === 15)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 16)?.total ? (row.hasil_produksi.find(item => item.product_id === 16)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 17)?.total ? (row.hasil_produksi.find(item => item.product_id === 17)?.total * 10).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 18)?.total ? (row.hasil_produksi.find(item => item.product_id === 18)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 19)?.total ? (row.hasil_produksi.find(item => item.product_id === 19)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 24)?.total ? (row.hasil_produksi.find(item => item.product_id === 24)?.total * 1).toLocaleString('id-ID') : "-"}</td> {/* katul*/}
                  <td>{row.hasil_produksi.find(item => item.product_id === 25)?.total ? (row.hasil_produksi.find(item => item.product_id === 25)?.total * 1).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 22)?.total ? (row.hasil_produksi.find(item => item.product_id === 22)?.total * 25).toLocaleString('id-ID') : "-"}</td>
                  <td>{row.hasil_produksi.find(item => item.product_id === 23)?.total ? (row.hasil_produksi.find(item => item.product_id === 23)?.total * 50).toLocaleString('id-ID') : "-"}</td>
                </tr>
              ))
            }
            {
              Array.from({ length: Math.max(0, 9 - hasilProduksi.hasil_produksi.length) }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  {Array.from({ length: 26 }).map((_, cellIdx) => (
                    <td key={cellIdx} className="border border-gray-800 h-[40px] bg-gray-50">&nbsp;</td>
                  ))}
                </tr>
              ))
            }
            {/* total */}
            <tr className='sticky bottom-8 bg-[#d5d5d5] z-10 font-bold'>
              <td className="left-0 border p-2 text-center bg-white z-20">TOTAL</td>
              <td className="border p-2 text-center">{(hasilProduksi.total_bahan_giling * 50).toLocaleString('id-ID')}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 3)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 3)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 4)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 4)?.total * 10).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 5)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 5)?.total * 5).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 6)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 6)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 7)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 7)?.total * 10).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 8)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 8)?.total * 5).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 26)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 26)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 27)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 27)?.total * 10).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 28)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 28)?.total * 5).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 9)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 9)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 10)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 10)?.total * 10).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 11)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 11)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 12)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 12)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 13)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 13)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 14)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 14)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 15)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 15)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 16)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 16)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 17)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 17)?.total * 10).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 18)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 18)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 19)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 19)?.total * 50).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 24)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 24)?.total * 1).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 25)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 25)?.total * 1).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 22)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 22)?.total * 25).toLocaleString('id-ID') : "-"}</td>
              <td>{hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 23)?.total ? (hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 23)?.total * 50).toLocaleString('id-ID') : "-"}</td>

            </tr>
            {/* presentase */}
            <tr className='sticky bottom-0 bg-[#d5d5d5] bg-white z-10 font-bold'>
              <td className="left-0 border text-center bg-white z-20">PRESENTASE</td>
              <td className="border text-center"></td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 3)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 3).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 4)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 4).total * 10) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 5)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 5).total * 5) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 6)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 6).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 7)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 7).total * 10) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 8)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 8).total * 5) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 26)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 26).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 27)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 27).total * 10) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 28)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 28).total * 5) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 9)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 9).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 10)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 10).total * 10) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 11)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 11).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 12)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 12).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 13)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 13).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 14)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 14).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 15)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 15).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 16)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 16).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 17)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 17).total * 10) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 18)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 18).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 19)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 19).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 24)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 24).total * 1) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 25)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 25).total * 1) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 22)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 22).total * 25) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
              <td>
                {
                  hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 23)
                    ? (((hasilProduksi.total_hasil_produksi_tiap_produk.find(item => item.product_id === 23).total * 50) / (hasilProduksi.total_bahan_giling * 50)) * 100).toFixed(1) + '%'
                    : "-"
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='mx-20 my-5 flex justify-between'>
        <div className=''>
          <p>SISA DALAM SILO (BAHAN GILING - (TOTAL HASIL PRODUKSI - TOTAL PEMBELIAN PRODUK))</p>
          <p>= {(hasilProduksi.total_bahan_giling * 50).toLocaleString('id-ID')} - ({totalHasilProduksiKg.toLocaleString('id-ID')} - {Number(hasilProduksi.total_pembelian).toLocaleString('id-ID')}) = {((hasilProduksi.total_bahan_giling * 50) - (totalHasilProduksiKg-hasilProduksi.total_pembelian)).toLocaleString('id-ID')} kg</p>
        </div>
        <div>
          <p>TOTAL PEMBELIAN: {Number(hasilProduksi.total_pembelian).toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );

};

export default LaporanHasilProduksi;
