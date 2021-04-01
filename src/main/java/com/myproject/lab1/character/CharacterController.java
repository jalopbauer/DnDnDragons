package com.myproject.lab1.character;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/character")
// @CrossOrigin("*")
// @CrossOrigin(origins = "http://localhost:3000")
public class CharacterController {
  
  @Autowired
  private CharacterService characterService;

  public CharacterController(CharacterService characterService) {
    this.characterService = characterService;
  }

  @GetMapping("/")
  // @CrossOrigin(origins = "http://localhost:3000")
  public List<Character> getCharacters() {
    return characterService.findAll();
  }

  @PostMapping(value = "/", consumes = "application/json", produces = "application/json")
  public void saveCharacter(@RequestBody Character newCharacter) {
    characterService.save(newCharacter);
  }

  @GetMapping("/{id}")
  public Optional<Character> getCharacterById(@PathVariable String id) {
    System.out.println(id);
    return characterService.findById(id);
  }

}
