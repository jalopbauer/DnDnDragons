import { CircularProgress, Box, Paper, Typography} from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';

const UserCharacters = ({characters, isLoading, error, icons}) => {
  return (
    <div className="UserCharacters">
      {isLoading &&
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress 
            style={{
              color: '#f1356d',
              margin: '10px'
            }}
          />
        </div>
      }
      {!isLoading && characters.map((character) => (
        <Paper 
          key={uuidv4()} 
          className="profile-container" 
          style={{marginLeft:15, marginRight:15}}
        >
          <Box className="character" style={{width: '100%', height: 40, marginRight:20, position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
            <Typography 
              variant="h5"
              style={{
                margin: 0,
                position: 'absolute',
                top: '50%',
                msTransform: 'translateY(-50%)',
                transform: 'translateY(-50%)',
                // display: 'block'
                // display: 'flex',
                // justifyContent: 'space-between'
              }}
            >
              {character.name}
            </Typography>
            <div style={{
              display: 'block', 
              position: 'absolute', 
              right: 0,
              top: '50%',
              msTransform: 'translateY(-50%)',
              transform: 'translateY(-50%)',
            }}>
              {icons(character)}
            </div>
          </Box>
        </Paper>
      ))}
      {!isLoading && characters.length == 0 &&
        // <Paper>
          <Box my={2} align="center">
            <Typography variant="h5">
              You currently have no characters
            </Typography>
          </Box>
        // </Paper>
      }
    </div>
  );
}

export default UserCharacters;