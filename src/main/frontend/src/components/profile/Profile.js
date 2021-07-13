import { Link } from "react-router-dom";
import axios from 'axios';
import AuthService from "../services/authService";
import { CircularProgress, Box, Button, Grid, IconButton, Paper, Typography, Modal, Container } from "@material-ui/core";
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
import ShareIcon from '@material-ui/icons/Share';
import Input from "react-validation/build/input";

const API_URL = "http://localhost:8080/api";

const Profile = ({setCurrentPage}) => {
  const currentUser = AuthService.getCurrentUser();
  const [openSessionPopup, setOpenSessionPopup] = useState(false);
  const [newSessionNameisEmpty, setNewSessionNameIsEmpty] = useState(false);
  const [newSessionName, setNewSessionName] = useState();
  const [newSessionId, setNewSessionId] = useState(shortid.generate());

  const { data: sessions, isLoading: isLoadingSessions, error: sessionsError } = useGet(`${API_URL}/session/user/${currentUser.id}`);
  const { data: characters, isLoading: isLoadingCharacters, error: charactersError } = useGet(`${API_URL}/character/user/${currentUser.id}`);
  let history = useHistory();

  useEffect(() => setCurrentPage(": Profile"), []);
  
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

  // const characterIcons = (character) => {
  //   return (
  //     <Typography className="character-icons">
  //           <Link to={`character/edit/${character.id}`}>
  //             <IconButton>
  //               <EditIcon fontSize="large"/>
  //             </IconButton>
  //           </Link>
  //           <IconButton
  //             onClick={() => setOpenCharacterViewModal(true)}
  //           >
  //             <VisibilityIcon fontSize="large"/>
  //           </IconButton>
  //           <Modal
  //             open={openCharacterViewModal}
  //             onClose={() => setOpenCharacterViewModal(false)}
  //             style={{
  //               marginTop: 90,
  //               // marginBottom: 90,
  //               maxHeight: "100vh", 
  //               overflowY: "auto"
  //             }}
  //           >
  //             <Paper style={{
  //               border: '1px solid #fafafa',
  //               // marginTop: 30,
  //               paddingTop: 30,
  //               paddingBottom: 30,
  //               backgroundColor: "#1c1c1c", 
  //               width: "80%", 
  //               margin: "auto"
  //               }}
  //             >
  //               <CharacterDetails characterId={character.id} disableInteraction={true}/>
  //             </Paper>
  //           </Modal>
  //           <IconButton
  //             // onClick={() => handleSaveCharacter(character.name)}
  //           >
  //             <SaveAltIcon fontSize="large"/>
  //           </IconButton>
  //           <IconButton
  //             onClick={() => handleDelete(character.id, "character")}
  //           >
  //             <DeleteOutlineIcon fontSize="large"/>
  //           </IconButton>
          
  //     </Typography>
  //   );
  // }

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
    newSession.icons = [];
    axios.post(`${API_URL}/session/${newSessionId}`, newSession, {'Content-Type': 'application/json'})
    .then((response) => {
      // console.log(response);
      console.log('Session created successfully!')
      history.push(`/session/${newSessionId}`);
    }).catch((err) => console.log(err.message));
  }

  // const getModal = (characterId) => {
  //   return (
  //     <Modal
  //       open={openCharacterViewModal[character.id]}
  //       onClose={() => handleCharacterViewModal(character.id, false)}
  //       style={{
  //         marginTop: 90,
  //         // marginBottom: 90,
  //         maxHeight: "100vh", 
  //         overflowY: "auto"
  //       }}
  //     >
  //       <Paper style={{
  //         border: '1px solid #fafafa',
  //         // marginTop: 30,
  //         paddingTop: 30,
  //         paddingBottom: 30,
  //         backgroundColor: "#1c1c1c", 
  //         width: "80%", 
  //         margin: "auto"
  //         }}
  //       >
  //         <CharacterDetails characterId={character.id} disableInteraction={true}/>
  //       </Paper>
  //     </Modal>
  //   );
  // }

  return (
    <div className="Profile">
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Paper>
            <Box p={2}>
              {currentUser && <Typography className="title" variant="h3">User info</Typography>}
              {currentUser && <Typography variant="h5"><b>Username:</b> {currentUser.username}</Typography>}
              {currentUser && <Typography variant="h5"><b>Email:</b> {currentUser.email}</Typography>}
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
            {/* <UserCharacters 
              characters={characters} 
              isLoading={isLoadingCharacters}
              error={charactersError}
              icons={characterIcons}
            /> */}

            <div className="UserCharacters">
              {isLoadingCharacters &&
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress 
                    style={{
                      color: '#f1356d',
                      margin: '10px'
                    }}
                  />
                </div>
              }
              {/* <button onClick={() => {console.log(openCharacterViewModal); console.log(openCharacterViewModal['60a473521300981fe852b7e0'])}}>AAAAAA</button> */}
              {!isLoadingCharacters && characters.map((character) => (
                <Paper 
                  key={character.id} 
                  className="profile-container" 
                  style={{marginLeft:15, marginRight:15}}
                >
                  <Box className="character" style={{width: '100%', height: 40, marginRight:20, position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                    <Typography 
                      variant="h5"
                      style={{
                        margin: 0,
                        position: 'absolute',
                        top: '50%',
                        msTransform: 'translateY(-50%)',
                        transform: 'translateY(-50%)',
                        // display: 'block'
                        // display: 'flex',
                        // justifyContent: 'space-between'
                      }}
                    >
                      {character.name}
                    </Typography>
                    <div style={{
                      display: 'block', 
                      position: 'absolute', 
                      right: 0,
                      top: '50%',
                      msTransform: 'translateY(-50%)',
                      transform: 'translateY(-50%)',
                    }}>
                      <Typography className="character-icons">
                        <Link to={`character/edit/${character.id}`}>
                          <IconButton>
                            <EditIcon fontSize="large"/>
                          </IconButton>
                        </Link>
                        <Link to={`/character/${character.id}`}>
                          <IconButton>
                            <VisibilityIcon fontSize="large"/>
                          </IconButton>
                        </Link>
                        {/* <IconButton
                          onClick={() => console.log('.')}
                        >
                          <SaveAltIcon fontSize="large"/>
                        </IconButton> */}
                        <IconButton
                          onClick={() => handleDelete(character.id, "character")}
                        >
                          <DeleteOutlineIcon fontSize="large"/>
                        </IconButton>
                      </Typography>
                    </div>
                  </Box>
                </Paper>
              ))}
              {!isLoadingCharacters && characters.length == 0 &&
                  <Box my={2} align="center">
                    <Typography variant="h5">
                      You currently have no characters
                    </Typography>
                  </Box>
              }
            </div>

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
                    <Typography style={{fontSize: 26}}>Session name: </Typography>
                    <input  
                      required
                      maxLength="25"
                      onChange={(e) => setNewSessionName(e.target.value)}
                      style={{fontSize: 24}}
                    />
                    {newSessionNameisEmpty && <p className="required-message">This field is required</p>}
                  </div>
                  <div className="field">
                    <Typography style={{fontSize: 26}}>Session link: </Typography>
                    <div
                      style={{display:'flex', flexDirection:'row', alignItems: 'center'}}
                    >
                      <Typography style={{fontSize: 24}}>{newSessionId}</Typography>
                      {/* <Typography className="character-icons"> */}
                        <IconButton 
                          onClick={() => {navigator.clipboard.writeText(newSessionId)}} 
                          style={{borderStyle: 'none'}}
                        >
                          <ShareIcon fontSize="large" style={{color: '#d0d0d0'}}/>
                        </IconButton>
                      {/* </Typography> */}
                    </div>
                  </div>
                  <Box className="buttons-container" mt={3} align='center'>
                    <Button 
                      onClick={() => handleCancel(setOpenSessionPopup)}
                    >
                      <Typography style={{fontSize: 24}}>Cancel</Typography>
                    </Button>
                    <Button
                      onClick={() => handleContinue("Create Session")}
                    >
                      <Typography style={{fontSize: 24}}>Continue</Typography>
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