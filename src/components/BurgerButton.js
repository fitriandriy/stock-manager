import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useApp } from "../context";
import MenuIcon from '@mui/icons-material/Menu';

export default function PositionedMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setUser, setIsAuthenticated } = useApp();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("warehouse");
    setIsAuthenticated(false);
    setUser("");
    navigate("/login");
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon className='font-[24px] text-[#3b3b3b]'></MenuIcon>
      </Button>
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
        <MenuItem onClick={() => navigate("/home")}>BAHAN</MenuItem>
        <MenuItem onClick={() => navigate("/produk")}>PRODUK</MenuItem>
        <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
      </Menu>
    </div>
  );
}
