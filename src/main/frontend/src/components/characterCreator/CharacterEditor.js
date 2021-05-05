import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import RacePanel from './RacePanel';
import BackgroundPanel from './BackgroundPanel';
import AbilityScoresPanel from './AbilityScoresPanel';
import ClassPanel from './ClassPanel';
import axios from "axios";
import { Box, Button, Typography, Modal } from "@material-ui/core";
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

const CharacterEditor = ({setCurrentPage}) => {
  const { id: characterId } = useParams(); 

  const [showNameisEmpty, setShowNameIsEmpty] = useState(false);
  let { data: character, isLoading, error } = useGet(`${API_URL}/character/${characterId}`, { headers: authHeader() });
  const [raceBackgroundModifiers, setRaceBackgroundModifiers] = useState([0, 0, 0, 0, 0, 0]);
  const [tabValue, setTabValue] = useState(0);
  const [openPopup, setOpenPopup] = useState(true);

  let history = useHistory()

  useEffect(() => setCurrentPage(": Character Editor"));

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
    character.name = name;
  }

  const setCharacterAlignment = (alignment) => {
    character.alignment = alignment;
  }

  const setCharacterRacePanel = (race, speed) => {
    character.race = race;
    character.speed = speed;
  }

  const setCharacterBackground = (background, skillProficiencies, equipment) => {
    character.background = background;
    character.skillProficiencies = skillProficiencies;
    character.equipment = equipment;
  }

  const setCharacterAbilityScores = (abilityScores) => {
    character.abilityScores = abilityScores;
  }

  const setCharacterClass = (hitDice, className, savingThrows) => {
    const constModifier = Math.floor((Number(character.abilityScores[2]) - 10)/2);
    character.hp = hitDice + constModifier;
    character.characterClass = className;
    character.savingThrows = savingThrows;
  }

  const getScoresWithoutRaceBackgroundModifiers = () => {
    const array = [];
    character.abilityScores.map((score, index) => {
      array.push(score - raceBackgroundModifiers[index]);
    });
    return array;
  }

  const updateCharacter = () => {
    character.userId = JSON.parse(localStorage.getItem('user')).id;
    character.username = JSON.parse(localStorage.getItem('user')).username;
    axios.put(`${API_URL}/character/edit/${characterId}`, character)
    .then((response) => {
      console.log(response);
      console.log('Character updated successfully!');
      history.push('/profile');
    }).catch((err) => console.log(err.message));
  } 

  return (
    <div className="character-creator">
      {!isLoading &&
      <div>
      <AppBar className="character-creator-appbar" position="static" color="default">
        <Tabs
          className="character-creator-tabs"
          value={tabValue}
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
                maxLength="25"
                defaultValue={character.name}
                onChange={(e) => setCharacterName(e.target.value)}
              />
              {showNameisEmpty && <p className="required-message">This field is required</p>}
            </div>
            <div className="field">
              <Typography>Alignment: </Typography>
              <select
                defaultValue={character.alignment}
                onChange={(e) => setCharacterAlignment(e.target.value)}
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
          editingCharacterRace={character.race}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BackgroundPanel
          setCharacterBackground={setCharacterBackground}
          editingCharacterBackground={character.background}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AbilityScoresPanel
          raceBackgroundScores={raceBackgroundModifiers}
          setCharacterAbilityScores={setCharacterAbilityScores}
          editingCharacterScores={getScoresWithoutRaceBackgroundModifiers(character.abilityScores)}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ClassPanel 
          setCharacterClass={setCharacterClass}
          handleCharacter={updateCharacter}
          editingCharacterClass={character.characterClass}
        />
      </TabPanel>
      </div>}
    </div>    
  );
};

export default CharacterEditor;