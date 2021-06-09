import useGet from './services/useGet';
import authHeader from './services/authHeader';
import {useState, React, useEffect} from "react";
import { Grid, Typography, Box, Divider, Button, ListItem, List } from '@material-ui/core';

const API_URL = "http://localhost:8080/api/character";

const skills = [{"name": "Acrobatics (Dex)", "ability": 1},
                {"name": "Animal Handling (Wis)", "ability": 4},
                {"name": "Arcana (Int)", "ability": 3},
                {"name": "Athletics (Str)", "ability": 0},
                {"name": "Deception (Cha)", "ability": 5},
                {"name": "History (Int)", "ability": 3},
                {"name": "Insight (Wis)", "ability": 4},
                {"name": "Intimidation (Cha)", "ability": 5},
                {"name": "Investigation (Int)", "ability": 3},
                {"name": "Medicine (Wis)", "ability": 4},
                {"name": "Nature (Int)", "ability": 3},
                {"name": "Perception (Wis)", "ability": 4},
                {"name": "Performance (Cha)", "ability": 5},
                {"name": "Persuasion (Cha)", "ability": 5},
                {"name": "Religion (Int)", "ability": 3},
                {"name": "Sleight of Hand (Dex)", "ability": 1},
                {"name": "Stealth (Dex)", "ability": 1},
                {"name": "Survival (Wis)", "ability": 4}];

const savingThrows = [{"name": "Strength", "ability": 0}, 
                      {"name": "Dexterity", "ability": 1}, 
                      {"name": "Constitution", "ability": 2}, 
                      {"name": "Intelligence", "ability": 3}, 
                      {"name": "Wisdom", "ability": 4}, 
                      {"name": "Charisma", "ability": 5}];

const CharacterDetails = ({characterId, disableInteraction, roll, sendMessage, playerName, 
                           sessionHP, setSessionHP, updateSessionHP, 
                           sessionEquipment, setSessionEquipment, updateSessionEquipment}) => {
  const { data: character, isLoading, error } = useGet(`${API_URL}/${characterId}`, { headers: authHeader() });
  const [isEditEquipment, setIsEditEquipment] = useState(false);
  const [editEquipmentButtonText, setEditEquipmentButtonText] = useState("Edit");
  const [newEquipment, setNewEquipment] = useState('');
  const [isEditHP, setIsEditHP] = useState(false);
  const [editHPButtonText, setEditHPButtonText] = useState("Edit");

  useEffect(() => {
    if(character) {
      if(sessionHP == false) {
        setSessionHP(character.hp);
      }
      if(sessionEquipment == false) {
        setSessionEquipment(character.equipment);
      }
    }
  }, [character])

  const getNames = () => {
    return (
      <div className="names">
        <Typography variant="h5"><b>Character name:</b> {character.name}</Typography>
        <Typography variant="h5"><b>Player name:</b> {character.username}</Typography>
      </div>
    );
  }

  const getGeneralInfo = () => {
    return (
      <div className="general-info">
        <div className="col1">
          <Typography variant="h5"><b>Class:</b> {character.characterClass}</Typography>
          <Typography variant="h5"><b>Race:</b> {character.race}</Typography>
        </div>
        <div className="col2">
          <Typography variant="h5"><b>Background:</b> {character.background}</Typography>
          <Typography variant="h5"><b>Alignment:</b> {character.alignment}</Typography>
        </div>
      </div>
    );
  }

  const getAbilityScores = () => {
    const names = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
    return (
      <div className="ability-scores" style={{backgroundColor:"#333"}}>
        <Box align="center"><Typography variant="h6">Ability Scores</Typography></Box>
        <Box my={1} >
          <Divider style={{backgroundColor: 'white'}}/>
        </Box>
        <List >
        {character.abilityScores.map((score, index) => {
          return(
            <Button
              disabled={disableInteraction}
              style={{color: "#d0d0d0"}}
              onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls ${roll(20)} in ${names[index]}`, "log")}
            >
              <Typography className="name" variant="h6" style={{paddingLeft: 10}}><b>{names[index]}:</b></Typography>
              <Box align="center">
              <div className="modifier">
                <Typography variant="h6">
                  &nbsp;[{Math.floor((score-10)/2) >= 0 ? '+' : null}{Math.floor((score-10)/2)}]&nbsp;
                </Typography>
              </div>
              </Box>
            </Button>
          );
        })}
        </List>
      </div>
    );
  }

  const getSkills = () => {
    const proficiencies = character.skillProficiencies;
    skills.map((skill) => {
      proficiencies.map((proficiency) => {
        if(skill.name.slice(0, -6) == proficiency) {
          skill.value = Math.floor((character.abilityScores[skill.ability] - 10)/2) + 2;
          skill.proficient = true;
        } else {
          skill.value = Math.floor((character.abilityScores[skill.ability] - 10)/2);
        }
      })
    });
    return (
      <div className="skills" style={{marginTop: -12}}>
        <Box align="center"><Typography variant="h6">Skills</Typography></Box>
        <Box mb={1}>
          <Divider style={{backgroundColor: 'white'}}/>
        </Box>
        <Grid container spacing={3}>
          {skills.map((skill, index) => (
            <Grid item xs = {12} sm = {6} md = {4}
              style={{padding: 0}}
            >
              <Typography className="row">
                <Button
                  disabled={disableInteraction}
                  style={{color: "#d0d0d0", width: '100%'}}
                  onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls a ${roll(20)} in ${skill.name}`, "log")}
                >
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <h3 style={{fontWeight: skill.proficient ? 'bold' : 'normal', width: "100%", textAlign: "left"}}>{skill.value >= 0 ? `+${skill.value}` : skill.value}</h3>
                  </Grid>
                  <Grid item xs={9}>
                    <h3 style={{fontWeight: skill.proficient ? 'bold' : 'normal',}}>{skill.name}</h3>
                  </Grid>
                </Grid>
                </Button>
              </Typography> 
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  const getSavingThrows = () => {
    savingThrows.map((savingThrow, index) => {
      character.savingThrows.map((proficientSavingThrow) => {
        if(savingThrow.name == proficientSavingThrow) {
          savingThrow.value = Math.floor((character.abilityScores[index] - 10)/2) + 2;
          savingThrow.proficient = true;
        } else {
          savingThrow.value = Math.floor((character.abilityScores[index] - 10)/2);
        }
      })
    });
    return (
      <div className="saving-throws">
        <Box align="center"><Typography variant="h6">Saving Throws</Typography></Box>
        <Box my={1} >
          <Divider style={{backgroundColor: 'white'}}/>
        </Box>
        {savingThrows.map((savingThrow, index) => (
          <Typography className="row" variant="h6">
            <Button
              disabled={disableInteraction}
              style={{color: "#d0d0d0", paddingLeft: 20 }}
              onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls a ${roll(20)} in a${index == 3 ? "n" : ""} ${savingThrow.name} saving throw`, "log")}
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <h3 style={{fontWeight: savingThrow.proficient ? 'bold' : 'normal', width: "100%", textAlign: "left"}}>{savingThrow.value >= 0 ? `+${savingThrow.value}` : savingThrow.value}</h3>
                </Grid>
                <Grid item xs={9}>
                  <h3 style={{fontWeight: savingThrow.proficient ? 'bold' : 'normal'}}>{savingThrow.name}</h3>
                </Grid>
              </Grid>
            </Button>
          </Typography> 
        ))}
      </div>
    );
  }

  const changeEquipment = (newEquipment, index) => {
    var tempEquipments = [...sessionEquipment]; // shallow copy
    tempEquipments[index] = newEquipment;
    setSessionEquipment(tempEquipments);
  }

  const getEquipment = () => {

    const handleEquipmentEdit = () => {
      setIsEditEquipment(!isEditEquipment);
      if(isEditEquipment){
        setEditEquipmentButtonText("Edit");
        if(newEquipment.length > 2) {
          sessionEquipment.push(newEquipment);
          setNewEquipment('');
        }
        updateSessionEquipment(sessionEquipment);
      } else {
        setEditEquipmentButtonText("Save");
      }
    }

    return(
      <div className="equipment">
        <Box align="center">
          <Typography variant="h6">Equipment</Typography>
          {!disableInteraction && 
            <Button onClick={() => handleEquipmentEdit()}>{editEquipmentButtonText}</Button> 
          }
          </Box>
        <Box my={1}>
          <Divider style={{backgroundColor: 'white'}}/>
        </Box>
        {disableInteraction ? 
          <List>
          {character.equipment.map((eq) => (
            <ListItem>
            <Typography
              style={{
                paddingLeft: 5,
                paddingRight: 5,
              }}
            >
              {eq}
            </Typography>
            </ListItem>
          ))}
          </List> 
        :
          <>
            {!isEditEquipment &&
              <List>
              {sessionEquipment.map((eq) => (
                <ListItem>
                <Typography
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  {eq}
                </Typography>
                </ListItem>
              ))}
              </List>
            }
            {isEditEquipment &&
              <List>
              {sessionEquipment.map((equipment, index) => (
                
                !(equipment == '') ?
                <ListItem>
                  {console.log(equipment)}
                  <textarea
                    defaultValue={equipment}
                    onChange={(e) => changeEquipment(e.target.value, index)}
                    type='text'
                    style={{
                      color: '#d0d0d0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      fontFamily: "Roboto",
                      fontWeight: '400',
                      lineHeight: '1.5',
                      letterSpacing: '0.00938em',
                    }}
                  />
                </ListItem>
                : <></>
              ))}
              <ListItem>
                  <textarea
                    defaultValue={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    type='text'
                    style={{
                      color: '#d0d0d0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      fontFamily: "Roboto",
                      fontWeight: '400',
                      lineHeight: '1.5',
                      letterSpacing: '0.00938em',
                    }}
                  />
                </ListItem>
              </List>
            }
          </>
        }
      </div>
    );
  }

  const handleHPEdit = () => {
    setIsEditHP(!isEditHP);
    if(isEditHP){
      setEditHPButtonText("Edit");
      updateSessionHP(sessionHP);
    } else {
      setEditHPButtonText("Save");
    }
  }

  const changeHP = (e) => {
    setSessionHP(e.target.value);
  }

  return (
    <div className="CharacterDetails">
      {error && <div>{ error }</div>}
      {isLoading && <div>Loading...</div>}
      {character &&
      <div>
        <Grid container spacing={3}>
          <Grid item md={5}>
            {getNames()}
          </Grid>
          <Grid item md={7}>
            {getGeneralInfo()}
          </Grid>
          <Grid item md={12}>
            {getSkills()}
          </Grid>
          <Grid item md={3}>
            {getAbilityScores()}
          </Grid>
          <Grid item md={3}>
            <Grid container spacing={3}
              style={{
                marginTop:2
              }}
            >
              <Grid item md={12}
                style={{
                  backgroundColor: '#333',
                }}
              >
                <Typography variant="h6">Proficiency Bonus: +2</Typography>
              </Grid>
              <Grid item md={12}
                style={{
                  backgroundColor: '#333',
                  marginTop: 15
                }}
              >
                <Typography variant="h6">Speed: {character.speed} ft.</Typography>
              </Grid>
              <Grid item md={12}
                style={{
                  backgroundColor: '#333',
                  marginTop: 15
                }}
              >
                {disableInteraction &&
                  <Typography variant="h6">Max HP: {character.hp}</Typography>
                }
                {!disableInteraction &&
                  <div>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={6}>
                        <Typography variant="h6">Max HP :</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h6">{character.hp}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="h6"></Typography>
                      </Grid>
                      <Grid item xs={6}><Typography variant="h6">Current HP :</Typography></Grid>
                      <Grid item xs={3}>
                        {!isEditHP &&
                          <Typography variant="h6">
                            {sessionHP}
                          </Typography>
                        }
                        {isEditHP &&
                          <input 
                            defaultValue={sessionHP}
                            type='number'
                            min='0'
                            onChange={(e) => changeHP(e)}
                            style={{
                              color: '#d0d0d0',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              fontSize: '1.25rem',
                              fontFamily: "Roboto",
                              fontWeight: 500,
                              lineHeight: 1.6,
                              letterSpacing: '0.0075em',
                              width: 60
                            }}  
                          />
                        }
                      </Grid>
                      <Grid item xs={3}>
                        <Button onClick={() => handleHPEdit()}>{editHPButtonText}</Button> 
                      </Grid>
                    </Grid> 
                  </div>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3}>
            {getSavingThrows()}
          </Grid>
          <Grid item md={3}>
            {getEquipment()}
          </Grid>
        </Grid>
      </div>
      }
    </div>
  );
}

export default CharacterDetails;