import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";
import PositionedMenu from "../components/BurgerButton"
import { useApp } from "../context";
import { jwtDecode } from "jwt-decode";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setIsAuthenticated } = useApp();
  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorElBahan, setAnchorElBahan] = React.useState(null);
  const [anchorElProduk, setAnchorElProduk] = React.useState(null);
  const [anchorElLaporan, setAnchorElLaporan] = React.useState(null);
  const [anchorElRetur, setAnchorElRetur] = React.useState(null);

  const token = localStorage.getItem("token");
  let role = "";

  if (token) {
    try {
      role = jwtDecode(token).role;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const handleClick = (setAnchorEl) => (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (setAnchorEl) => () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser("");
    navigate("/login");
  };

  return (
    <div className="py-3 pl-5 lg:px-20">
      {
        role === 'superadmin' ?
          <div className="flex justify-between">
            <div className="flex gap-5">
              <img src="./assets/icon.png" className="h-[25px] w-50px lg:w-[100px] lg:h-[25px]" alt="" />
              <nav className="flex lg:gap-10 ml-10 font-bold text-zinc-600">
                {/* BAHAN */}
                <div>
                  <p
                    className={`cursor-pointer ${
                      ["/home", "/laporan"].includes(location.pathname)
                        ? "underline text-blue-600"
                        : ""
                    }`}
                    onClick={handleClick(setAnchorElBahan)}
                  >
                    BAHAN
                  </p>
                  <Menu
                    className="mt-8"
                    anchorEl={anchorElBahan}
                    open={Boolean(anchorElBahan)}
                    onClose={handleClose(setAnchorElBahan)}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem onClick={() => navigate("/home")}>Input Data</MenuItem>
                    <MenuItem onClick={() => navigate("/laporan")}>Stok Bahan</MenuItem>
                  </Menu>
                </div>

                {/* PRODUCT */}
                <div>
                  <p
                    className={`cursor-pointer ${
                      ["/produk", "/laporan-produk"].includes(location.pathname)
                        ? "underline text-blue-600"
                        : ""
                    }`}
                    onClick={handleClick(setAnchorElProduk)}
                  >
                    PRODUCT
                  </p>
                  <Menu
                    className="mt-8"
                    anchorEl={anchorElProduk}
                    open={Boolean(anchorElProduk)}
                    onClose={handleClose(setAnchorElProduk)}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem onClick={() => navigate("/produk")}>Input Data</MenuItem>
                    <MenuItem onClick={() => navigate("/pembelian")}>Input Pembelian</MenuItem>
                    <MenuItem onClick={() => navigate("/laporan-produk")}>Stok Produk</MenuItem>
                  </Menu>
                </div>

                {/* RETUR */}
                <div>
                  <p
                    className={`cursor-pointer ${
                      ["/retur", "/input-retur", "/retur-penjualan"].includes(location.pathname)
                        ? "underline text-blue-600"
                        : ""
                    }`}
                    onClick={handleClick(setAnchorElRetur)}
                  >
                    RETUR
                  </p>
                  <Menu
                    className="mt-8"
                    anchorEl={anchorElRetur}
                    open={Boolean(anchorElRetur)}
                    onClose={handleClose(setAnchorElRetur)}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem onClick={() => navigate("/input-retur")}>Input Retur</MenuItem>
                    <MenuItem onClick={() => navigate("/retur-penjualan")}>Retur Penjualan</MenuItem>
                    <MenuItem onClick={() => navigate("/retur")}>Retur Gudang</MenuItem>
                  </Menu>
                </div>

                {/* LAPORAN */}
                <div>
                  <p
                    className={`cursor-pointer ${
                      ["/proses-produksi", "/laporan-hasil-produksi", "/fullskill"].includes(location.pathname)
                        ? "underline text-blue-600"
                        : ""
                    }`}
                    onClick={handleClick(setAnchorElLaporan)}
                  >
                    LAPORAN
                  </p>
                  <Menu
                    className="mt-8"
                    anchorEl={anchorElLaporan}
                    open={Boolean(anchorElLaporan)}
                    onClose={handleClose(setAnchorElLaporan)}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <MenuItem onClick={() => navigate("/proses-produksi")}>Proses Produksi</MenuItem>
                    <MenuItem onClick={() => navigate("/laporan-hasil-produksi")}>Hasil Produksi</MenuItem>
                  </Menu>
                </div>
              </nav>
            </div>
            <div className="flex gap-5">
              <div className="flex gap-1">
                <img src="./assets/exit.png" className="w-7" alt="" />
                <p className="cursor-pointer" onClick={handleLogout}>EXIT</p>
              </div>
              <div className="flex gap-1">
                <img src="./assets/profile-icon.png" className="w-8" alt="" />
                <p>{user ? user.toUpperCase() : ""}</p>
              </div>
            </div>
          </div>
        :
          <div className="flex justify-between items-center">
            <img src="./assets/icon.png" className="h-[20px] w-50px lg:w-[100px] lg:h-[25px]" alt="" />
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                <img src="./assets/profile-icon.png" className="w-8 h-6" alt="" />
                <p className="text-[18px] font-semibold">{user ? user.toUpperCase() : ""}</p>
              </div>
              <PositionedMenu></PositionedMenu>
            </div>
          </div>
      }
    </div>
  );
};

export default NavBar;
