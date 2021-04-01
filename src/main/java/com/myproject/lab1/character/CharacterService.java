package com.myproject.lab1.character;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CharacterService {
  
  @Autowired
  private CharacterRepository characterRepository;

  public CharacterService(CharacterRepository characterRepository) {
    this.characterRepository = characterRepository;
  }

  public void save(Character character) {
    characterRepository.save(character);
  }

  public void delete(Character character) {
    characterRepository.delete(character);
  }

  public Optional<Character> findById(String id) {
    return characterRepository.findById(id);
  }

  public List<Character> findAllByUserId(String userId) {
    return characterRepository.findByUserId(userId);
  }

  public List<Character> findAll() {
    return characterRepository.findAll();
  }

}
