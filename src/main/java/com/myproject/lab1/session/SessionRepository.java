package com.myproject.lab1.session;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends MongoRepository<Session, String> {
  List<Session> findByCreatorId(String creatorId);
  Optional<Session> findByInviteId(String inviteId);
}
