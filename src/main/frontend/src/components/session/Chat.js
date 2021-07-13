import { Box, Paper, Typography } from "@material-ui/core";
import { useState } from "react";

const Chat = ({chatMessages, sendMessage}) => {
  const [chatMessage, setChatMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(chatMessage != "") {
      sendMessage(chatMessage, "chat");
      setChatMessage("");
    }
    // setChatMessage(""); 
  }

  return (
    <Paper style={{height:"50%", marginTop:0}}>
      <Box borderBottom={1} borderColor="#d0d0d0">
        <Typography style={{margin: "auto", fontWeight: 'bold'}} align="center" variant="h4">Chat</Typography>
      </Box>
      <Box 
        px={1}
        m={1} 
        style={{
          overflowY: "scroll", 
          maxHeight:"87 %",
          height:"490px",
          backgroundColor: "#1c1c1c",
          // position: "relative"
        }}
      >
        {chatMessages.map((message, index) => {
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
              <p style={{fontSize: 30}}>{message}</p>
            </Box>
          ) 
        })}
      </Box>
      <Box
        px={1}
        m={1}
        mb={2}
        border={3}
        borderColor="#1c1c1c"
      >
        <form 
            // noValidate 
            // autoComplete="off" 
            // style={{position: "absolute", bottom: 0}}
            onChange={e => setChatMessage(e.target.value)}
            value={chatMessage}
            onSubmit={e => handleSubmit(e)}
          >
            <input 
              type="text" 
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              style={{
                fontSize: 30,
                backgroundColor: "#333333",
                color: "#d0d0d0",
                width: "98%",
                border: "none",
                marginBottom: "7px",
                paddingLeft: "4px",
                paddingRight: "4px",
                // position: "absolute", bottom: 0,
                // display:'block'
              }}
            />
          </form>
        </Box>
    </Paper>
  );
}

export default Chat;