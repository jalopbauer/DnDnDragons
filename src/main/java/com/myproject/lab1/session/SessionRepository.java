package com.myproject.lab1.session;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SessionRepository extends MongoRepository<Session, String> {
  List<Session> findByUserId(String userId);
}
