import useGet from './services/useGet';
import authHeader from './services/authHeader';
import { Grid, Typography, Card, Box, Divider, Button } from '@material-ui/core';

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

const CharacterDetails = ({characterId, disableInteraction, roll, sendMessage, playerName}) => {
  const { data: character, isLoading, error } = useGet(`${API_URL}/${characterId}`, { headers: authHeader() });

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
      <div className="ability-scores">
        {character.abilityScores.map((score, index) => {
          return(
            <Card variant="outlined">
              <Button
                disabled={disableInteraction}
                style={{color: "#d0d0d0"}}
                onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls ${roll(20)} in ${names[index]}`, "log")}
              >
                <Typography className="name" variant="h6"><b>{names[index]}</b></Typography>
                <Typography variant="h6">+{score}</Typography>
                <Box align="center">
                <div className="modifier">
                  <Typography variant="h6">
                    &nbsp;{Math.floor((score-10)/2) >= 0 ? '+' : null}{Math.floor((score-10)/2)}&nbsp;
                  </Typography>
                </div>
                </Box>
              </Button>
            </Card>
          );
        })}
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
      <div className="skills">
        <Box align="center"><Typography variant="h6">Skills</Typography></Box>
        <Box my={1}>
          <Divider/>
        </Box>
        {skills.map((skill) => (
          <Typography className="row">
            <Button
              disabled={disableInteraction}
              style={{color: "#d0d0d0"}}
              onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls a ${roll(20)} in ${skill.name}`, "log")}
              // disableElevation
              // disableFocusRipple
              // disableRipple
            >
            <Grid container spacing={3}>
              <Grid item xs={3}>
                {skill.proficient ? 
                <b style={{width: "100%", textAlign: "left"}}>{skill.value >= 0 ? `+${skill.value}` : skill.value}</b> : 
                <div style={{width: "100%", textAlign: "left"}}>{skill.value >= 0 ? `+${skill.value}` : skill.value}</div>}
              </Grid>
              <Grid item xs={9}>
              {skill.proficient ? <b>{skill.name}</b> : <div>{skill.name}</div>}
              </Grid>
            </Grid>
            </Button>
          </Typography> 
        ))}
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
        <Box my={1}>
          <Divider/>
        </Box>
        {savingThrows.map((savingThrow, index) => (
          <Typography className="row" variant="h6">
            <Button
              disabled={disableInteraction}
              style={{color: "#d0d0d0"}}
              onClick={() => sendMessage(`${playerName ? `(as ${playerName})` : ""} rolls a ${roll(20)} in a${index == 3 ? "n" : ""} ${savingThrow.name} saving throw`, "log")}
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  {savingThrow.proficient ? 
                  <b style={{width: "100%", textAlign: "left"}}>{savingThrow.value >= 0 ? `+${savingThrow.value}` : savingThrow.value}</b> : 
                  <div style={{width: "100%", textAlign: "left"}}>{savingThrow.value >= 0 ? `+${savingThrow.value}` : savingThrow.value}</div>}
                </Grid>
                <Grid item xs={9}>
                {savingThrow.proficient ? <b>{savingThrow.name}</b> : <div>{savingThrow.name}</div>}
                </Grid>
              </Grid>
            </Button>
          </Typography> 
        ))}
      </div>
    );
  }

  const getEquipment = () => {
    return(
      <div className="equipment">
        <Box align="center"><Typography variant="h6">Equipment</Typography></Box>
        <Box my={1}>
          <Divider/>
        </Box>
        {character.equipment.map((e) => (
          <Typography>
            {e}
          </Typography>
        ))}
      </div>
    );
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
          <Grid item md={2}>
            {getAbilityScores()}
          </Grid>
          <Grid item md={3}>
            <div className="proficiency-bonus">
              <Typography variant="h6">Proficiency Bonus: +2</Typography>
            </div>
            {getSkills()}
          </Grid>
          <Grid item md={3}>
            <div className="speed">
              <Typography variant="h6">Speed: {character.speed} ft.</Typography>
            </div>
            {getSavingThrows()}
          </Grid>
          <Grid item md={3}>
            <div className="max-hp">
              <Typography variant="h6">Max HP: {character.hp}</Typography>
            </div>
            {getEquipment()}
          </Grid>
        </Grid>
      </div>
      }
    </div>
  );
}

export default CharacterDetails;