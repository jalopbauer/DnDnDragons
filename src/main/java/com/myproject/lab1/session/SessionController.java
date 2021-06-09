package com.myproject.lab1.session;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/session")
@CrossOrigin(origins = "*")
public class SessionController {
  
  @Autowired
  private SessionService sessionService;

  public SessionController(SessionService sessionService) {
    this.sessionService = sessionService;
  }

  @SuppressWarnings("unchecked")
  @PostMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
  public void createSession(@PathVariable String id, @RequestBody Map<String, Object> payload) {
    sessionService.save(new Session(
      (String) payload.get("name"), 
      id, 
      (String) payload.get("creatorId"), 
      (ArrayList<PlayerData>) payload.get("players"),
      // (ArrayList<Object>) payload.get("characters"),
      (ArrayList<String>) payload.get("chatMessages"),
      (ArrayList<String>) payload.get("logMessages")
    ));
  }

  @SuppressWarnings("unchecked")
  @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
  public void saveSession(@PathVariable String id, @RequestBody Map<String, Object> payload) {
    Optional<Session> sessionData = sessionService.findByInviteId(id);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<String> chatMessages = session.getChatMessages();
      chatMessages.addAll((ArrayList<String>) payload.get("chatMessages"));
      session.setChatMessages(chatMessages);
      ArrayList<String> logMessages = session.getLogMessages();
      logMessages.addAll((ArrayList<String>) payload.get("logMessages"));
      session.setLogMessages(logMessages);
      sessionService.save(session);
    }
  }

  @PutMapping(value = "/{sessionId}/{username}/hp={hp}", consumes = "application/json", produces = "application/json")
  public void updateCharacterHP(@PathVariable String sessionId, @PathVariable String username, @PathVariable String hp) {
    Optional<Session> sessionData = sessionService.findByInviteId(sessionId);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<PlayerData> playersData = session.getPlayersData();
      for(PlayerData playerData : playersData) {
        if(playerData.getUsername().equals(username)) {
          playerData.setCharacterCurrentHP(Integer.parseInt(hp));
        }
      }
      session.setPlayersData(playersData);
      sessionService.save(session);
    }
  }

  @PutMapping(value = "/{sessionId}/{username}/equipment", consumes = "application/json", produces = "application/json")
  public void updateCharacterEquipment(@PathVariable String sessionId, @PathVariable String username, @RequestBody ArrayList<String> /*Map<String, Object>*/ payload) {
    Optional<Session> sessionData = sessionService.findByInviteId(sessionId);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<PlayerData> playersData = session.getPlayersData();
      for(PlayerData playerData : playersData) {
        if(playerData.getUsername().equals(username)) {
          playerData.setCharacterEquipment(payload);
        }
      }
      session.setPlayersData(playersData);
      sessionService.save(session);
    }
  }

  @GetMapping("/{id}")
  public Optional<Session> getSessionById(@PathVariable String id) {
    return sessionService.findById(id);
  }

  @GetMapping("inviteId/{inviteId}")
  public Optional<Session> getSessionByInviteId(@PathVariable String inviteId) {
    return sessionService.findByInviteId(inviteId);
  }

  @GetMapping("/user/{userId}")
  public List<Session> getUserSessionsByUserId(@PathVariable String userId) {
    return sessionService.findAllByUserId(userId);
  }

  @DeleteMapping("/{id}")
  public void deleteSession(@PathVariable String id) {
    Optional<Session> optionalSession = sessionService.findById(id);
    optionalSession.ifPresent(session -> sessionService.delete(session));
  }

  @SuppressWarnings("unchecked")
  @PutMapping("/add/{id}")
  public void addPlayer(@PathVariable String id, @RequestBody Map<String, Object> newPlayerData) {
    Optional<Session> sessionData = sessionService.findByInviteId(id);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<PlayerData> players = session.getPlayersData();
      PlayerData playerData = new PlayerData(
        (String) newPlayerData.get("username"),
        (String) newPlayerData.get("characterId"),
        (Integer) newPlayerData.get("characterCurrentHP"),
        (ArrayList<String>) newPlayerData.get("characterEquipment")
      );
      players.add(playerData);
      session.setPlayersData(players);

      sessionService.save(session);
    }
  }

  @PutMapping("/remove/{id}")
  public void removePlayer(@PathVariable String id, @RequestBody String player) {
    // Optional<Session> sessionData = sessionService.findByInviteId(id);
    // if(sessionData.isPresent()) {
    //   Session session = sessionData.get();
    //   ArrayList<PlayerData> players = session.getPlayersData();
    //   players.remove(player);
    //   session.setPlayersData(players);
    //   sessionService.save(session);
    // }
  }

}
