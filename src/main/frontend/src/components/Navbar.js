import { Link } from 'react-router-dom';
import { useState} from 'react';
import {IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { v4 as uuidv4 } from 'uuid';

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
              backgroundColor: '#333',
            },
          }}
        >
          { currentUser && optionsLogged.map((option) => (
            <Link 
              key={uuidv4()} 
              to={option.path} 
              style={{ color: '#d0d0d0', textDecoration: 'none' }}
            >
              <MenuItem onClick={handleClose}>
                {option.text}
              </MenuItem>
            </Link>
          ))}
          { currentUser && 
            <a 
              href="/" 
              onClick={handleLogout}
              style={{ color: '#d0d0d0', textDecoration: 'none', fontFamily: "Roboto" }}
            >
              <MenuItem> Log Out </MenuItem>
            </a>
          }
          { !currentUser && optionsNotLogged.map((option) => (
            <Link 
              key={uuidv4()}
              to={option.path} 
              style={{ color: '#d0d0d0', textDecoration: 'none' }}
            >
              <MenuItem onClick={handleClose}>
                {option.text}
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </div>
    </nav>
  );
} 

export default Navbar