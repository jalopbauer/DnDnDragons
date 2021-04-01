import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CharacterDetails from './components/character/CharacterDetails';
import CharacterCreator from './components/character/CharacterCreator';
import Home from './components/Home';
import LogIn from './components/auth/LogIn';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import SignUp from './components/auth/SignUp';
import AuthService from './services/authService';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <Router>
      <div className="App">
        <Navbar currentUser={currentUser} handleLogout={handleLogout}/>
        <div className="content">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path={"/character/create"} component={CharacterCreator} />
            <Route path={"/character/:id"} component={CharacterDetails} />
            <Route path={"/login"} component={LogIn} />
            <Route path={"/signup"} component={SignUp} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
