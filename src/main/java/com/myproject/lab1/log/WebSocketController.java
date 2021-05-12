package com.myproject.lab1.log;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@CrossOrigin(origins = "*")
public class WebSocketController {

  @MessageMapping("/log")
  @SendTo("/topic/logMessages") // a donde lo va a broadcastear
  public OutputMessage sendLog(final Message message) throws Exception {
    final String time = new SimpleDateFormat("HH:mm").format(new Date());
    return new OutputMessage(message.getFrom(), message.getText(), time);
  }

  @MessageMapping("/chat")
  @SendTo("/topic/chatMessages") // a donde lo va a broadcastear
  public OutputMessage sendChat(final Message message) throws Exception {
    final String time = new SimpleDateFormat("HH:mm").format(new Date());
    return new OutputMessage(message.getFrom(), message.getText(), time);
  }

  // @MessageMapping("log/send")
	// public void receiveMessage(@Payload Message message) throws Exception {
    // System.out.println("-----------------------");
    // System.out.println("\n\nEn receiveMessage\n\n");
    // System.out.println("-----------------------");
	// 	// receive message from client
	// }

}
