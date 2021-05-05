import CharacterFeed from './CharacterFeed';
import useGet from './services/useGet';
import { Grid, Paper, Typography } from "@material-ui/core";
import { useEffect } from "react";

const API_URL = "http://localhost:8080/api";

const Home = ({setCurrentPage}) => {
  const {data: feed, isLoading, error} = useGet(`${API_URL}/character/`);

  useEffect(() => setCurrentPage(""));

  return (
    <div className="home">
      <Grid container spacing={3}>
        <Grid item xs = {12} md= {9} className='home-grid-item'>
          {error && <div>{ error }</div>}
          {isLoading && <div>Loading...</div>}
          {feed && <CharacterFeed chars={feed} title="Character feed"/>}
        </Grid>
        <Grid item xs = {0} md= {3} className='home-grid-item'>
            <Paper>
              Search Bar
            </Paper>
        </Grid>

        
      </Grid>
    </div>
  );
}

export default Home;