import { useState } from 'react';
import useGet from '../../services/useGet';
import authHeader from '../../services/authHeader';
import { Box, List, Paper } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const API_URL = "http://localhost:8080/api";

const RaceBackgroundPanel = () => {
  const {data: races, isLoading, error} = useGet(`${API_URL}/character/creator/races`, { headers: authHeader() });
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedRace(event.currentTarget.innerText);
    setSelectedIndex(index);
  };

  return (
    <div>
      <Box p={3}>
        { error && <div>{ error }</div>}
        { isLoading && <div>Loading...</div>}
        <Paper style={{maxHeight: 500, overflow: 'auto'}}>
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
      <h2>{selectedRace}</h2>
    </div>
  );
}

export default RaceBackgroundPanel;