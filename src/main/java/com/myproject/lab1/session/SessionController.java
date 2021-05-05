package com.myproject.lab1.session;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

  @PostMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
  public void saveSession(@PathVariable String id, @RequestBody Map<String, Object> payload) {
    sessionService.save(new Session((String) payload.get("name"), id, (String) payload.get("creatorId"), (ArrayList<Object>) payload.get("players")));
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

  @PutMapping("/add/{id}")
  public void addPlayer(@PathVariable String id, @RequestBody Map<String, String> newPlayerData) {
    Optional<Session> sessionData = sessionService.findByInviteId(id);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<Object> players = session.getPlayersData();
      players.add(newPlayerData);
      session.setPlayersData(players);
      sessionService.save(session);
    }
  }

  @PutMapping("/remove/{id}")
  public void removePlayer(@PathVariable String id, @RequestBody String player) {
    Optional<Session> sessionData = sessionService.findByInviteId(id);
    if(sessionData.isPresent()) {
      Session session = sessionData.get();
      ArrayList<Object> players = session.getPlayersData();
      players.remove(player);
      session.setPlayersData(players);
      sessionService.save(session);
    }
  }

}
