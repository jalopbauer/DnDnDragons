import axios from 'axios';
import { Box, Button, IconButton, Paper, Typography, Modal } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import InputIcon from '@material-ui/icons/Input';
import authHeader from '../services/authHeader';
import UserCharacters from './UserCharacters';
import CheckIcon from '@material-ui/icons/Check';

const API_URL = "http://localhost:8080/api";

const JoinSession = ({userCharactersData}) => {
  const [sessionId, setSessionId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [sessionIdisEmpty, setSessionIdIsEmpty] = useState(false);
  const [sessionDoesNotExist, setSessionDoesNotExist] = useState(false);
  const [firstTimeJoining, setFirstTimeJoining] = useState(false);
  let history = useHistory();

  const joinSession = (characterId=false) => {
    // si characterId == false, quiere decir que ya el usuario ha ingresado 
    // a la partida y por lo tanto, ya tiene sus datos registrados en ella
    if(!characterId) {
      history.push(`/session/${sessionId}`);
    } else {
      const newPlayerData = {};
      newPlayerData.username = JSON.parse(localStorage.getItem('user')).username;
      newPlayerData.characterId = characterId;
      userCharactersData.characters.map((character) => {
        if(character.id == characterId) {
          newPlayerData.characterCurrentHP = character.hp;
          newPlayerData.characterEquipment = character.equipment;
        }
      });
      // console.log(newPlayerData);
      axios.put(`${API_URL}/session/add/${sessionId}`, newPlayerData, { headers: authHeader() })
      .then((response) => {
        // console.log(response);
        console.log('Session updated successfully!');
        history.push(`/session/${sessionId}`);
      }).catch((err) => console.log(err.message));
    }
  }

  const handleCancel = () => {
    setOpenModal(false); 
    history.push('/profile');
  }

  const handleContinue = () => {
    if(sessionId) {
      setSessionIdIsEmpty(false);
      // hago un get de la sesion a la que se quiere joinear
      axios.get(`${API_URL}/session/inviteId/${sessionId}`, { headers: authHeader() })
      .then((res) => {
        // la sesion existe?
        if(res.data == null) {
          setFirstTimeJoining(false);
          setSessionDoesNotExist(true); // no -> aviso al usuario
        } else if(res.data.playersData) {
          // si -> es la primera vez que ingreso a esta sesion ?
          setSessionDoesNotExist(false);
          res.data.playersData.map((playerData) => {
            if(playerData.username == JSON.parse(localStorage.getItem('user')).username) {
              // no -> joinear 
              setFirstTimeJoining(false);
              joinSession();
            }
          });
          // si -> elegir con que personaje acceder y luego joinear
          setFirstTimeJoining(true);
        } else {
          setSessionDoesNotExist(false);
          setFirstTimeJoining(true);
        }
      }).catch((err) => {
        console.log(err.message);      
      });
    } else {
      setSessionDoesNotExist(false);
      setFirstTimeJoining(false);
      setSessionIdIsEmpty(true);
    }
  }

  const characterIcons = (character) => {
    return (
      <Typography className="character-icons" style={{margin: 0}}>
        {/* <Link to={`/session/${sessionId}`}> */}
          <IconButton
            onClick={() => joinSession(character.id)}
            style={{width: 10, height: 10}}
          >
            <CheckIcon fontSize="small" style={{fill: "#f1356d"}}/>
          </IconButton>
        {/* </Link> */}
      </Typography>
    );
  }

  const getJoinSessionModal = () => {
    return (
      <Modal
        open={openModal}
        onClose={handleCancel}
      >
        <div className="popup-content">
          <Typography className="title" variant="h4">Join Session</Typography>
          <div className="field">
            <Typography style={{fontSize: 26}}>Session id: </Typography>
            <input  
              required
              maxLength="15"
              onChange={(e) => setSessionId(e.target.value)}
              defaultValue={sessionId}
              style={{fontSize: 24}}
            />
            {sessionIdisEmpty && <p className="required-message">This field is required</p>}
            {sessionDoesNotExist && <p className="required-message">Session not found</p>}
            {firstTimeJoining && 
              <div>
                <Typography style={{fontSize: 24, marginTop:10, marginBottom:-10}}>Select a character:</Typography>
                <UserCharacters
                  characters={userCharactersData.characters} 
                  isLoading={userCharactersData.isLoading}
                  error={userCharactersData.error}
                  icons={characterIcons}
                />
              </div>}
          </div>
          <Box className="buttons-container" mt={3} align='center'>
            <Button 
              onClick={handleCancel}
            >
              <Typography style={{fontSize: 24}}>Cancel</Typography>
            </Button>
            <Button
              onClick={handleContinue}
            >
              <Typography style={{fontSize: 24}}>Continue</Typography>
            </Button>
          </Box>
        </div>
      </Modal>
    );
  }

  return (
    <Paper style={{height: "100%"}}>
      {/* <Box p={2}> */}
      <Typography 
        className="title" 
        align="center" 
        variant="h4"
        style={{paddingTop: "15px"}}
      >
        Join Session
      </Typography>
        <IconButton
          onClick={() => setOpenModal(true)}
          disableRipple
          style={{
            margin: "auto", 
            width: "100%", 
            marginTop: "15px",
            backgroundColor: 'transparent' }}
          // style={{
          //   // paddingTop: "25px", 
          //   width:"100%", 
          //   margin: "auto", 
          //   maxWidth: "100%",
          //   maxHeight: "100%",
          //   overflow: "auto"}}
        >
          <InputIcon fontSize="large" style={{fill: "#f1356d"}}/>
        </IconButton>
        {getJoinSessionModal()}
      {/* </Box> */}
    </Paper>
  );
}

export default JoinSession;