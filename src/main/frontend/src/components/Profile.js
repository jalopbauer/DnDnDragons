import { Link } from "react-router-dom";
import axios from 'axios';
import CharacterFeed from "./CharacterFeed";
import AuthService from "./services/authService";
import { Box, Button, Grid, IconButton, Paper, Typography, Modal, Container, Input } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import useGet from './services/useGet';
import authHeader from './services/authHeader';
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareIcon from '@material-ui/icons/Share';
import LinkIcon from '@material-ui/icons/Link';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

const API_URL = "http://localhost:8080/api";

const Profile = ({setCurrentPage}) => {
  const currentUser = AuthService.getCurrentUser();
  const [openSessionPopup, setOpenSessionPopup] = useState(false);
  const [sessionNameisEmpty, setSessionNameIsEmpty] = useState(false);
  const [sessionName, setSessionName] = useState();
  // const {data: userChars, isLoading, error} = useGet(`${API_URL}/user/${currentUser.id}/character/`, { headers: authHeader() });
  const { data: sessions, isLoading: isLoadingSessions, error: sessionsError } = useGet(`${API_URL}/session/user/${currentUser.id}`);
  const { data: characters, isLoading: isLoadingCharacters, error: charactersError } = useGet(`${API_URL}/character/user/${currentUser.id}`);

  let history = useHistory()

  useEffect(() => setCurrentPage(": Profile"));

  const createSession = (name) => {
    const newSession = {};
    newSession.name = name;
    newSession.userId = JSON.parse(localStorage.getItem('user')).id;
    axios.post(`${API_URL}/session/`, newSession, {'Content-Type': 'application/json'})
    .then((response) => {
      console.log(response);
      console.log('Session created successfully!')
      history.push('/session/create');
    }).catch((err) => console.log(err.message));
  }

  const handleCancel = (popupSetter) => {
    popupSetter(false); 
    history.push('/profile');
  }

  const handleContinue = () => {
    if(sessionName) {
      setSessionNameIsEmpty(false);
      setOpenSessionPopup(false);
      createSession(sessionName)
    } else {
      setSessionNameIsEmpty(true);
    }
  }

  const getUserCharacters = () => {
    return (
      <div>
        {isLoadingCharacters &&
          <Paper>
            <Box align="center">
              <Typography variant="h5">
                Loading characters...
              </Typography>
            </Box>
          </Paper>
        }
        {!isLoadingCharacters && characters.map((character) => (
          <Paper className="session-container">
            <Box className="session">
              <Typography variant="h5"> {character.name}</Typography>
              <Typography className="session-icons">
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
            </Box>
          </Paper>
        ))}
        {!isLoadingCharacters && characters.length == 0 &&
          <Paper>
            <Box align="center">
              <Typography variant="h5">
                You currently have no characters
              </Typography>
            </Box>
          </Paper>
        }
      </div>
    );
  }

  const getUserSessions = () => {
    return (
      <div>
        {isLoadingSessions &&
          <Paper>
            <Box align="center">
              <Typography variant="h5">
                Loading sessions...
              </Typography>
            </Box>
          </Paper>
        }
        {!isLoadingSessions && sessions &&
          sessions.map((session) => (
            <Paper className="session-container">
              <Box className="session">
                <Typography variant="h5"> {session.name}</Typography>
                <Typography className="session-icons">
                  <IconButton
                    onClick={() => handleShareSession(session.name)}
                  >
                    <LinkIcon fontSize="large"/>
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(session.id, "session")}
                  >
                    <DeleteOutlineIcon fontSize="large"/>
                  </IconButton>
                </Typography>
              </Box>
            </Paper>
        ))}
        {!isLoadingSessions && sessions.length == 0 &&
          <Paper>
            <Box align="center">
              <Typography variant="h5">
                You currently have no sessions
              </Typography>
            </Box>
          </Paper>
        }
      </div>
    );
  };

  const handleDelete = (id, entity) => {
    axios.delete(`${API_URL}/${entity}/${id}`)
    .then((response) => {
      console.log(`${entity} deleted successfully!`);
      window.location.reload();
    }).catch((err) => console.log(err.message));
  };

  const handleShareSession = (name) => {
    navigator.clipboard.writeText(name);
  };

  return (
    <div className="Profile">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box p={2}>
              {currentUser && <Typography className="title" variant="h3">User info</Typography>}
              {currentUser && <Typography variant="h6"><b>Username:</b> {currentUser.username}</Typography>}
              {/* {currentUser && <Typography variant="h6"><b>Id:</b> {currentUser.id}</Typography>} */}
              {currentUser && <Typography variant="h6"><b>Email:</b> {currentUser.email}</Typography>}
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
                Characters
              </Typography>
            </Box>
            {/* {error && <div>{ error }</div>}
            {isLoading && <div>Loading...</div>}
            {chars && <CharacterFeed chars={chars}/>} */}
            <Container>
              {getUserCharacters()}
            </Container>
            <Box className="button-container">
              <Link to="/character/create">
                <Box align="center">
                  <IconButton>
                    <AddBoxIcon/>
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
            <Container>
              {getUserSessions()}
            </Container>
            <Box className="button-container">
              {/* <Link to="/session/create"> */}
                <Box align="center">
                  <IconButton onClick={() => setOpenSessionPopup(true)}>
                    <AddBoxIcon/>
                  </IconButton>
                </Box>
              {/* </Link> */}
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
                      onChange={(e) => setSessionName(e.target.value)}
                    />
                    {sessionNameisEmpty && <p className="required-message">This field is required</p>}
                  </div>
                  <div className="field">
                    <Typography>Session link: </Typography>
                    <Typography>asdfg1234hjkl5678</Typography>
                  </div>
                  <Box className="buttons-container" mt={3} align='center'>
                    <Button 
                      onClick={() => handleCancel(setOpenSessionPopup)}
                    >
                      <Typography>Cancel</Typography>
                    </Button>
                    <Button
                      onClick={handleContinue}
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