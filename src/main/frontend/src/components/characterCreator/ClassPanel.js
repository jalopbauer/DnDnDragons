import { useState, useEffect } from 'react';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import { Box, Divider, Table, TableBody, TableCell, TableHead, TableRow, List, Paper, Grid, Typography, Button } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { v4 as uuidv4 } from 'uuid';
import helperFunctions from './HelperFunctions';

const API_URL = "http://localhost:8080/api";

const proficiencyBonus = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];

const ClassPanel = ({setCharacterClass, createCharacter}) => {
  const {data: classes, isLoading, error} = useGet(`${API_URL}/character/creator/class`, { headers: authHeader() });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event, index) => {
    const hitDice = classes[selectedIndex].characterClass[0].hd.faces;
    setCharacterClass(hitDice);
    setSelectedIndex(index);
  };

  const classList = () => {
    return (
      <Paper>
        <List className="character-creator-list">
          {classes.map((characterClass, index) => (
            characterClass.characterClass[0].source === 'PHB' &&
            <ListItem
              button
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
              key={uuidv4()}
            >
              <ListItemText 
                key={uuidv4()} 
                className="character-creator-list-text"
                disableTypography
                primary={<Typography><b>{characterClass.characterClass[0].name}</b></Typography>} 
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
        align='center' 
        size='small'
        key={uuidv4()}
      >
        <Typography>{content}</Typography>
      </TableCell>
    );
  };

  return (
    <div className="class-panel">
      { error && <Typography>{ error }</Typography>}
      { isLoading && <Typography>Loading...</Typography>}
      { !isLoading && 
      // {classes && 
      <div>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          {classList()}
          <Box align='center' py={2}>
            <Button onClick={createCharacter}>
              <Typography variant="h6">Create character</Typography>
            </Button>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <div className="character-creator-title">
            <Typography
              variant="h2" 
              className="character-creator-yellow-name"
            >
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
          <Table>
            <TableHead>
              {classes[selectedIndex].characterClass[0].classTableGroups && classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => 
                classTableGroup.title === 'Spell Slots per Spell Level' &&
                <TableRow key={uuidv4()}>
                  <TableCell align='center' size='small' colSpan='3'></TableCell>
                  {classes[selectedIndex].characterClass[0].classTableGroups && classes[selectedIndex].characterClass[0].classTableGroups.map((classTableGroup) => 
                    classTableGroup.title === 'Spell Slots per Spell Level' ?
                    <TableCell align='center' size='small' colSpan={classTableGroup.colLabels.length}>
                      <Typography>
                      {classTableGroup.title}
                      </Typography>
                    </TableCell> :
                    <TableCell align='center' size='small' colSpan={classTableGroup.colLabels.length}/>
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
                  <TableCell align='center' size='small'>
                    {classes[selectedIndex].classFeature.map((feature) => (
                      (feature.level === index+1) && (feature.source === 'PHB') &&
                      <Typography>{feature.name}</Typography>
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
      <Box align='center' py={2}>
        <Button onClick={createCharacter}>
          <Typography variant="h4">Create character</Typography>
        </Button>
      </Box>
      </div>
      // }
      }
    </div>
  );
}

export default ClassPanel;