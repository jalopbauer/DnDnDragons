import { useState, useEffect } from 'react';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import { Box, Divider, Table, TableBody, TableCell, TableHead, TableRow, List, Paper, Grid, Typography, Button, AppBar, Tabs, Tab } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { v4 as uuidv4 } from 'uuid';
import helperFunctions from './HelperFunctions';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const API_URL = "http://localhost:8080/api";

const proficiencyBonus = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];

const ClassPanel = ({setCharacterClass, handleCharacter, editingCharacterClass, setTabValue}) => {
  const {data: classes, isLoading, error} = useGet(`${API_URL}/character/creator/class`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(editingCharacterClass ? helperFunctions.getClassIndex(editingCharacterClass) : 0);

  useEffect(() => {
    if(!editingCharacterClass) {
      setCharacterClass(12, "Barbarian", [ "Strength", "Constitution" ]);
    }
  }, []);

  const handleListItemClick = (event, index) => {
    const hitDice = classes[selectedIndex].characterClass[0].hd.faces;
    const className = classes[selectedIndex].characterClass[0].name;
    const savingThrows = helperFunctions.transcribeProficiencies(classes[selectedIndex].characterClass[0].proficiency).split(", ");
    setCharacterClass(hitDice, className, savingThrows);
    setSelectedIndex(index);
  };

  const classList = () => {
    return (
      <Paper key={uuidv4()}>
        <List className="character-creator-list">
          {classes.map((characterClass, index) => (
            characterClass.characterClass[0].source === 'PHB' &&
            <ListItem
              key={uuidv4()}
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemText 
                key={uuidv4()} 
                className="character-creator-list-text"
                disableTypography
                primary={<Typography key={uuidv4()}><b>{characterClass.characterClass[0].name}</b></Typography>} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  const tableCell = (content) => {
    return (
      <TableCell 
        key={uuidv4()}
        align='center' 
        size='small'
        style={{padding: "2px 2px 2px 2px"}}
      >
        <Typography>{content}</Typography>
      </TableCell>
    );
  };

  return (
    <div className="class-panel">
      { error && <Typography>{ error }</Typography>}
      { isLoading && <Typography>Loading...</Typography>}
      { !isLoading && classes[selectedIndex] &&
      // {classes && 
      <div>
        <AppBar className="character-creator-appbar" elevation={0} position="static" color="default">
          <Tabs
            style={{backgroundColor: "#333", marginBottom: "20px"}}
            className="character-creator-tabs"
            // value={tabValue}
            onChange={(event, newTabValue) => {
              if(newTabValue == 0) {
                setTabValue(2);
              } else {
                handleListItemClick(event, selectedIndex); 
                handleCharacter();
              } 
            }}
            centered
          >
            <Tab 
              className="character-creator-tab" 
              icon={<NavigateBeforeIcon/>}   
              label={`${editingCharacterClass ? 'Update' : 'Choose'} ability scores`} 
            />
            <Tab 
              className="character-creator-tab" 
              icon={<NavigateNextIcon/>}   
              label={`${editingCharacterClass ? 'Update' : 'Create'} character`} 
            />
          </Tabs>
        </AppBar>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          {classList()}
        </Grid>
        <Grid item xs={10}>
          <div className="character-creator-title">
            <Typography
              variant="h2" 
              className="character-creator-yellow-name"
            >
              {console.log("index: " + selectedIndex)}
              {console.log("classes: " + classes)}
              {console.log("classes[index]: " + classes[selectedIndex])}
              {classes[selectedIndex].characterClass[0].name}
            </Typography>
            <Typography
              variant="h4"
              className="character-creator-source"
            >
              Source: {classes[selectedIndex].characterClass[0].source}
            </Typography>
          </div>
          <Box className="character-creator-yellow-divider" my={1}/>
          <Box id="class-table-box" style={{overflow: "auto", width: "100%"}}>
          <Table >
            <TableHead>
              {classes[selectedIndex].characterClass[0].classTableGroups && classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => 
                classTableGroup.title === 'Spell Slots per Spell Level' &&
                <TableRow key={uuidv4()}>
                  <TableCell align='center' size='small' colSpan='3' style={{padding: "2px 2px 2px 2px"}}/>
                  {classes[selectedIndex].characterClass[0].classTableGroups && classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => 
                    classTableGroup.title === 'Spell Slots per Spell Level' ?
                    <TableCell key={uuidv4()} align='center' size='small' colSpan={classTableGroup.colLabels.length} style={{padding: "2px 2px 2px 2px"}}>
                      <Typography>
                      {classTableGroup.title}
                      </Typography>
                    </TableCell> :
                    <TableCell key={uuidv4()} align='center' size='small' colSpan={classTableGroup.colLabels.length} style={{padding: "2px 2px 2px 2px"}}/>
                  )}
                </TableRow>
              )}
              <TableRow>
                {tableCell("Level")}
                {tableCell("Proficiency Bonus")}
                {tableCell("Features")}
                {classes[selectedIndex].characterClass[0].classTableGroups && 
                classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => (
                  classTableGroup.colLabels.map((colLabel) => (
                    tableCell(helperFunctions.removeFilterString(colLabel))
                  ))
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {proficiencyBonus.map((bonus, index) => (
                <TableRow key={uuidv4()}>
                  {tableCell(index+1)}
                  {tableCell(`+${bonus}`)}
                  <TableCell align='center' size='small' style={{padding: "2px 2px 2px 2px"}}>
                    {classes[selectedIndex].classFeature.map((feature) => (
                      (feature.level === index+1) && (feature.source === 'PHB') &&
                      <Typography key={uuidv4()}>{feature.name}</Typography>
                    ))}
                  </TableCell>
                  {classes[selectedIndex].characterClass[0].classTableGroups &&
                  classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => (
                    helperFunctions.filterClassTableGroupsRows(classTableGroup.rows[index])))
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider/>
        </Grid>
        <Grid item xs={12}>
          <Paper className="stats">
            {classes && classes[selectedIndex].characterClass[0] &&
              <Box p={2}>
                <Typography
                  variant="h4"
                >
                  Hit Points
                </Typography>
                  <Typography>
                    <b>Hit Dice:</b> {classes[selectedIndex].characterClass[0].hd.number + 'd' + classes[selectedIndex].characterClass[0].hd.faces}
                  </Typography>
                  <Typography>
                    <b>Hit Points at 1st Level: </b> {classes[selectedIndex].characterClass[0].hd.faces} + your Constitution modifier
                  </Typography>
                  <Typography>
                    <b>Hit Points at Higher Levels: </b> 
                    {classes[selectedIndex].characterClass[0].hd.number + 'd' + classes[selectedIndex].characterClass[0].hd.faces + ' '} 
                    (or {(classes[selectedIndex].characterClass[0].hd.faces/2)+1}) + your Constitution modifier per  
                    {' ' + classes[selectedIndex].characterClass[0].name} level after 1st
                  </Typography>
                <Typography
                  variant="h4"
                >
                  Proficiencies
                </Typography>
                  <Typography>
                    <b>Armor: </b> 
                    {classes[selectedIndex].characterClass[0].startingProficiencies.armor ?
                    helperFunctions.filterStartingProficienciesArmors(classes[selectedIndex].characterClass[0].startingProficiencies.armor) :
                    'none'
                    }
                  </Typography>
                  <Typography>
                    <b>Weapons: </b>
                    {classes[selectedIndex].characterClass[0].startingProficiencies.weapons ?
                    helperFunctions.filterStartingProficienciesWeapons(classes[selectedIndex].characterClass[0].startingProficiencies.weapons) :
                    'none'
                    }
                  </Typography>
                  <Typography>
                    <b>Tools: </b>
                    {classes[selectedIndex].characterClass[0].startingProficiencies.tools ?
                    helperFunctions.filterStartingProficienciesTools(classes[selectedIndex].characterClass[0].startingProficiencies.tools) :
                    'none'
                    }
                  </Typography>
                  <Typography>
                    <b>Saving Throws: </b>
                    {helperFunctions.transcribeProficiencies(classes[selectedIndex].characterClass[0].proficiency)}
                  </Typography>
                  <Typography>
                    <b>Skills: </b>
                    {helperFunctions.getSkills(classes[selectedIndex].characterClass[0].startingProficiencies.skills)}
                  </Typography>
                <Typography
                  variant="h4"
                >
                  Starting Equipment
                </Typography>
                  {helperFunctions.getStartingEquipment(classes[selectedIndex].characterClass[0].startingEquipment)}
              </Box>
            }
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className="details">
            <Box p={2}>
              {helperFunctions.getClassFeatures(classes[selectedIndex])}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </div>
      // }
      }
    </div>
  );
}

export default ClassPanel;