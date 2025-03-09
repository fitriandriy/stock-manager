import React from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useApp } from "../context";

const NavBar = () => {
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useApp();
  const user = JSON.parse(localStorage.getItem("user"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser('');
    navigate('/login');
  }

  return (
    <div className="flex justify-between py-5 px-20">
      <div className="flex gap-5">
        <img src="./assets/icon.png" className="w-[100px] h-[25px]" alt=""></img>
        <nav class="flex gap-10 ml-10 font-bold text-zinc-600">
          <div>
            <p
              className="cursor-pointer"
              onClick={handleClick}
            >
              STOCK
            </p>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => navigate("/home")}>Input Data</MenuItem>
              <MenuItem onClick={() => navigate("/laporan")}>Laporan Stok</MenuItem>
            </Menu>
          </div>
          <p className="cursor-pointer" onClick={handleLogout}>EXIT</p>
        </nav>
      </div>
      <div className="flex gap-3">
        <img src="./assets/profile-icon.png" className="w-8" alt=""></img>
        <p>{user ? user.toUpperCase() : ""}</p>
      </div>
    </div>
  )
}

export default NavBar