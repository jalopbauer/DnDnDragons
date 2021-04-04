import { useEffect, useState } from 'react';
import useGet from '../../services/useGet';
import authHeader from '../../services/authHeader';
import { Box, List, Paper, Grid, Divider } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import rpc from './RacePanelFunctions';

const API_URL = "http://localhost:8080/api";

const RacePanel = () => {
  const {data: races, isLoading, error} = useGet(`${API_URL}/character/creator/races`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(17);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
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
                  race.source === 'PHB' ? (
                    <ListItem
                      button
                      selected={selectedIndex === index}
                      onClick={(event) => handleListItemClick(event, index)}
                      key={index}
                    >
                      <ListItemText primary={race.name} secondary={race.source} />
                    </ListItem> 
                  ) : (
                    null
                  )
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box>
            {races && (
              <div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <h2>{races[selectedIndex].name}</h2>
                  <h2>Source: {races[selectedIndex].source}</h2>
                </div>
                {rpc.showSelectedRaceAbilityModifiers(races[selectedIndex])}
                <p><b>Size:</b> {races[selectedIndex].size}</p>
                {rpc.showSelectedRaceSpeed(races[selectedIndex])}
                <Divider/>
                {rpc.getSelectedRaceEntries(races[selectedIndex])}
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default RacePanel;