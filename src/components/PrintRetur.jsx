/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useMemo } from "react";

const PrintRetur = forwardRef(({ data }, ref) => {

  const produkBerat = [
    { product_id: 3, beratKemasan: 25, nama: "BERAS @ 25 KG HIJAU", merk: "PUTRI SEJATI" },
    { product_id: 4, beratKemasan: 10, nama: "BERAS @ 10 KG HIJAU", merk: "PUTRI SEJATI" },
    { product_id: 5, beratKemasan: 5, nama: "BERAS @ 5 KG HIJAU", merk: "PUTRI SEJATI" },
    { product_id: 7, beratKemasan: 10, nama: "BERAS @ 10 KG MERAH", merk: "PUTRI SEJATI" },
    { product_id: 8, beratKemasan: 5, nama: "BERAS @ 5 KG MERAH", merk: "PUTRI SEJATI" },
    { product_id: 11, beratKemasan: 50, nama: "BROKEN PREMIUM", merk: "POLOS" },
    { product_id: 12, beratKemasan: 50, nama: "BRONIR PREMIUM", merk: "POLOS" },
    { product_id: 14, beratKemasan: 25, nama: "BIG BROKEN EKONOMI", merk: "POLOS" },
    { product_id: 20, beratKemasan: 10, nama: "TEPUNG BERAS", merk: "PUTRI SEJATI" },
    { product_id: 26, beratKemasan: 25, nama: "BERAS @ 25 KG KUNING", merk: "PUTRI SEJATI" },
    { product_id: 27, beratKemasan: 10, nama: "BERAS @ 10 KG KUNING", merk: "PUTRI SEJATI" },
    { product_id: 28, beratKemasan: 5, nama: "BERAS @ 5 KG KUNING", merk: "PUTRI SEJATI" },
    { product_id: 32, beratKemasan: 0.5, nama: "TEPUNG BERAS", merk: "PUTRI SEJATI" },
  ];

  // 🔥 supaya tidak find() berulang-ulang
  const produkMap = useMemo(() => {
    return Object.fromEntries(
      produkBerat.map(p => [p.product_id, p])
    );
  }, []);

  if (!data || data.length === 0) {
    return <div className="pl-10 pt-2 pb-10" ref={ref}>Tidak ada data untuk dicetak</div>;
  }

  return (
    <div ref={ref}>
      {data.map((row, index) => {

        // ✅ HITUNG TOTAL PER ROW
        const beratTotal = row.items.reduce((total, item) => {
          const produk = produkMap[item.product_id];
          if (!produk) return total;
          return total + item.amount * produk.beratKemasan;
        }, 0);

        return (
          <div
            key={index}
            style={{
              padding: "20px",
              pageBreakAfter: "always",
              fontSize: "12px",
              color: "black",
              fontFamily: "Arial"
            }}
          >
            <h2 className="text-center mb-[20px] font-bold text-[14px]">
              RETUR BARANG
            </h2>

            <table className="border-0 pb-5">
              <tr className="">
                <td className="border-0 text-left w-[20%]">Tanggal</td>
                <td className="border-0 w-2">:</td>
                <td className="border-0 text-left">{new Date(row.date).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="border-0 text-left">Kepada YTH</td>
                <td className="w-2 border-0">:</td>
                <td className="text-left border-0">
                  {
                    row.toko.split(" ").at(-1) == "GYR" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "TBNN" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "MENGWI" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "SGJ" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "KUTA" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "N2" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko.split(" ").at(-1) == "KLK" ? row.toko.split(" ").slice(0, -1).join(" ")
                      : row.toko
                  }
                </td>
              </tr>
              <tr className="">
                <td className="text-left border-0">Alamat</td>
                <td className="w-2 border-0">:</td>
                <td className="text-left border-0">
                  {
                    row.toko.split(" ").at(-1) == "GYR" ? "GIANYAR"
                      : row.toko.split(" ").at(-1) == "TBNN" ? "TABANAN"
                      : row.toko.split(" ").at(-1) == "MENGWI" ? "MENGWI"
                      : row.toko.split(" ").at(-1) == "SGJ" ? "SINGARAJA"
                      : row.toko.split(" ").at(-1) == "KUTA" ? "KUTA"
                      : row.toko.split(" ").at(-1) == "N2" ? "NUSA DUA"
                      : row.toko.split(" ").at(-1) == "KLK" ? "KLUNGKUNG"
                      : "DENPASAR"
                  }
                </td>
              </tr>
            </table>

            <table
              width="100%"
              border="1"
              cellPadding="5"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th>Jumlah (SAK)</th>
                  <th>Jenis Barang</th>
                  <th>Merk / Cap</th>
                  <th>KG</th>
                  <th>Total (KG)</th>
                </tr>
              </thead>
              <tbody>
                {row.items.map((item, i) => {
                  const produk = produkMap[item.product_id];
                  if (!produk) return null;

                  const totalKg = item.amount * produk.beratKemasan;

                  return (
                    <tr key={i}>
                      <td align="center">{item.amount}</td>
                      <td>{produk.nama}</td>
                      <td align="center">{produk.merk}</td>
                      <td align="center">{produk.beratKemasan}</td>
                      <td align="center">{totalKg}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p style={{ textAlign: "right", marginTop: "15px" }}>
              <strong>Berat total: {beratTotal} KG</strong>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
              <div>
                <p>Sopir</p>
                <p className="pt-7">________</p>
              </div>
              <div>
                <p>Admin</p>
                <p className="pt-7">________</p>
              </div>
              <div>
                <p>Pelanggan</p>
                <p className="pt-7">__________</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default PrintRetur;
