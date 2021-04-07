import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useState } from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Input from "react-validation/build/input";

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

const AbilityScoresPanel = () => {
  const [modifiers, setModifiers] = useState({"str": 1, "dex": 1, "con": 1, "int": 1, "wis": 1, "cha": 1});
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleModifierChange = (modifier, newValue) => {
    let modifiersCopy = Object.assign({}, modifiers);
    modifiersCopy[modifier] = newValue;
    setModifiers(modifiersCopy);
  };

  return (
    <div>
      <Grid container>
        <Grid item >
          <Tabs
            orientation="vertical"
            className="character-creator-tabs"
            value={value} 
            onChange={handleTabChange}
            centered
          >
            <Tab label="Manual" />
            {/* <Tab label="Roll" /> */}
            <Tab label="Standard Array" />
            <Tab label="Point Buy" />
          </Tabs>
        </Grid>
        <Grid item>
          <TabPanel value={value} index={0} >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableCell align="left"></TableCell>
                <TableCell align="left">Strength</TableCell>
                <TableCell align="left">Dexterity</TableCell>
                <TableCell align="left">Constitution</TableCell>
                <TableCell align="left">Intelligence</TableCell>
                <TableCell align="left">Wisdom</TableCell>
                <TableCell align="left">Charisma</TableCell>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left"></TableCell>

                  {Object.keys(modifiers).map((key, index) => (
                    <TableCell key={index} align="left">
                      <input
                        type="number"
                        min="1"
                        max="20" 
                        required 
                        value={modifiers[key]}
                        onChange={(e) => handleModifierChange(key, e.target.value)}
                      />
                    </TableCell>
                  ))}

 
                </TableRow>
                <TableRow>
                  <TableCell align="left"><b>Race/Background modifier</b></TableCell>
                  <TableCell align="left">b</TableCell>
                  <TableCell align="left">b</TableCell>
                  <TableCell align="left">b</TableCell>
                  <TableCell align="left">b</TableCell>
                  <TableCell align="left">b</TableCell>
                  <TableCell align="left">b</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left"><b>Total</b></TableCell>
                  {Object.keys(modifiers).map((key) => (
                    <TableCell align="left">
                      {modifiers[key]}
                    </TableCell>
                  ))}
                  {/* <TableCell align="left">{modifiers.str}</TableCell>
                  <TableCell align="left">c</TableCell>
                  <TableCell align="left">c</TableCell>
                  <TableCell align="left">c</TableCell>
                  <TableCell align="left">c</TableCell>
                  <TableCell align="left">c</TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={1}>
            StandardArrayPanel 
          </TabPanel>
          <TabPanel value={value} index={2}>
            PointBuyPanel 
          </TabPanel>
        </Grid>
      </Grid>
    </div>
  );
};

export default AbilityScoresPanel;