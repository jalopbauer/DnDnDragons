import { Link } from "react-router-dom";

const CharacterList = ({chars, title}) => {
  return(
    <div className="character-list">
      <h1>{ title }</h1>
      {chars.map((char) => (
        <div className="character-preview" key={char.id}>
          <Link to={`character/${char.id}`}>
            {/* <h2>Character {char.id}</h2> */}
            <h3>Name: {char.name}</h3>
            <h3>Class: {char.characterClass}</h3>
            <h3>Level: {char.level}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CharacterList;