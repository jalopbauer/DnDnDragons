import { useState } from 'react';
import useGet from '../../services/useGet';
import authHeader from '../../services/authHeader';
import { Box, List, Paper, Grid } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const API_URL = "http://localhost:8080/api";

const RaceBackgroundPanel = () => {
  const {data: races, isLoading, error} = useGet(`${API_URL}/character/creator/races`, { headers: authHeader() });
  // const [selectedRace, setSelectedRace] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    // setSelectedRace(event.currentTarget.innerText);
    setSelectedIndex(index);
  };

  const showSelectedRaceSpeed = () => {
    const speed = races[selectedIndex].speed;

    if(!speed) {
      return;
    }

    if(typeof(speed) !== 'object') {
      return <p>Speed: {speed}</p>;
    }

    const keys = Object.keys(speed);
    const values = Object.values(speed);
    const array = [];
    for (var i = 0; i < keys.length; i++) {
      const upperCaseKey = keys[i].charAt(0).toUpperCase() + keys[i].slice(1) + 'ing';
      array[i] = <p key={i}>{upperCaseKey} speed: {values[i]}</p>;
    }
    return array;
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Box>
            { error && <div>{ error }</div>}
            { isLoading && <div>Loading...</div>}
            <Paper style={{maxHeight: 650, overflow: 'auto'}}>
              <List>
                { races && races.map((race, index) => (
                  <ListItem
                    button
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                    key={index}
                  >
                    <ListItemText primary={race.name} secondary={race.source} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box>
            {races && (
              <div>
                <h2>{races[selectedIndex].name}</h2>
                <h3>Source: {races[selectedIndex].source}</h3>
                <p>Size: {races[selectedIndex].size}</p>
                {showSelectedRaceSpeed()}
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default RaceBackgroundPanel;