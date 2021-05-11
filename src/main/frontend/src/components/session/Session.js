import { AppBar, Box, Grid, Tab, Tabs, } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from 'react-router-dom';
import useGet from '../services/useGet';
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
  const { data: sessionData, isLoading: isLoadingSession, error: sessionError } = useGet(`${API_URL}/session/inviteId/${sessionId}`);
  const [logMessages, setLogMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const stompClient = useRef(null);
  const history = useHistory();

  useEffect(() => {
    setCurrentPage(": Session");
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
    if(sessionData.creatorId == JSON.parse(localStorage.getItem('user')).id) {
      return(
        <div>
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
            />
          );
      })
    }
    return array; 
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
            <Log logMessages={logMessages}/>
            <Chat chatMessages={chatMessages} sendMessage={sendMessage}/>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {sessionData && characterSheetTabContent()}
      </TabPanel>
    </div>
  );
}

export default Session;