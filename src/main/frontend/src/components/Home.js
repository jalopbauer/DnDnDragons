import CharacterFeed from './character/CharacterFeed';
import useGet from '../services/useGet';

const API_URL = "http://localhost:8080/api";

const Home = () => {
  const {data: feed, isLoading, error} = useGet(`${API_URL}/character/`);

  return (
    <div className="home">
      {error && <div>{ error }</div>}
      {isLoading && <div>Loading...</div>}
      {feed && <CharacterFeed chars={feed} title="Character feed"/>}
    </div>
  );
}

export default Home;