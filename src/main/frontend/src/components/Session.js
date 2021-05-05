import { AppBar, Box, Tab, Tabs } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import useGet from './services/useGet';
import Board from "./Board";
import axios from 'axios';
import CharacterDetails from './CharacterDetails';

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

const Session = ({setCurrentPage}) => {
  const [tabValue, setTabValue] = useState(0);
  const [characterSheetsTabValue, setCharacterSheetsTabValue] = useState(0);
  const [iconPosition, setIconPosition] = useState([0,0]);
  const { id: sessionId } = useParams(); 
  const { data: sessionData, isLoading: isLoadingSession, error: sessionError } = useGet(`${API_URL}/session/inviteId/${sessionId}`);

  const history = useHistory();

  useEffect(() => setCurrentPage(": Session"));

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
              onChange={(event, newTabValue) => setTabValue(newTabValue)}
              centered
            >
              {sessionData.playersData.map((playerData) => (
                <Tab className="character-sheet-tab" label={playerData.username}/>
              ))}
          </Tabs>
          </AppBar>
          {sessionData.playersData.map((playerData, index) => (
            <TabPanel value={characterSheetsTabValue} index={index} >
              <CharacterDetails characterId={playerData.characterId}/>
            </TabPanel>
          ))}
        </div>
      );
    } else {
      sessionData.playersData.map((playerData) => {
        if(playerData.username == JSON.parse(localStorage.getItem('user')).username)
          array.push(<CharacterDetails characterId={playerData.characterId}/>);
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
      <TabPanel value={tabValue} index={0} >
        <Board className="board" iconPosition={iconPosition} moveIcon={moveIcon} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
          {sessionData && characterSheetTabContent()}
      </TabPanel>
    </div>
  );
}

export default Session;