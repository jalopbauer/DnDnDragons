package com.myproject.lab1.session;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
  
  @Autowired
  private SessionRepository sessionRepository;

  public SessionService(SessionRepository sessionRepository) {
    this.sessionRepository = sessionRepository;
  }

  public void save(Session session) {
    sessionRepository.save(session);
  }

  public void delete(Session session) {
    sessionRepository.delete(session);
  }

  public Optional<Session> findById(String id) {
    return sessionRepository.findById(id);
  }

  public Optional<Session> findByInviteId(String inviteId) {
    return sessionRepository.findByInviteId(inviteId);
  }

  public List<Session> findAllByUserId(String userId) {
    return sessionRepository.findByCreatorId(userId);
  }

}
