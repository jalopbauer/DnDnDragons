package com.myproject.lab1.character;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
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
@RequestMapping("api/character")
@CrossOrigin(origins = "*")
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
  public void saveCharacter(@RequestBody Map<String, Object> payload) {
    characterService.save(new Character(
      payload.get("userId"), 
      payload.get("username"), 
      payload.get("abilityScores"), 
      payload.get("alignment"), 
      payload.get("background"),
      payload.get("characterClass"), 
      payload.get("equipment"),
      payload.get("hp"),
      payload.get("name"),
      payload.get("race"),
      payload.get("skillProficiencies"),
      payload.get("speed"),
      payload.get("savingThrows")
    ));
  }

  @GetMapping("/{id}")
  public Optional<Character> getCharacterById(@PathVariable String id) {
    return characterService.findById(id);
  }

  @GetMapping("/user/{userId}")
  public List<Character> getCharactersByUserId(@PathVariable String userId) {
    return characterService.findAllByUserId(userId);
  }

  @DeleteMapping("/{id}")
  public void deleteCharacter(@PathVariable String id) {
    Optional<Character> optionalCharacter = characterService.findById(id);
    optionalCharacter.ifPresent(character -> characterService.delete(character));
  }

  @PutMapping("/edit/{id}")
  public void updateCharacter(@PathVariable String id, @RequestBody Map<String, Object> payload) {
    Optional<Character> optionalCharacter = characterService.findById(id);
    if(optionalCharacter.isPresent()) {
      Character character = optionalCharacter.get();
      character.setUserId(payload.get("userId"));
      character.setUsername(payload.get("username"));
      character.setAbilityScores(payload.get("abilityScores"));
      character.setAlignment(payload.get("alignment"));
      character.setBackground(payload.get("background"));
      character.setCharacterClass(payload.get("characterClass"));
      character.setEquipment(payload.get("equipment"));
      character.setHp(payload.get("hp"));
      character.setName(payload.get("name"));
      character.setRace(payload.get("race"));
      character.setSkillProficiencies(payload.get("skillProficiencies"));
      character.setSpeed(payload.get("speed"));
      character.setSavingThrows(payload.get("savingThrows"));
      characterService.save(character);
    }
  }

  @GetMapping("/creator/race")
  public String getRaces() {
    JSONParser parser = new JSONParser();
    try {
      InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("races.json");
      String text = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
      JSONObject jsonObject = (JSONObject) parser.parse(text);
      return jsonObject.get("race").toString();
    } catch (ParseException e) {
      e.printStackTrace();
      return "ParseException";
    }
  }

  @GetMapping("/creator/background")
  public String getBackground() {
    JSONParser parser = new JSONParser();
    try {
      InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("backgrounds.json");
      String text = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
      JSONObject jsonObject = (JSONObject) parser.parse(text);
      return jsonObject.get("background").toString();
    } catch (ParseException e) {
      e.printStackTrace();
      return "ParseException";
    }
  }

  @GetMapping("/creator/class")
  public String getCharacterClass() {
    JSONParser parser = new JSONParser();
    try {
      InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("classes.json");
      String text = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
      JSONObject jsonObject = (JSONObject) parser.parse(text);
      return jsonObject.get("classes").toString();
    } catch (ParseException e) {
      e.printStackTrace();
      return "ParseException";
    }
  }

}
