import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useGet from '../services/useGet';
import authHeader from '../services/authHeader';

const API_URL = "http://localhost:8080/api";

const CharacterDetails = ({setCurrentPage}) => {
  const { id: characterId } = useParams(); 
  const { data: character, isLoading, error } = useGet(`${API_URL}/character/${characterId}`, { headers: authHeader() });

  useEffect(() => setCurrentPage(""));

  return (
    <div className="character-details">
      <h2>Character - {characterId}</h2>
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