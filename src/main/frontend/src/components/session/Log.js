import { Box, Typography, Paper } from "@material-ui/core";

const Log = ({logMessages}) => {
  
  return (
    <Paper style={{height:"50%", marginBottom:"2%"}}>
      <Box borderBottom={1} borderColor="#d0d0d0">
        <Typography align="center" variant="h6">Log</Typography>
      </Box>
      <Box 
        px={1} 
        m={1}
        style={{
          overflowY: "scroll", 
          maxHeight:"87 %",
          height:"325px",
          backgroundColor: "#1c1c1c",
        }}
      >
        {logMessages.map((message, index) => {
          return (
            <Box 
              borderRadius={16}
              px={1}
              my={1}
              color="#d0d0d0"
              style={{
                backgroundColor: "#333333",
              }}
              key={index}
            >
              <p>{message}</p>
            </Box>
          ) 
        })}
      </Box>
    </Paper>      
  );
}

export default Log;