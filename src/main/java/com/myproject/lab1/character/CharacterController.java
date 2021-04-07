package com.myproject.lab1.character;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
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
    return characterService.findById(id);
  }

  @GetMapping("/user/{id}/character")
  public Optional<Character> getUserCharactersByUserId(@PathVariable String userId) {
    return characterService.findById(userId);
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

}
