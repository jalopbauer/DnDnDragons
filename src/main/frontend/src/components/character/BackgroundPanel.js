import { useState } from 'react';
import useGet from '../../services/useGet';
import authHeader from '../../services/authHeader';
import { Box, List, Paper, Grid, Divider } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import rpc from './RacePanelFunctions';

const API_URL = "http://localhost:8080/api";

const BackgroundPanel = () => {
  const {data: backgrounds, isLoading, error} = useGet(`${API_URL}/character/creator/background`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(0);

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
            { !isLoading && 
              <Paper style={{maxHeight: 650, overflow: 'auto'}}>
                <List>
                  { backgrounds && backgrounds.map((background, index) => (
                    background.source === 'PHB' ? (
                      <ListItem
                        button
                        selected={selectedIndex === index}
                        onClick={(event) => handleListItemClick(event, index)}
                        key={index}
                      >
                        <ListItemText primary={background.name} secondary={background.source} />
                      </ListItem> 
                    ) : (
                      null
                    )
                  ))}
                </List>
              </Paper>
            }
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Box>
            { backgrounds && (
              <div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <h2>{backgrounds[selectedIndex].name}</h2>
                  <h2>Source: {backgrounds[selectedIndex].source}</h2>
                </div>
                <Divider/>
                {rpc.handleElements(backgrounds[selectedIndex].entries)}
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default BackgroundPanel;