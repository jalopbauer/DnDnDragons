package com.myproject.lab1.log;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import com.myproject.lab1.session.Icon;
import com.myproject.lab1.session.PlayerData;

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
  @SendTo("/topic/chatMessages")
  public OutputMessage sendChat(final Message message) throws Exception {
    final String time = new SimpleDateFormat("HH:mm").format(new Date());
    return new OutputMessage(message.getFrom(), message.getText(), time);
  }

  @MessageMapping("/board")
  @SendTo("/topic/icons") 
  public Icon moveIcon(final Icon icon) throws Exception {
    return icon;
  }

  @MessageMapping("/interaction")
  @SendTo("/topic/interaction") 
  public String interaction(final PlayerData playerData ) throws Exception {
    // ArrayList<String> interaction = new ArrayList<String>();
    // interaction.add(playerData.getUsername());
    // interaction.add(String.valueOf(playerData.getIsBlocked()));
    return playerData.getUsername();
  }

  @MessageMapping("/editHP")
  @SendTo("/topic/editHP") 
  public String editHP(final String payload ) throws Exception {
    return payload; 
  }

  @MessageMapping("/editEquipment")
  @SendTo("/topic/editEquipment") 
  public String editEquipment(final String payload ) throws Exception {
    return payload; 
  }

  // @MessageMapping("log/send")
	// public void receiveMessage(@Payload Message message) throws Exception {
    // System.out.println("-----------------------");
    // System.out.println("\n\nEn receiveMessage\n\n");
    // System.out.println("-----------------------");
	// 	// receive message from client
	// }

}
