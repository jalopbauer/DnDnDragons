// import CharacterFeed from './CharacterFeed';
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
        <Grid item md={9} className='home-grid-item'>
          <Paper>
            {error && <div>{ error }</div>}
            {isLoading && <div>Loading...</div>}
            {!isLoading && <Typography variant="h1">{"<Character Feed>"}</Typography>}
            {/* {feed && <CharacterFeed chars={feed} title="Character feed"/>} */}
          </Paper>
        </Grid>
        <Grid item md={3} className='home-grid-item'>
          <Paper>
            <Typography variant="h2">{"<Search box>"}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;