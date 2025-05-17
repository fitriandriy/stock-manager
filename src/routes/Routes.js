import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Laporan from "../pages/Laporan";
import LaporanProduk from "../pages/LaporanProduk";
import Fullskill from "../pages/Fullskill";
import LaporanHasilProduksi from "../pages/LaporanHasilProduksi";
import Produk from "../pages/Produk";
import ProsesProduksi from "../pages/ProsesProduksi"
import PrivateRoute from "./privateRoutes";

const Router = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route exact path="/" Component={Login} />
        <Route exact path="/login" Component={Login} />
        <Route exact path="/home" element={<PrivateRoute Component={Home} />} />
        <Route exact path="/produk" element={<PrivateRoute Component={Produk} />} />
        <Route exact path="/laporan" element={<PrivateRoute Component={Laporan} />} />
        <Route exact path="/laporan-produk" element={<PrivateRoute Component={LaporanProduk} />} />
        <Route exact path="/laporan-hasil-produksi" element={<PrivateRoute Component={LaporanHasilProduksi} />} />
        <Route exact path="/proses-produksi" element={<PrivateRoute Component={ProsesProduksi} />} />
        <Route exact path="/fullskill" element={<PrivateRoute Component={Fullskill} />} />
      </Routes>
    </React.Fragment>
  );
};

export default Router;
