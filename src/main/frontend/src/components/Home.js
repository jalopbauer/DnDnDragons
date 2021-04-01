import CharacterList from './CharacterList';
// import useGet from '../custom_hooks/useGet';
import { useEffect, useState } from 'react';
import UserService from '../services/userService';

const Home = () => {
  //Get todos los characters publicos
  // const {data: chars, isLoading, error} = useGet("http://localhost:8080/api/character/");
  const [feed, setFeed] = useState("");

  useEffect(() => {
    UserService.getAllCharacters().then(
      (res) => {
        setFeed(res.data);
      },
      (err) => {
        const _content =
          (err.response && err.response.data) ||
          err.message ||
          err.toString();
          setFeed(_content);
      }
    );
  }, []);

  return (
    <div className="home">
      {/* {error && <div>{ error }</div>}
      {isLoading && <div>Loading...</div>}*/}
      <h1>&lt;Character feed&gt;</h1>
      {feed && <CharacterList chars={feed} title="Character feed"/>}
    </div>
  );
}

export default Home;