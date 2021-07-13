package com.myproject.lab1.character;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CharacterRepository extends MongoRepository<Character, String> {
  List<Character> findByUserId(String userId);
}
