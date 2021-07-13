import { AppBar, Box, Button, Accordion, AccordionSummary, AccordionDetails, Grid, Modal, Switch, Tab, Tabs, Typography, } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from 'react-router-dom';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';
import Board from "./Board";
import axios from 'axios';
import CharacterDetails from '../CharacterDetails';
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import Log from "./Log";
import Chat from "./Chat";
import { v4 as uuidv4 } from 'uuid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const API_URL = "http://localhost:8080/api";

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

/**
 * Returns a random integer between 1 (inclusive) and 'faces' (inclusive).
 * The value is no lower than 1 and no greater than 'faces'.
 * Using Math.round() will give you a non-uniform distribution!
 */
const roll = (faces) => {
  return Math.floor(Math.random() * (faces - 1 + 1)) + 1;
}

const iconColors = ['#733a87', '#1e4d5a', '#e73f23', '#ffc000','#9ac83c' , '#c2dbc7'];

const Session = ({setCurrentPage}) => {
  const [tabValue, setTabValue] = useState(0);
  const [characterSheetsTabValue, setCharacterSheetsTabValue] = useState(0);
  const { id: sessionId } = useParams();
  // const { data: sessionData, isLoading: isLoadingSession, error: sessionError } = useGet(`${API_URL}/session/inviteId/${sessionId}`);
  const [sessionData, setSessionData] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  const [logMessages, setLogMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userIsDM, setUserIsDM] = useState(false);
  const stompClient = useRef(null);
  const history = useHistory();
  const [sessionHP, setSessionHP] = useState(false);
  const [sessionEquipment, setSessionEquipment] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [icons, setIcons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newIconOwner, setNewIconOwner] = useState(undefined);
  const [newIconColor, setNewIconColor] = useState();

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setCurrentPage(": Session");
    axios.get(`${API_URL}/session/inviteId/${sessionId}`)
      .then((res) => {
        setSessionData(res.data);
        setIsLoadingSession(false);
      }).catch((err) => {
        console.log(err.message);
        setIsLoadingSession(false);
      })
    const socket = new SockJS("http://localhost:8080/log");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, frame => {
        // console.log("Connected " + frame);
        stompClient.current.subscribe("/topic/logMessages", greeting => {
          setLogMessages(logMessages => [...logMessages, `${JSON.parse(greeting.body).from} ${JSON.parse(greeting.body).text}`]);
        });
        stompClient.current.subscribe("/topic/chatMessages", greeting => {
          setChatMessages(chatMessages => [...chatMessages, `${JSON.parse(greeting.body).from}: ${JSON.parse(greeting.body).text}`]);
        });
        stompClient.current.subscribe("/topic/icons", receivedIcon => {
          // console.log(`id: ${JSON.parse(receivedIcon.body).id} | x: ${JSON.parse(receivedIcon.body).x} | y: ${JSON.parse(receivedIcon.body).y}`)
          const iconIndex = icons.findIndex(icon => icon.id == JSON.parse(receivedIcon.body).id);
          console.log(iconIndex);
          if(iconIndex == -1) {
            const tempArray = icons;
            const newIcon = {
              id: JSON.parse(receivedIcon.body).id, 
              x: JSON.parse(receivedIcon.body).x,
              y: JSON.parse(receivedIcon.body).y,
              username: JSON.parse(receivedIcon.body).username,
              color: JSON.parse(receivedIcon.body).color
            }
            tempArray.push(newIcon);
            setIcons(tempArray);
            setNewIconOwner(undefined);
            setNewIconColor(null);
            setOpenModal(false);
          } else if(iconIndex >= 0) {
            let tempArray = [...icons];
            let newIcon = {
              id: JSON.parse(receivedIcon.body).id, 
              x: JSON.parse(receivedIcon.body).x,
              y: JSON.parse(receivedIcon.body).y,
              username: JSON.parse(receivedIcon.body).username,
              color: JSON.parse(receivedIcon.body).color
            }
            // tempArray[iconIndex].x = JSON.parse(receivedIcon.body).x;
            // tempArray[iconIndex].y = JSON.parse(receivedIcon.body).y;
            tempArray[iconIndex] = newIcon;
            setIcons(tempArray);
          }
        });
        stompClient.current.subscribe("/topic/interaction", result => {
          let tempSessionData = sessionData;
          if(tempSessionData) {
            let tempArray = tempSessionData.playersData;
            let tempPlayer = tempArray.find(playerData => playerData.username == result.body);
            // tempPlayer.isBlocked = !tempPlayer.isBlocked;
            tempArray[tempArray.findIndex(playerData => playerData.username == result.body)] = tempPlayer;
            tempSessionData.playersData = tempArray;
            setSessionData(tempSessionData);
          }
          console.log(!isBlocked);
          setIsBlocked(!isBlocked);
        });
    });
  }, []);

  useEffect(() => {
    if(!isLoadingSession) {
      setChatMessages(sessionData.chatMessages);
      setLogMessages(sessionData.logMessages);
      const tempUserIsDM = sessionData.creatorId == JSON.parse(localStorage.getItem('user')).id;
      setUserIsDM(tempUserIsDM);
      setIcons(sessionData.icons);
      let tempDMSessionHP = {};
      let tempDMEquipment = {};
      sessionData.playersData.map((playerData) => {
        if(tempUserIsDM) {
          tempDMSessionHP[playerData.username] = playerData.characterCurrentHP;
          tempDMEquipment[playerData.username] = playerData.characterEquipment;
        } else if(playerData.username == JSON.parse(localStorage.getItem('user')).username) {
          setSessionHP(playerData.characterCurrentHP);
          setSessionEquipment(playerData.characterEquipment);
        }
      });
      if(tempUserIsDM) {
        setSessionHP(tempDMSessionHP);
        setSessionEquipment(tempDMEquipment);
      }
    }
  }, [isLoadingSession]);

  useEffect(() => {
    axios.get(`${API_URL}/session/inviteId/${sessionId}`)
      .then((res) => {
        setSessionData(res.data);
        setIsLoadingSession(false);
      }).catch((err) => {
        console.log(err.message);
        setIsLoadingSession(false);
      })
  }, [refresh]);

  const updateSessionHP = (newValue, playerName) => {
    axios.put(`${API_URL}/session/${sessionId}/${playerName}/hp=${newValue}`, { headers: authHeader() })
    .then((response) => {
      console.log(response);
      console.log('Character HP updated successfully!');
    }).catch((err) => console.log(err.message));
  }

  const updateSessionEquipment = (newEquipment, playerName) => {
    console.log(newEquipment);
    axios.put(`${API_URL}/session/${sessionId}/${playerName}/equipment`, newEquipment, { headers: authHeader() })
    .then((response) => {
      console.log(response);
      console.log('Character equipment updated successfully!');
    }).catch((err) => console.log(err.message));
  }

  const sendMessage = (message, type) => {
    let endpoint;
    switch(type) {
      case "log":
        endpoint = "/api/log";
        break;
      case "chat":
        endpoint = "/api/chat";
        break;
    }
    if(stompClient) {
      stompClient.current.send(
        endpoint,
        {},
        JSON.stringify(
          {
          "from": JSON.parse(localStorage.getItem('user')).username, 
          "text": message
          }
        )
      );
    } else {
      console.log("Inside sendMessage(), stomp  Client: " + stompClient);
    }
  };

  const disconnect = () => {
    if (stompClient !== null) {
      stompClient.current.disconnect();
    }
  }

  const removeUser = (user) => {
    axios.put(`${API_URL}/session/remove/${sessionId}`, user)
    .then((response) => {
      console.log(response);
      console.log('User removed successfully!');
      history.push(`/session/${sessionId}`);
    }).catch((err) => console.log(err.message));
  }

  const characterSheetTabContent = () => {
    const array = [];
    if(userIsDM) {
      return(
        <div>
          <div style={{textAlign: 'center'}} >
            <Button
              // tengo que actualizar sessionData
              onClick={() => setRefresh(refresh+1)} 
              style={{backgroundColor: '#333', marginTop: '-15px', marginBottom: '10px'}}
            >
              <Typography> Refresh </Typography>
            </Button>
          </div>
          <AppBar className="character-sheets-appbar" position="static" color="default">
            <Tabs
              className="character-sheets-tabs"
              value={characterSheetsTabValue}
              onChange={(event, newTabValue) => setCharacterSheetsTabValue(newTabValue)}
              centered
            >
              {sessionData.playersData.map((playerData) => (
                <Tab key={playerData.username} className="character-sheet-tab" label={playerData.username}/>
              ))}
          </Tabs>
          </AppBar>
          {sessionData.playersData.map((playerData, index) => (
            <TabPanel key={playerData.characterId} value={characterSheetsTabValue} index={index} >
              <CharacterDetails
                characterId={playerData.characterId} 
                disableInteraction={false}
                roll={roll}
                sendMessage={sendMessage}
                playerName={playerData.username}
                sessionHP={sessionHP} //playerData.characterCurrentHP
                setSessionHP={setSessionHP} // aqui
                updateSessionHP={updateSessionHP}
                sessionEquipment={sessionEquipment} //playerData.characterEquipment
                setSessionEquipment={setSessionEquipment}
                updateSessionEquipment={updateSessionEquipment}
                userIsDM={true}
              />
            </TabPanel>
          ))}
        </div>
      );
    } else {
      sessionData.playersData.map((playerData) => {
        if(playerData.username == JSON.parse(localStorage.getItem('user')).username)
          array.push(
            <CharacterDetails
              key={playerData.characterId}
              characterId={playerData.characterId}
              disableInteraction={isBlocked} //playerData.isBlocked
              roll={roll}
              sendMessage={sendMessage}
              playerName={playerData.username}
              sessionHP={sessionHP}
              setSessionHP={setSessionHP}
              updateSessionHP={updateSessionHP}
              sessionEquipment={sessionEquipment}
              setSessionEquipment={setSessionEquipment}
              updateSessionEquipment={updateSessionEquipment}
              userIsDM={false}
            />
          );
      })
    }
    return array; 
  }

  const saveSession = () => {
    const session = {};
    session.chatMessages = chatMessages;
    session.logMessages = logMessages;
    session.icons = icons;
    axios.put(`${API_URL}/session/${sessionId}`, session)
    .then((response) => {
      console.log(response);
      console.log('Session saved successfully!');
    }).catch((err) => console.log(err.message));
  }

  const rollInitiative = () => {
    var text = '--- Initiative ---\n';
    sessionData.playersData.map((playerData) => {
      text += ` ${playerData.username} - ${roll(20)}\n`
    });
    text = text.replace(/\n$/g, '');
    stompClient.current.send(
      "/api/log",
      {},
      JSON.stringify(
        {
        "from": '', 
        "text": text
        }
      )
    );
  }

  const createIcon = () => {
    var x;
    var y;
    loop:
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if(!(icons.some(icon => icon.x == i*64 && icon.y == j*64))) {
          x = i*64;
          y = j*64;
          break loop;
        }
      }
    }
    const icon = {
      id: uuidv4(),
      x: x, // max 64*12
      y: y, 
      username: newIconOwner,
      color: newIconColor
    }
    if(icon.username && icon.color) {
      axios.put(`${API_URL}/session/addIcon/${sessionId}`, icon, { headers: authHeader() })
        .then((response) => {
          // setIcons([...icons, icon]);
          // console.log(response);
          // console.log(icon);
          if(stompClient) {
            stompClient.current.send(
              "/api/board",
              {},
              JSON.stringify(
                {
                  id: icon.id, 
                  x: icon.x,
                  y: icon.y,
                  username: icon.username,
                  color: icon.color
                }
              )
            );
          }
        })
        .catch((err) => {
          console.log(err.message);
          setNewIconOwner(undefined);
          setNewIconColor(null);
          setOpenModal(false);
        });
    } 
    // else {
    //   setNewIconOwner(undefined);
    //   setNewIconColor(null);
    //   setOpenModal(false);
    // }

  }

  const closeModal = () => {
    setNewIconOwner(undefined);
    setNewIconColor(null);
    setOpenModal(false)
  }

  const getCreateIconModal = () => {
    return (
      <Modal
        open={openModal}
        onClose={closeModal}
      >
        <div className="popup-content">
          {/* <button onClick={() => console.log(newIconOwner)}>print owner</button> */}
          <Box style={{width: '250px', marginBottom: '10px'}}>
            <Typography>Icon owner</Typography>
            <select
              value={newIconOwner ? newIconOwner : "default"}
              onChange={(e) => setNewIconOwner(e.target.value)}
              style={{
                backgroundColor: '#333', 
                border: 'none', 
                color: '#d0d0d0',
                minWidth: '240px',
                fontWeight: 'bold',
                fontSize: 16
              }}
            >
              <option hidden disabled value="default">Select the icon owner</option>
              {sessionData.playersData.map((player) => (
                <option key={player.username} value={player.username}>
                  {player.username}
                </option>
              ))}
              <option value={'NPC'}>
                NPC
              </option>
            </select>
          </Box>

          <Box style={{width: '250px', marginBottom: '10px'}}>
            <Typography>Icon color</Typography>
            <Grid container spacing={1} justify="center" alignItems="center">
              {iconColors.map((color) => (
                <Grid key={color} item xs={4}>
                  <Box >
                    <Button 
                      style={{
                        backgroundColor: color, 
                        // width: '40px',
                        height: '40px',
                      }} 
                      onClick={() => setNewIconColor(color)}/>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button style={{backgroundColor: '#333'}} onClick={closeModal}>
            <Typography>Cancel</Typography>
          </Button>
          <Button style={{backgroundColor: '#333'}} onClick={createIcon}>
            <Typography>Create</Typography>
          </Button>
        </div>
      </Modal>
    );
  }

  const blockUserInteraction = (playerData) => {  
    if(stompClient) {
      stompClient.current.send(
        "/api/interaction",
        {},
        JSON.stringify(
          // {
            playerData
          // }
        )
      );
    }
  } 

  return (  
    !isLoadingSession && 
    <div className="Session">
      <AppBar className="session-appbar" position="static" color="default">
        <Tabs
          className="session-tabs"
          value={tabValue}
          onChange={(event, newTabValue) => setTabValue(newTabValue)}
          centered
        >
          <Tab className="character-creator-tab" label="Board" />
          <Tab className="character-creator-tab" label="Character Sheet" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            
            <Board className="board" icons={icons} setIcons={setIcons} userIsDM={userIsDM} stompClient={stompClient} />
          </Grid>
          <Grid item xs={4}>
          {userIsDM &&
              <div>
                <div style={{display: 'table', width: '100%', borderSpacing: '5px'}}>
                  <div style={{display:'flex', flexDirection:'row', alignItems: 'center', display: 'table-row'}} >
                    <div style={{display:'table-cell'}}>
                    <Button style={{width: '100%', backgroundColor: '#333'}} onClick={saveSession}>
                      <Typography>Save Session</Typography>
                    </Button>
                    </div>
                    <div style={{display:'table-cell'}}>
                    <Button style={{width: '100%', backgroundColor: '#333'}} onClick={rollInitiative}>
                      <Typography>Roll initiative</Typography>
                    </Button>
                    </div>
                    <div style={{display:'table-cell'}}>
                    <Button style={{width: '100%', backgroundColor: '#333'}} onClick={() => setOpenModal(true)}>
                      <Typography>Create Icon</Typography>
                    </Button>
                    </div>
                  </div>  
                </div>
                <Accordion style={{marginBottom: '5px'}}>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon style={{ color: "#d0d0d0" }}/>
                    }
                  >
                    <Typography
                      variant="h4" 
                      style={{ 
                        fontWeight: 'bold'
                      }}
                    >
                      Session management
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                    {sessionData.playersData.map((player) => (
                      <div
                        key={player.username}
                        style={{display:'flex', flexDirection:'row', alignItems: 'center'}}
                      >
                        <Switch
                          onChange={() => blockUserInteraction(player)}
                        />
                        <Typography
                          variant="h5" 
                          style={{ 
                            fontWeight: 'bold'
                          }}
                        >
                          {player.username}
                        </Typography>
                      </div>
                    ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
                {/* <div> */}
                {/* </div> */}
              </div>
            }
            <Log logMessages={logMessages}/>
            <Chat chatMessages={chatMessages} sendMessage={sendMessage}/>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {characterSheetTabContent()}
      </TabPanel>
      {getCreateIconModal()}
    </div>
  );
}

export default Session;