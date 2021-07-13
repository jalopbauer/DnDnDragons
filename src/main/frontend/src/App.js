import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CharacterCreator from './components/characterCreator/CharacterCreator';
import Home from './components/home/Home';
import LogIn from './components/home/LogIn';
import Navbar from './components/Navbar';
import Profile from './components/profile/Profile';
import SignUp from './components/home/SignUp';
import AuthService from './components/services/authService';
import Session from './components/session/Session';
import CharacterEditor from './components/characterCreator/CharacterEditor';
import CharacterDetails from './components/CharacterDetails';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    document.title = "DnD&Dragons";
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (    
    <div className="App">
      <Router>
      <Navbar currentPage={currentPage} currentUser={currentUser} handleLogout={handleLogout}/>
      <div className="content">
        <Switch>
          <Route exact path={["/", "/home"]} render={() => <Home setCurrentPage={setCurrentPage}/>} />
          <Route path="/profile" render={() => <Profile setCurrentPage={setCurrentPage}/>}/>
          <Route path={"/character/create"} render={() => <CharacterCreator setCurrentPage={setCurrentPage} editingCharacter={false}/>} />
          <Route path={"/character/edit/:id"} render={() => <CharacterEditor setCurrentPage={setCurrentPage} editingCharacter={true}/>} />
          <Route path={"/character/:id"} render={(props) => <CharacterDetails characterId={props.match.params.id} disableInteraction={true}/>} />
          <Route path={"/login"} render={() => <LogIn setCurrentPage={setCurrentPage}/>} />
          <Route path={"/session/:id"} render={() => <Session setCurrentPage={setCurrentPage}/>} />
          <Route path={"/signup"} render={() => <SignUp setCurrentPage={setCurrentPage}/>} />
          {/* <Route component={NoPageFound}> */}
        </Switch>
      </div>
      </Router>
    </div>
  );
}

export default App;
