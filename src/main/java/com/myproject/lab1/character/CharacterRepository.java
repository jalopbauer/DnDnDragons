package com.myproject.lab1.character;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CharacterRepository extends MongoRepository<Character, String> {}
