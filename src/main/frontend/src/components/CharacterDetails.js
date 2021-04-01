import { useParams } from 'react-router-dom';
import useGet from '../custom_hooks/useGet';

const CharacterDetails = () => {
  const { id } = useParams();
  const { data: character, isLoading, error } = useGet("http://localhost:8080/api/character/" + id); 

  return (
    <div className="character-details">
      <h2>Character - {id}</h2>
      {error && <div>{ error }</div>}
      {isLoading && <div>Loading...</div>}
      {character && (
        <div>
          <h3>Class: {character.name}</h3>
          <h3>Class: {character.characterClass}</h3>
          <h3>Level: {character.level}</h3>
        </div>
      )}
    </div>
  );
}

export default CharacterDetails;