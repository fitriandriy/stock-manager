import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Laporan from "../pages/Laporan";
import PrivateRoute from "./privateRoutes";

const Router = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route exact path="/" Component={Login} />
        <Route exact path="/login" Component={Login} />
        <Route exact path="/home" element={<PrivateRoute Component={Home} />} />
        <Route exact path="/laporan" element={<PrivateRoute Component={Laporan} />} />
      </Routes>
    </React.Fragment>
  );
};

export default Router;
