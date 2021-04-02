import { useState, useStyles } from 'react';

import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RaceBackgroundPanel from './RaceBackgroundPanel';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}


const CharacterCreator = () => {
  // const [name, setName] = useState('');
  // const [characterClass, setCharacterClass] = useState('Fighter');
  // const [level, setLevel] = useState('');
  
  // const url = "http://localhost:8080/api/character/";
  // const character = {name, characterClass, level};
  // const headers = {'Content-Type': 'application/json'};
  // const [response, handlePost] = usePost({url, payload: character, headers, entity: "character"});

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="create-character">
      <h2>Character creator</h2>

      <AppBar className="create-character-appbar" position="static" color="default">
        <Tabs
          // style={{minWidth: '5000px'}}
          className="character-creator-tabs"
          value={value}
          // indicatorColor="primary"
          // textColor="primary"
          onChange={handleChange}
          centered
        >
          <Tab className="character-creator-tab" label="Race & Background" />
          <Tab className="character-creator-tab" label="Ability Scores" />
          <Tab className="character-creator-tab" label="Class" />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} >
        <RaceBackgroundPanel />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>


     



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