import { Box, Paper, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';

const UserSessions = ({sessions, isLoading, error, icons}) => {

  return (
    <div>
      {isLoading &&
        <Paper>
          <Box align="center">
            <Typography variant="h5">
              Loading sessions...
            </Typography>
          </Box>
        </Paper>
      }
      {!isLoading && sessions &&
        sessions.map((session) => (
          <Paper key={uuidv4()} className="profile-container">
            <Box className="session">
              <Typography variant="h5"> {session.name}</Typography>
              {icons(session)}
            </Box>
          </Paper>
      ))}
      {!isLoading && sessions.length == 0 &&
        <Paper>
          <Box my={2} align="center">
            <Typography variant="h5">
              You currently have no sessions
            </Typography>
          </Box>
        </Paper>
      }
      
    </div>
  );
};

export default UserSessions;