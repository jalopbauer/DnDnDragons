package com.myproject.lab1.session;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

  @PostMapping(value = "/", consumes = "application/json", produces = "application/json")
  public void saveSession(@RequestBody Map<String, String> payload) {
    sessionService.save(new Session(payload.get("name"), payload.get("userId")));
  }

  @GetMapping("/{id}")
  public Optional<Session> getSessionById(@PathVariable String id) {
    return sessionService.findById(id);
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

}
