import { useState, useEffect } from 'react';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import { Box, List, ListItem, ListItemText, Paper, Grid, Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import helperFunctions from './HelperFunctions';
import { v4 as uuidv4 } from 'uuid';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const API_URL = "http://localhost:8080/api";

const RacePanel = ({setCharacterRacePanel, setRaceBackgroundModifiers, editingCharacterRace, setTabValue}) => {
  const {data: races, isLoading, error} = useGet(`${API_URL}/character/creator/race`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(editingCharacterRace ? helperFunctions.getRaceIndex(editingCharacterRace) : 17);

  useEffect(() => {
    if(!editingCharacterRace) {
      setCharacterRacePanel("Dragonborn", 30);
    }
  }, []);

  const handleListItemClick = (index) => {
    const abilityScores = [0, 0, 0, 0, 0, 0];
    Object.entries(races[index].ability[0]).map((entry) => {
      switch(entry[0]) {
        case 'str':
          abilityScores[0] = entry[1];
          break;
        case 'dex':
          abilityScores[1] = entry[1];
          break;
        case 'con':
          abilityScores[2] = entry[1];
          break;
        case 'int':
          abilityScores[3] = entry[1];
          break;
        case 'wis':
          abilityScores[4] = entry[1];
          break;
        case 'cha':
          abilityScores[5] = entry[1];
          break;
      }
    });
    setRaceBackgroundModifiers(abilityScores);
    setCharacterRacePanel(races[index].name, races[index].speed);
    setSelectedIndex(index);
  };

  const raceList = () => {
    return (
      <Paper>
        <List className="character-creator-list">
          {races && races.map((race, index) => (
            race.source === 'PHB' &&
            <ListItem
              key={uuidv4()}
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(index)}
            >
              <ListItemText 
                key={uuidv4()}
                className="character-creator-list-text"
                disableTypography
                primary={<Typography key={uuidv4()}><b>{race.name}</b></Typography>} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  const selectedRaceDetails = () => {
    return (
      <div>
        <div className="character-creator-title">
          <Typography 
            variant="h2" 
            className="character-creator-yellow-name"
          >
            {races[selectedIndex].name}
          </Typography>
          <Typography 
            variant="h4"
            className="character-creator-source"
          >
            Source: {races[selectedIndex].source}
          </Typography>
        </div>
        {helperFunctions.showSelectedRaceAbilityModifiers(races[selectedIndex])}
        <Typography align="justify">
          <b>Size:</b> {races[selectedIndex].size} <br/>
          <b>Speed:</b> {races[selectedIndex].speed}
        </Typography>
        <Box className="character-creator-yellow-divider" my={1}/>
        {helperFunctions.handleElements(races[selectedIndex].entries)}
      </div>
    );
  }

  return (
    <div>
      <AppBar className="character-creator-appbar" elevation={0} position="static" color="default">
        <Tabs
          style={{backgroundColor: "#333", marginBottom: "20px"}}
          className="character-creator-tabs"
          onChange={(event) => setTabValue(1)}
          centered
        >
          <Tab disabled/>
          <Tab 
            className="character-creator-tab" 
            style={{float: "right"}}
            icon={<NavigateNextIcon/>} 
            label={`${editingCharacterRace ? 'Update' : 'Choose'} background`} 
          />
        </Tabs>
      </AppBar>
      { error && <div>{ error }</div>}
      { isLoading && <div>Loading...</div>}
      { !isLoading &&
      <Grid container spacing={3}>  
        {}
        <Grid item xs={2}>
          {raceList()}
        </Grid>
        <Grid item xs={10}>
          {selectedRaceDetails()}
        </Grid>
      </Grid>
      }
    </div>
  );
}

export default RacePanel;