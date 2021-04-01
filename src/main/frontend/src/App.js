import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CharacterDetails from './components/CharacterDetails';
import CreateCharacter from './components/CreateCharacter';
import Home from './components/Home';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import SignUp from './components/SignUp';
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
    // history.push('/');
    AuthService.logout();
    // window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <Navbar currentUser={currentUser} handleLogout={handleLogout}/>
        <div className="content">
          <Switch>
            <Route exact path={["/", "/home"]}>
              <Home />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path={"/character/create"}>
              <CreateCharacter />
            </Route>
            <Route path={"/character/:id"}>
              <CharacterDetails />
            </Route>
            <Route path={"/login"}>
              <LogIn />
            </Route>
            <Route path={"/signup"} component={SignUp} />
              {/* <SignUp />
            </Route> */}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
