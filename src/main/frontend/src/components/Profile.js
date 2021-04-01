import { Link } from "react-router-dom";
// import useGet from "../custom_hooks/useGet";
// import CharacterList from "./CharacterList";
import AuthService from "../services/authService";
import { Box, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import Container from '@material-ui/core/Container';

const Profile = () => {
  // const {data: chars, isLoading, error} = useGet("http://localhost:8080/api/character/");
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="Profile">
      <h1 style={{padding:'20px'}}>Profile</h1>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Box p={2}>
              {currentUser && <h2 style={{color:"#f1356d"}}>User info</h2>}
              {currentUser && <p><b>Username:</b> {currentUser.username}</p>}
              {currentUser && <p><b>Id:</b> {currentUser.id}</p>}
              {currentUser && <p><b>Email:</b> {currentUser.email}</p>}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box borderBottom={1}>
              <Typography 
                align='center'
                variant='h4'>
                Characters
              </Typography>
            </Box>
            {/* {error && <div>{ error }</div>}
            {isLoading && <div>Loading...</div>}
            {chars && <CharacterList chars={chars}/>} */}
            <Container>
              <Box my={2}><Paper>Character 1</Paper></Box>
              <Box my={2}><Paper>Character 2</Paper></Box>
              <Box my={2}><Paper>Character 3</Paper></Box>
            </Container>
            <Box borderTop={1} >
              <Link to="/character/create">
                <IconButton style={{ backgroundColor: 'transparent' }} className="profile-add-button">
                  <AddBoxIcon /*style={{fill: "#f1356d"}}*//>
                </IconButton>
              </Link>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box borderBottom={1}>
              <Typography 
                align='center'
                variant='h4'>
                Sessions
              </Typography>
            </Box>
            <Container>
              <Box my={2}><Paper>Sessions 1</Paper></Box>
              <Box my={2}><Paper>Sessions 2</Paper></Box>
            </Container>
            <Box borderTop={1} >
              <Link to="/session/create">
                <IconButton style={{ backgroundColor: 'transparent' }} className="profile-add-button">
                  <AddBoxIcon />
                </IconButton>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Profile;