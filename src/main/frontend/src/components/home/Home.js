import CharacterFeed from './CharacterFeed';
import useGet from '../services/useGet';
import { Grid, CircularProgress, Paper, Typography } from "@material-ui/core";
import { useEffect } from "react";

const API_URL = "http://localhost:8080/api";

const Home = ({setCurrentPage}) => {
  const {data: feed, isLoading, error} = useGet(`${API_URL}/character/`);

  useEffect(() => setCurrentPage(""));

  return (
    <div className="home">
      <Grid container spacing={3}>
        <Grid item xs = {12} className='home-grid-item'>
          {error && <div>{ error }</div>}
          {isLoading && 
            <CircularProgress 
              style={{
                color: '#f1356d',
                position: 'absolute', left: '50%', top: '50%',
                // transform: 'translate(-50%, -50%)'
              }}
            />}
          {feed && <CharacterFeed chars={feed} title="Character feed"/>}
        </Grid>
        {/* <Grid item xs = {0} md= {3} className='home-grid-item'>
            <Paper>
              Search Bar
            </Paper>
        </Grid> */}
      </Grid>
    </div>
  );
}

export default Home;