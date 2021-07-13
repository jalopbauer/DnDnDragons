import { Link } from "react-router-dom";
import { Grid } from '@material-ui/core';
import CharacterCard  from "./CharacterCard";


const CharacterFeed = ({chars}) => {
  return(
    <div className="character-grid">
      <Grid container spacing = {2} >
        {chars.map((char, index) => (
          <CharacterCard key={index} char = {char}></CharacterCard>
        ))}
      </Grid>   
    </div>
  );

  /*
  <div className="character-list">
      <h1>{ title }</h1>
      {chars.map((char) => (
        <div className="character-preview" key={char.id}>
          <Link to={`character/${char.id}`}>
            <h3>Name: {char.name}</h3>
            <h3>Class: {char.characterClass}</h3>
            <h3>Level: {char.level}</h3>
          </Link>
        </div>
      ))}
    </div>
  */
}

export default CharacterFeed;