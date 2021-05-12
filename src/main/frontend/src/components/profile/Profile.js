import { Link } from "react-router-dom";
import axios from 'axios';
import AuthService from "../services/authService";
import { Box, Button, Grid, IconButton, Paper, Typography, Modal, Container } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import useGet from '../services/useGet';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import LinkIcon from '@material-ui/icons/Link';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import shortid from 'shortid';
import JoinSession from "./JoinSession";
import UserCharacters from "./UserCharacters";
import CharacterDetails from "../CharacterDetails";
import UserSessions from "./UserSessions";

const API_URL = "http://localhost:8080/api";

const Profile = ({setCurrentPage}) => {
  const currentUser = AuthService.getCurrentUser();
  const [openSessionPopup, setOpenSessionPopup] = useState(false);
  const [newSessionNameisEmpty, setNewSessionNameIsEmpty] = useState(false);
  const [newSessionName, setNewSessionName] = useState();
  const [newSessionId, setNewSessionId] = useState(shortid.generate());

  const [openCharacterViewModal, setOpenCharacterViewModal] = useState(false);

  const { data: sessions, isLoading: isLoadingSessions, error: sessionsError } = useGet(`${API_URL}/session/user/${currentUser.id}`);
  const { data: characters, isLoading: isLoadingCharacters, error: charactersError } = useGet(`${API_URL}/character/user/${currentUser.id}`);
  let history = useHistory();

  useEffect(() => setCurrentPage(": Profile"));

  const handleCancel = (popupSetter) => {
    popupSetter(false); 
    history.push('/profile');
  }

  const handleContinue = (whichModal) => {
    switch(whichModal) {
      case "Create Session":
        if(newSessionName) {
          setNewSessionNameIsEmpty(false);
          setOpenSessionPopup(false);
          createSession(newSessionName);
        } else {
          setNewSessionNameIsEmpty(true);
        }
        break;
    }
  }

  const handleDelete = (id, entity) => {
    axios.delete(`${API_URL}/${entity}/${id}`)
    .then((response) => {
      console.log(`${entity} deleted successfully!`);
      window.location.reload();
    }).catch((err) => console.log(err.message));
  };

  const characterIcons = (character) => {
    return (
      <Typography className="character-icons">
        <Link to={`character/edit/${character.id}`}>
          <IconButton>
            <EditIcon/>
          </IconButton>
        </Link>
        <IconButton
          onClick={() => {console.log("---");console.log("abierto");setOpenCharacterViewModal(true)}}
        >
          <VisibilityIcon fontSize="large"/>
        </IconButton>
        <Modal
          open={openCharacterViewModal}
          onClose={() => setOpenCharacterViewModal(false)}
          style={{maxHeight: "100vh", overflowY: "auto"}}
        >
          <Paper style={{backgroundColor: "#1c1c1c", width: "80%", margin: "auto"}}>
            <CharacterDetails characterId={character.id} disableInteraction={true}/>
          </Paper>
        </Modal>
        <IconButton
          // onClick={() => handleSaveCharacter(character.name)}
        >
          <SaveAltIcon fontSize="large"/>
        </IconButton>
        <IconButton
          onClick={() => handleDelete(character.id, "character")}
        >
          <DeleteOutlineIcon fontSize="large"/>
        </IconButton>
      </Typography>
    );
  }

  const sessionIcons = (session) => {
    return (
      <Typography className="session-icons">
        <IconButton
          onClick={() => history.push(`/session/${session.inviteId}`)}
        >
          <PlayArrowIcon fontSize="large"/>
        </IconButton>
        <IconButton
          onClick={() => navigator.clipboard.writeText(session.inviteId)}
        >
          <LinkIcon fontSize="large"/>
        </IconButton>
        <IconButton
          onClick={() => handleDelete(session.id, "session")}
        >
          <DeleteOutlineIcon fontSize="large"/>
        </IconButton>
      </Typography>
    );
  }

  const createSession = (name) => {
    const newSession = {};
    newSession.name = name;
    newSession.sessionId = newSessionId;
    newSession.players = [];
    newSession.creatorId = JSON.parse(localStorage.getItem('user')).id;
    newSession.chatMessages = [];
    newSession.logMessages = [];
    axios.post(`${API_URL}/session/${newSessionId}`, newSession, {'Content-Type': 'application/json'})
    .then((response) => {
      console.log(response);
      console.log('Session created successfully!')
      history.push(`/session/${newSessionId}`);
    }).catch((err) => console.log(err.message));
  }

  return (
    <div className="Profile">
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Paper>
            <Box p={2}>
              {currentUser && <Typography className="title" variant="h3">User info</Typography>}
              {currentUser && <Typography variant="h6"><b>Username:</b> {currentUser.username}</Typography>}
              {currentUser && <Typography variant="h6"><b>Email:</b> {currentUser.email}</Typography>}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <JoinSession
            userCharactersData={{characters, isLoading: isLoadingCharacters, error: charactersError}}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box className="title-container">
              <Typography 
                className="title"
                align='center'
                variant='h3'>
                Characters
              </Typography>
            </Box>
            <UserCharacters 
              characters={characters} 
              isLoading={isLoadingCharacters}
              error={charactersError}
              icons={characterIcons}
            />
            <Box className="button-container">
              <Link to="/character/create">
                <Box align="center">
                  <IconButton>
                    <AddBoxIcon fontSize="large"/>
                  </IconButton>
                </Box>
              </Link>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box className="title-container">
              <Typography 
                className="title"
                align='center'
                variant='h3'>
                Sessions
              </Typography>
            </Box>
            <UserSessions
              sessions={sessions} 
              isLoading={isLoadingSessions}
              error={sessionsError}
              icons={sessionIcons}
            />
            <Box className="button-container">
                <Box align="center">
                  <IconButton onClick={() => setOpenSessionPopup(true)}>
                    <AddBoxIcon fontSize="large"/>
                  </IconButton>
                </Box>
              <Modal
                open={openSessionPopup}
                onClose={() => handleCancel(setOpenSessionPopup)}
              >
                <div className="popup-content">
                  <Typography className="title" variant="h4">Session Creator</Typography>
                  <div className="field">
                    <Typography>Session name: </Typography>
                    <input  
                      required
                      maxLength="25"
                      onChange={(e) => setNewSessionName(e.target.value)}
                    />
                    {newSessionNameisEmpty && <p className="required-message">This field is required</p>}
                  </div>
                  <div className="field">
                    <Typography>Session link: </Typography>
                    <Typography>{newSessionId}</Typography>
                  </div>
                  <Box className="buttons-container" mt={3} align='center'>
                    <Button 
                      onClick={() => handleCancel(setOpenSessionPopup)}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button
                      onClick={() => handleContinue("Create Session")}
                    >
                      <Typography>Continue</Typography>
                    </Button>
                  </Box>
                </div>
              </Modal>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Profile;