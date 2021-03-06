import { Box, Typography, Paper } from "@material-ui/core";

const Log = ({logMessages}) => {
  
  return (
    <Paper style={{height:"40%", marginBottom:5}}>
      <Box borderBottom={1} borderColor="#d0d0d0">
        <Typography 
          align="center" 
          variant="h4" 
          style={{
            margin: "auto", 
            fontWeight: 'bold'
          }}
        >
          Rolls
        </Typography>
      </Box>
      <Box 
        px={1} 
        m={1}
        style={{
          overflowY: "scroll", 
          maxHeight:"87%",
          height:"490px",
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
              <div
                style={{
                  fontSize: 30,
                  backgroundColor: "#333",
                  color: "#d0d0d0",
                  whiteSpace:"pre-wrap",
                }}
              >
                {message}
              </div>
            </Box>
          ) 
        })}
      </Box>
    </Paper>      
  );
}

export default Log;