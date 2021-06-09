import { AppBar, Box, Button, Grid, Tab, Tabs, Typography, } from "@material-ui/core";
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

const Session = ({setCurrentPage}) => {
  const [tabValue, setTabValue] = useState(0);
  const [characterSheetsTabValue, setCharacterSheetsTabValue] = useState(0);
  const [iconPosition, setIconPosition] = useState([0,0]);
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
    });
  }, []);

  useEffect(() => {
    if(!isLoadingSession) {
      setChatMessages(sessionData.chatMessages);
      setLogMessages(sessionData.logMessages);
      setUserIsDM(sessionData.creatorId == JSON.parse(localStorage.getItem('user')).id);
      sessionData.playersData.map((playerData) => {
        if(playerData.username == JSON.parse(localStorage.getItem('user')).username) {
          setSessionHP(playerData.characterCurrentHP);
          setSessionEquipment(playerData.characterEquipment);
        }
      });
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

  const updateSessionHP = (newValue) => {
    axios.put(`${API_URL}/session/${sessionId}/${JSON.parse(localStorage.getItem('user')).username}/hp=${newValue}`, { headers: authHeader() })
    .then((response) => {
      console.log(response);
      console.log('Character HP updated successfully!');
    }).catch((err) => console.log(err.message));
  }

  const updateSessionEquipment = (newEquipment) => {
    axios.put(`${API_URL}/session/${sessionId}/${JSON.parse(localStorage.getItem('user')).username}/equipment`, newEquipment, { headers: authHeader() })
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

  const moveIcon = (x, y) => {
    setIconPosition([x,y]);
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
        <div style={{textAlign: 'center'}}>
          <Button
            // tengo que actualizar sessionData
            onClick={() => setRefresh(refresh+1)} 
            style={{backgroundColor: '#333', marginTop: '-15px', marginBottom: '10px'}}
          >
            <Typography> Refresh </Typography>
          </Button>
          <AppBar className="character-sheets-appbar" position="static" color="default">
            <Tabs
              className="character-sheets-tabs"
              value={characterSheetsTabValue}
              onChange={(event, newTabValue) => setCharacterSheetsTabValue(newTabValue)}
              centered
            >
              {sessionData.playersData.map((playerData) => (
                <Tab className="character-sheet-tab" label={playerData.username}/>
              ))}
          </Tabs>
          </AppBar>
          {sessionData.playersData.map((playerData, index) => (
            <TabPanel value={characterSheetsTabValue} index={index} >
              <CharacterDetails
                characterId={playerData.characterId} 
                disableInteraction={false}
                roll={roll}
                sendMessage={sendMessage}
                playerName={playerData.username}
                sessionHP={playerData.characterCurrentHP}
                setSessionHP={setSessionHP}
                updateSessionHP={updateSessionHP}
                sessionEquipment={playerData.characterEquipment}
                setSessionEquipment={setSessionEquipment}
                updateSessionEquipment={updateSessionEquipment}
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
              characterId={playerData.characterId}
              disableInteraction={false}
              roll={roll}
              sendMessage={sendMessage}
              playerName={false}
              sessionHP={sessionHP}
              setSessionHP={setSessionHP}
              updateSessionHP={updateSessionHP}
              sessionEquipment={sessionEquipment}
              setSessionEquipment={setSessionEquipment}
              updateSessionEquipment={updateSessionEquipment}
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
            <Board className="board" iconPosition={iconPosition} moveIcon={moveIcon} />
          </Grid>
          <Grid item xs={4}>
            { userIsDM && <div style={{marginBottom: '5px'}}>
              <Button style={{backgroundColor: '#333', marginRight: '5px'}} onClick={saveSession}>
                <Typography>Save Session</Typography>
              </Button>
              <Button style={{backgroundColor: '#333'}} onClick={rollInitiative}>
                <Typography>Roll initiative</Typography>
              </Button>
            </div>}
            <Log logMessages={logMessages}/>
            <Chat chatMessages={chatMessages} sendMessage={sendMessage}/>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {characterSheetTabContent()}
      </TabPanel>
    </div>
  );
}

export default Session;