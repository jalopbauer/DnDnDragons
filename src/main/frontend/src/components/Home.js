import CharacterFeed from './character/CharacterFeed';
import useGet from '../services/useGet';
import { Grid, Paper } from "@material-ui/core";

const API_URL = "http://localhost:8080/api";

const Home = () => {
  const {data: feed, isLoading, error} = useGet(`${API_URL}/character/`);

  return (
    <div className="home">
      <Grid container spacing={3}>
        <Grid item md={9} className='home-grid-item'>
          <Paper>
            {error && <div>{ error }</div>}
            {isLoading && <div>Loading...</div>}
            {feed && <CharacterFeed chars={feed} title="Character feed"/>}
          </Paper>
        </Grid>
        <Grid item md={3} className='home-grid-item'>
          <Paper>
            Search box
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;