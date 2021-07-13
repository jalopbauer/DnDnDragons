import { useState, useEffect } from 'react';

import RacePanel from './RacePanel';
import BackgroundPanel from './BackgroundPanel';
import AbilityScoresPanel from './AbilityScoresPanel';
import ClassPanel from './ClassPanel';
import axios from "axios";
import { Box, Button, Typography, Modal, Paper } from "@material-ui/core";
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

const CharacterCreator = ({setCurrentPage, editingCharacter}) => {
  const [showNameisEmpty, setShowNameIsEmpty] = useState(false);
  const [character, setCharacter] = useState(editingCharacter ? editingCharacter : {"alignment": "True Neutral"});
  const [tabValue, setTabValue] = useState(0);
  const [openPopup, setOpenPopup] = useState(true);
  const [raceBackgroundModifiers, setRaceBackgroundModifiers] = useState([0, 0, 0, 0, 0, 0]);

  let history = useHistory()

  useEffect(() => setCurrentPage(": Character Creator"));

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

  const setCharacterClass = (hitDice, className, savingThrows) => {
    if(character.abilityScores) {
      let characterCopy = Object.assign({}, character);
      // let characterCopy = character;
      const constModifier = Math.floor((Number(character.abilityScores[2]) - 10)/2);
      characterCopy.hp = hitDice + constModifier;
      characterCopy.characterClass = className;
      characterCopy.savingThrows = savingThrows;
      setCharacter(characterCopy);
    }
  }

  const createCharacter = () => {
    character.userId = JSON.parse(localStorage.getItem('user')).id;
    character.username = JSON.parse(localStorage.getItem('user')).username;
    axios.post(`${API_URL}/character/`, character, {'Content-Type': 'application/json'})
    .then((response) => {
      console.log(response);
      console.log('Character created successfully!');
      history.push('/profile');
    }).catch((err) => console.log(err.message));
  } 

  return (
    <div className="character-creator">
      <Box
        style={{
          backgroundColor: "#333",
          padding: "5px"
        }}
      >
        <Typography>Selected options</Typography>
        <Typography>Name: {character.name}</Typography>
        <Typography>Alignment: {character.alignment}</Typography>
        <Typography>Race: {character.race}</Typography>
        <Typography>Background: {character.background}</Typography>
        <Typography>Ability Scores: { character.abilityScores ? character.abilityScores.join(', ') : ''}</Typography>
        <Typography>Class: {character.characterClass}</Typography>
      </Box>
      <TabPanel value={tabValue} index={0} >
        <Modal
          open={openPopup}
          onClose={handleCancel}
        >
          <div className="popup-content">
            <Typography className="title" variant="h4">Character Creator</Typography>
            <div className="field">
              <Typography style={{fontSize: 26}}>Character name: </Typography>
              <input  
                required
                maxLength="25"
                onChange={(e) => setCharacterName(e.target.value)}
                style={{fontSize: 24}}
              />
              {showNameisEmpty && <p className="required-message">This field is required</p>}
            </div>
            <div className="field">
              <Typography style={{fontSize: 26}}>Alignment: </Typography>
              <select
                value={character.alignment}
                onChange={(e) => setCharacterAlignment(e.target.value)}
                style={{fontSize: 24}}
              >
                <option>Lawful Good</option>
                <option>Neutral Good</option>
                <option>Chaotic Good</option>
                <option>Lawful Neutral</option>
                <option>True Neutral</option>
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
                <Typography style={{fontSize: 24}}>Cancel</Typography>
              </Button>
              <Button
                onClick={handleContinue}
              >
                <Typography style={{fontSize: 24}}>Continue</Typography>
              </Button>
            </Box>
          </div>
        </Modal>
        <RacePanel
          setCharacterRacePanel={setCharacterRacePanel}
          setRaceBackgroundModifiers={setRaceBackgroundModifiers}
          setTabValue={setTabValue}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BackgroundPanel
          setCharacterBackground={setCharacterBackground}
          setTabValue={setTabValue}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AbilityScoresPanel
          raceBackgroundScores={raceBackgroundModifiers}
          setCharacterAbilityScores={setCharacterAbilityScores}
          setTabValue={setTabValue}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ClassPanel 
          setCharacterClass={setCharacterClass}
          handleCharacter={createCharacter}
          editingCharacterClass={0}
          setTabValue={setTabValue}
        />
      </TabPanel>
    </div>    
  );
};

export default CharacterCreator;