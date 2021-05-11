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
  }

  return (
    <Paper style={{height:"50%", marginTop:"1%"}}>
      <Box borderBottom={1} borderColor="#d0d0d0">
        <Typography style={{margin: "auto"}} align="center" variant="h6">Chat</Typography>
      </Box>
      <Box 
        px={1}
        m={1} 
        style={{
          overflowY: "scroll", 
          maxHeight:"87 %",
          height:"325px",
          backgroundColor: "#1c1c1c",
          position: "relative"
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
              <p>{message}</p>
            </Box>
          ) 
        })}
        <form 
          // noValidate 
          // autoComplete="off" 
          style={{position: "absolute", bottom: 0}}
          value={chatMessage}
          onChange={e => setChatMessage(e.target.value)}
          onSubmit={e => handleSubmit(e)}
        >
          <input 
            type="text" 
            value={chatMessage}
            style={{
              backgroundColor: "#333333",
              color: "#d0d0d0",
              width: "325px",
              border: "none",
              marginBottom: "7px",
              paddingLeft: "4px",
              paddingRight: "4px"
            }}
          />
        </form>
      </Box>
    </Paper>
  );
}

export default Chat;