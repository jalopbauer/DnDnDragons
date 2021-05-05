import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { useState } from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { v4 as uuidv4 } from 'uuid';

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

const AbilityScoresPanel = ({setCharacterAbilityScores, raceBackgroundScores, editingCharacterScores}) => {
  const [scores, setScores] = useState(editingCharacterScores ? 
                                      {"str": editingCharacterScores[0], 
                                       "dex": editingCharacterScores[1], 
                                       "con": editingCharacterScores[2], 
                                       "int": editingCharacterScores[3], 
                                       "wis": editingCharacterScores[4], 
                                       "cha": editingCharacterScores[5]} :
                                      {"str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0});
  const [tabValue, setTabValue] = useState(0);

  const standardArray = [15, 14, 13, 12, 10, 8];
  const [standardArraySelectedValues, setStandardArraySelectedValues] = useState({"str": "-", "dex": "-", "con": "-", "int": "-", "wis": "-", "cha": "-"});

  const [pointBuy, setPointBuy] = useState(27);

  const handleTabChange = (event, newValue) => {
    if(newValue === 2) {
      setScores({"str": 8, "dex": 8, "con": 8, "int": 8, "wis": 8, "cha": 8}); // point buy
    } else {
      setScores({"str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0});
      setPointBuy(27);
    }
    setTabValue(newValue);
  };

  const handleModifierChange = (modifier, newValue, mode) => {
    newValue = Number(newValue);
    let ScoresCopy = Object.assign({}, scores);
    // let characterCopy = character;
    // characterCopy.abilityScores = {};
    switch(mode) {
      case 'manual':
        ScoresCopy[modifier] = newValue;
        setScores(ScoresCopy);
        break;
      case 'standardArray':
        if(newValue !== '-') {
          Object.keys(standardArraySelectedValues).map((key) => {
            if(standardArraySelectedValues[key] == newValue) {
              standardArraySelectedValues[key] = "-";
              ScoresCopy[key] = 0;
            }
          });
          let standardArraySelectedValuesCopy = standardArraySelectedValues;
          standardArraySelectedValuesCopy[modifier] = newValue;
          setStandardArraySelectedValues(standardArraySelectedValuesCopy);
          ScoresCopy[modifier] = newValue;
          setScores(ScoresCopy);
        } else {
          standardArraySelectedValues[modifier] = "-";
          ScoresCopy[modifier] = 0;
          setScores(ScoresCopy);
        }
        break;
      case 'pointBuy':
        const pointBuyCopy = pointBuy;
        if(newValue > 13) {
          if(newValue > ScoresCopy[modifier]) {
            setPointBuy(pointBuyCopy <= 0 ? pointBuyCopy : pointBuyCopy-2);
          } else {
            setPointBuy(pointBuyCopy+2);
          }
        } else if(newValue === 13) {
          if(newValue > ScoresCopy[modifier]) {
            setPointBuy(pointBuyCopy <= 0 ? pointBuyCopy : pointBuyCopy-1);
          } else {
            setPointBuy(pointBuyCopy+2);
          }
        } else {
          if(newValue > ScoresCopy[modifier]) {
            setPointBuy(pointBuyCopy <= 0 ? pointBuyCopy : pointBuyCopy-1);
          } else {
            setPointBuy(pointBuyCopy+1);
          }
        }
        if((pointBuyCopy > 0) || (newValue < ScoresCopy[modifier])) {
          ScoresCopy[modifier] = newValue;
          setScores(ScoresCopy);
        }
      break;
    }
    const abilityScores = [];
    Object.values(ScoresCopy).map((abilityScore, index) => {
      abilityScores[index] = Number(abilityScore) + Number(raceBackgroundScores[index]);
    })
    setCharacterAbilityScores(abilityScores);
    // Object.keys(ScoresCopy).map((key, index) => (
    //   characterCopy.abilityScores[key] = Number(ScoresCopy[key]) + raceBackgroundScores[index]
    // ));
    // setCharacter(characterCopy);
  };

  const getTableColumnsWidth = () => {
    return (
      <colgroup>
        <col style={{width:'28%'}}/>
        <col style={{width:'12%'}}/>
        <col style={{width:'12%'}}/>
        <col style={{width:'12%'}}/>
        <col style={{width:'12%'}}/>
        <col style={{width:'12%'}}/>
        <col style={{width:'12%'}}/>
      </colgroup>
    );
  };

  const getTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell align="left"></TableCell>
          <TableCell align="left">
            <Typography>
              Strength
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>
              Dexterity
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>
              Constitution
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>
              Intelligence
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>
              Wisdom
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Typography>
              Charisma
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const getRaceBackgroundModifierRow = () => {
    return (
      <TableRow>
        <TableCell align="left">
          <Typography>
            <b>Race/Background modifier</b>
          </Typography>
        </TableCell>
        {raceBackgroundScores.map((number) => (
          <TableCell key={uuidv4()} align="left">
            <Typography>
              {number > 0 ? `+${number}` : number}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const getTotalRow = () => {
    return (
      <TableRow>
        <TableCell align="left">
          <Typography>
            <b>Total</b>
          </Typography>
        </TableCell>
        {Object.keys(scores).map((key, index) => (
          <TableCell key={uuidv4()} align="left">
            <Typography>
              {Number(scores[key]) + Number(raceBackgroundScores[index]) > 0 ?
              `+${Number(scores[key]) + Number(raceBackgroundScores[index])}` :
              Number(scores[key]) + Number(raceBackgroundScores[index])}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const getModifierRow = () => {
    return (
      <TableRow>
        <TableCell align="left">
          <Typography>
            <b>Modifier</b>
          </Typography>
        </TableCell>
        {Object.values(scores).map((value, index) => (
          <TableCell key={uuidv4()} align="left">
            <Typography>
              {Math.floor((Number(value) + Number(raceBackgroundScores[index]) - 10)/2) > 0 ?
              `+${Math.floor((Number(value) + Number(raceBackgroundScores[index]) - 10)/2)}` :
              Math.floor((Number(value) + Number(raceBackgroundScores[index]) - 10)/2)}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  return (
    <div className="ability-scores-panel">
      <Grid container>
        <Grid item xs={2}>
          <Tabs
            orientation="vertical"
            className="character-creator-tabs"
            value={tabValue} 
            onChange={handleTabChange}
            centered
          >
            <Tab label="Manual" />
            {/* <Tab label="Roll" /> */}
            <Tab label="Standard Array" />
            <Tab label="Point Buy" />
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TabPanel value={tabValue} index={0} >
            <TableContainer component={Paper}>
              <Table className="table">
                {getTableColumnsWidth()}
                {getTableHead()}
                <TableBody>
                  <TableRow>
                    <TableCell align="left"></TableCell>
                    {Object.keys(scores).map((key, index) => (
                      <TableCell key={uuidv4()} align="left" width="125">
                        <input
                          type="number"
                          //min="0"
                          //max={20 - raceBackgroundScores[index]} 
                          required 
                          value={scores[key]}
                          onChange={(e) => handleModifierChange(key, e.target.value, 'manual')}
                          style={{ width: "40%" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  {getRaceBackgroundModifierRow()}
                  {getTotalRow()}
                  {getModifierRow()}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                {getTableColumnsWidth()}
                {getTableHead()}
                <TableBody>
                  <TableRow>
                    <TableCell align="left"></TableCell>
                    {Object.keys(scores).map((modifier) => (
                      <TableCell key={uuidv4()} align="left">
                        <select value={standardArraySelectedValues[modifier]} onChange={(e) => handleModifierChange(modifier, e.target.value, 'standardArray')}>
                          <option>-</option>
                          {standardArray.map((value) => (
                            <option key={uuidv4()}>{value}</option>
                          ))}
                        </select>
                      </TableCell>
                    ))}
                  </TableRow>
                  {getRaceBackgroundModifierRow()}
                  {getTotalRow()}
                  {getModifierRow()}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper}>
              <Table>
                {getTableColumnsWidth()}
                {getTableHead()}
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      <Typography>
                        <b>Budget:</b> {pointBuy}
                      </Typography>
                    </TableCell>
                    {Object.keys(scores).map((key) => (
                      <TableCell key={uuidv4()} align="left" width="125">
                        <input
                          type="number"
                          min="8"
                          max="15" 
                          required 
                          value={scores[key]}
                          onChange={(e) => handleModifierChange(key, e.target.value, 'pointBuy')}
                          style={{ width: "40%" }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  {getRaceBackgroundModifierRow()}
                  {getTotalRow()}
                  {getModifierRow()}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
};

export default AbilityScoresPanel;