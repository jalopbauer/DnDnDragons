import { Link } from 'react-router-dom';
import { useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';

const optionsLogged = [
  {path: "/", text: "Home"},
  {path: "/profile", text: "Profile"}
];

const optionsNotLogged = [
  {path: "/login", text: "Log In"},
  {path: "/signup", text: "Sign Up"}
];

const Navbar = ({currentUser, handleLogout}) => {
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
      <Link to="/"><h1 style={{fontSize: '200%'}}>DnD&amp;Dragons</h1></Link>
      <div className="menu">
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon />
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