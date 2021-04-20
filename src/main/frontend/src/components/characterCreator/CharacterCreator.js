import { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import RacePanel from './RacePanel';
import BackgroundPanel from './BackgroundPanel';
import AbilityScoresPanel from './AbilityScoresPanel';
import ClassPanel from './ClassPanel';
import axios from "axios";
import authHeader from '../services/authHeader';
import { Box, Button, Grid, IconButton, Paper, Typography, Modal, Container, Input, Link, Divider } from "@material-ui/core";
import { Redirect, Route } from 'react-router';
import { useHistory } from "react-router-dom";


const API_URL = "http://localhost:8080/api";

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

const CharacterCreator = ({setCurrentPage}) => {
  // const [name, setName] = useState('');
  // const [characterClass, setCharacterClass] = useState('Fighter');
  // const [level, setLevel] = useState('');
  
  // const url = "http://localhost:8080/api/character/";
  // const character = {name, characterClass, level};
  // const headers = {'Content-Type': 'application/json'};
  // const [response, handlePost] = usePost({url, payload: character, headers, entity: "character"});

  const [showNameisEmpty, setShowNameIsEmpty] = useState(false);
  const [character, setCharacter] = useState({"alignment": "True Neutral", "abilityScores": [0, 0, 0, 0, 0, 0]});
  const [tabValue, setTabValue] = useState(0);
  const [openPopup, setOpenPopup] = useState(true);
  const [raceBackgroundModifiers, setRaceBackgroundModifiers] = useState([0, 0, 0, 0, 0, 0]);

  let history = useHistory()

  useEffect(() => setCurrentPage(": Character Creator"));

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const handleCancel = () => {
    setOpenPopup(false); 
    history.push('/profile');
  }

  const handleContinue = () => {
    if(character.name) {
      setShowNameIsEmpty(false);
      setOpenPopup(false);
    } else {
      setShowNameIsEmpty(true);
    }
  }

  const setCharacterName = (name) => {
    let characterCopy = Object.assign({}, character);
    characterCopy.name = name;
    setCharacter(characterCopy);
  }

  const setCharacterAlignment = (alignment) => {
    let characterCopy = Object.assign({}, character);
    characterCopy.alignment = alignment;
    setCharacter(characterCopy);
  }

  const setCharacterRacePanel = (race, speed) => {
    let characterCopy = Object.assign({}, character);
    characterCopy.race = race;
    characterCopy.speed = speed;
    setCharacter(characterCopy);
  }

  const setCharacterBackground = (background, skillProficiencies, equipment) => {
    let characterCopy = Object.assign({}, character);
    characterCopy.background = background;
    characterCopy.skillProficiencies = skillProficiencies;
    characterCopy.equipment = equipment;
    setCharacter(characterCopy);
  }

  const setCharacterAbilityScores = (abilityScores) => {
    let characterCopy = Object.assign({}, character);
    characterCopy.abilityScores = abilityScores;
    setCharacter(characterCopy);
  }

  const setCharacterClass = (hitDice) => {
    let characterCopy = Object.assign({}, character);
    const constModifier = (Number(character.abilityScores[2]) - 10)/2;
    characterCopy.hp = hitDice + constModifier;
    setCharacter(characterCopy);
  }

  // const calculateRaceBackgroundModifiers = (modifiers) => {
  //   let modifiers = {"str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0};
  //   if(character.race) {
  //     Object.keys(character.race.ability[0]).map((key) => {
  //       modifiers[key] = character.race.ability[0][key];
  //     });
  //   } 
  //   return Object.values(modifiers);
  // }

  const createCharacter = () => {
    console.log(character);

    character.userId = JSON.parse(localStorage.getItem('user')).id;
    axios.post(`${API_URL}/character/`, character, {'Content-Type': 'application/json'})
    .then((response) => {
      console.log(response);
      console.log('Character created successfully!');
      history.push('/profile');
    }).catch((err) => console.log(err.message));
  } 

  return (
    <div className="character-creator">
      {/* <h1>Character creator</h1> */}

      <AppBar className="character-creator-appbar" position="static" color="default">
        <Tabs
          // style={{minWidth: '5000px'}}
          className="character-creator-tabs"
          value={tabValue}
          // indicatorColor="primary"
          // textColor="primary"
          onChange={handleTabChange}
          centered
        >
          <Tab className="character-creator-tab" label="Race" />
          <Tab className="character-creator-tab" label="Background" />
          <Tab className="character-creator-tab" label="Ability Scores" />
          <Tab className="character-creator-tab" label="Class" />
        </Tabs>
      </AppBar>

      <TabPanel value={tabValue} index={0} >
        <Modal
          open={openPopup}
          onClose={handleCancel}
        >
          <div className="popup-content">
            <Typography className="title" variant="h4">Character Creator</Typography>
            <div className="field">
              <Typography>Character name: </Typography>
              <input  
                required
                maxlength="25"
                onChange={(e) => setCharacterName(e.target.value)}
              />
              {showNameisEmpty && <p className="required-message">This field is required</p>}
            </div>
            <div className="field">
              <Typography>Alignment: </Typography>
              <select 
                // value={standardArraySelectedValues[modifier]} 
                onChange={(e) => setCharacterAlignment(e.target.value)}
              >
                <option>Lawful Good</option>
                <option>Neutral Good</option>
                <option>Chaotic Good</option>
                <option>Lawful Neutral</option>
                <option selected="selected">True Neutral</option>
                <option>Chaotic Neutral</option>
                <option>Lawful Evil</option>
                <option>Neutral Evil</option>
                <option>Chaotic Evil</option>
              </select>
            </div>
            <Box className="buttons-container" mt={3} align='center'>
              <Button 
                onClick={handleCancel}
              >
                <Typography>Cancel</Typography>
              </Button>
              <Button
                onClick={handleContinue}
              >
                <Typography>Continue</Typography>
              </Button>
            </Box>
          </div>
        </Modal>
        <RacePanel
          setCharacterRacePanel={setCharacterRacePanel}
          setRaceBackgroundModifiers={setRaceBackgroundModifiers}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BackgroundPanel
          setCharacterBackground={setCharacterBackground}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AbilityScoresPanel
          raceBackgroundScores={raceBackgroundModifiers}
          setCharacterAbilityScores={setCharacterAbilityScores}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ClassPanel 
          character={character} 
          setCharacter={setCharacter} 
          setCharacterClass={setCharacterClass}
          createCharacter={createCharacter}
        />
      </TabPanel>
    </div>    
  );
};

export default CharacterCreator;