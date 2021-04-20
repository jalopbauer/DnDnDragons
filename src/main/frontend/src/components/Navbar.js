import { Link } from 'react-router-dom';
import { useState} from 'react';
import {Box, Icon, IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const optionsLogged = [
  {path: "/", text: "Home"},
  {path: "/profile", text: "Profile"}
];

const optionsNotLogged = [
  {path: "/login", text: "Log In"},
  {path: "/signup", text: "Sign Up"}
];

const Navbar = ({currentPage, currentUser, handleLogout}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <Typography variant="h2">
          DnD&amp;Dragons{currentPage} 
        </Typography>
      </Link>
      <div className="menu">
        <IconButton
          onClick={handleClick}
        >
          <MenuIcon fontSize="large"/>
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          disableRestoreFocus={true}
          PaperProps={{
            style: {
              width: '20ch',
            },
          }}
        >
          { currentUser && optionsLogged.map((option) => (
            <MenuItem key={option.text} onClick={handleClose}>
              <Link to={option.path} style={{ textDecoration: 'none' }}>
                {option.text}
              </Link>
            </MenuItem>
          ))}
          { currentUser && <MenuItem><a 
            href="/" 
            onClick={handleLogout}
            style={{ textDecoration: 'none' }}>
              Log Out
            </a></MenuItem>}
          { !currentUser && optionsNotLogged.map((option) => (
            <MenuItem key={option.text} onClick={handleClose}>
              <Link to={option.path} style={{ textDecoration: 'none' }}>{option.text}</Link>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </nav>
  );
} 

export default Navbar