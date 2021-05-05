import { Box, Paper, Typography} from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';

const UserCharacters = ({characters, isLoading, error, icons}) => {
  return (
    <div>
      {isLoading &&
        <Paper>
          <Box align="center">
            <Typography variant="h5">
              Loading characters...
            </Typography>
          </Box>
        </Paper>
      }
      {!isLoading && characters.map((character) => (
        <Paper key={uuidv4()} className="profile-container">
          <Box className="character">
            <Typography variant="h5"> {character.name}</Typography>
            {icons(character)}
          </Box>
        </Paper>
      ))}
      {!isLoading && characters.length == 0 &&
        <Paper>
          <Box my={2} align="center">
            <Typography variant="h5">
              You currently have no characters
            </Typography>
          </Box>
        </Paper>
      }
    </div>
  );
}

export default UserCharacters;