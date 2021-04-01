import { useState, useStyles } from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const CharacterCreator = () => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('Fighter');
  const [level, setLevel] = useState('');
  
  const url = "http://localhost:8080/api/character/";
  const character = {name, characterClass, level};
  const headers = {'Content-Type': 'application/json'};
  // const [response, handlePost] = usePost({url, payload: character, headers, entity: "character"});

  const classes = makeStyles((theme) => ({
      root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
      },
    }));
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    // <div className="create-character">
    <div className={classes.root}>
      <h2>Character creator</h2>


      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>


      {/* <form onSubmit={(e) => {e.preventDefault(); handlePost();}}>
        <label>Name</label>
        <input 
          type="text" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Class</label>
        <select
          value={characterClass}
          onChange={(e) => setCharacterClass(e.target.value)}
        >
          <option value="Fighter">Fighter</option>
          <option value="Ranger">Ranger</option>
          <option value="Elf">Elf</option>
          <option value="Monk">Monk</option>
          <option value="Wizard">Wizard</option>
        </select>
        <label>Level</label>
        <input 
          type="number"
          min="1"
          max="20" 
          required 
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        {!response.isLoading && <button>Create character</button>}
        {response.isLoading && <button disabled>Adding character...</button>}
      </form> */}
    </div>    
  );
};

export default CharacterCreator;