import { useState, useEffect } from 'react';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import { Box, List, Paper, Grid, Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import helperFunctions from './HelperFunctions';
import { v4 as uuidv4 } from 'uuid';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const API_URL = "http://localhost:8080/api";

const BackgroundPanel = ({setCharacterBackground, editingCharacterBackground, setTabValue}) => {
  const {data: backgrounds, isLoading, error} = useGet(`${API_URL}/character/creator/background`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(editingCharacterBackground ? helperFunctions.getBackgroundIndex(editingCharacterBackground) : 0);

  useEffect(() => {
    if(!editingCharacterBackground) {
      setCharacterBackground(
        "Acolyte", 
        ["Insight", "Religion"], 
        ["A holy symbol (a gift to you when you entered the priesthood)",
          "A prayer book or prayer wheel",
          "5 sticks of incense",
          "Vestments",
          "A set of common clothes",
          "A belt pouch containing 15 gp"
        ]
      );
    }
  }, []);

  const handleListItemClick = (index) => {
    const items = backgrounds[index].entries[0].items;
    const skillProficiencies = items[0].entry.split(", ");
    const equipment = items[items.length-1].entry.split(",")
    equipment.slice(1).map((entry, index) => {
      if(index == equipment.length-2) {
        equipment[index+1] = entry.charAt(5).toUpperCase() + entry.slice(6);
      } else {
        equipment[index+1] = entry.charAt(1).toUpperCase() + entry.slice(2);
      }
    })
    setCharacterBackground(backgrounds[index].name, skillProficiencies, equipment);
    setSelectedIndex(index);
  };

  const backgroundList = () => {
    return (
      <Paper>
        <List className="character-creator-list">
          {backgrounds.map((background, index) => (
            background.source === 'PHB' &&
            <ListItem
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(index)}
              key={uuidv4()}
            >
              <ListItemText 
                key={uuidv4()} 
                className="character-creator-list-text"
                disableTypography
                primary={<Typography><b>{background.name}</b></Typography>} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  const selectedBackgroundDetails = () => {
    return (
      <div>
        <div className="character-creator-title">
          <Typography 
            variant="h2" 
            className="character-creator-yellow-name"
          >
            {backgrounds[selectedIndex].name}
          </Typography>
          <Typography 
            variant="h4"
            className="character-creator-source"
          >
            Source: {backgrounds[selectedIndex].source}
          </Typography>
        </div>
        <Box className="character-creator-yellow-divider" my={1}/>
        {helperFunctions.handleElements(backgrounds[selectedIndex].entries)}
      </div>
    );
  }

  return (
    <div>
      <AppBar className="character-creator-appbar" elevation={0} position="static" color="default">
        <Tabs
          className="character-creator-tabs"
          style={{backgroundColor: "#333", marginBottom: "20px"}}
          // value={tabValue}
          onChange={(event, newTabValue) => setTabValue(newTabValue == 0 ? 0 : 2)}
          centered
        >
          <Tab 
            className="character-creator-tab" 
            icon={<NavigateBeforeIcon/>} 
            label={`${editingCharacterBackground ? 'Update' : 'Choose'} race`} 
          />
          <Tab 
            className="character-creator-tab" 
            icon={<NavigateNextIcon/>} 
            label={`${editingCharacterBackground ? 'Update' : 'Choose'} ability scores`} 
          />
        </Tabs>
      </AppBar>
      { error && <div>{ error }</div>}
      { isLoading && <div>Loading...</div>}
      { !isLoading && 
        <Grid container spacing={3}>
          <Grid item xs={2}>
            {backgroundList()}
          </Grid>
          <Grid item xs={10}>
            {selectedBackgroundDetails()}
          </Grid>
        </Grid>
      }
    </div>
  );
}

export default BackgroundPanel;