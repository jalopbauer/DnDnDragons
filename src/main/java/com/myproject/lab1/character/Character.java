package com.myproject.lab1.character;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "characters")
public class Character {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private String id;

  private String userId;
  private String name;
  private String characterClass;
  private Integer level;
  
  public Character() {}

  public Character(String userId, String name, String characterClass, Integer level) {
    this.userId = userId;
    this.name = name;
    this.characterClass = characterClass;
    this.level = level;
  }

  public Character(String id, String userId, String name, String characterClass, Integer level) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.characterClass = characterClass;
    this.level = level;
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCharacterClass() {
    return this.characterClass;
  }

  public void setCharacterClass(String characterClass) {
    this.characterClass = characterClass;
  }

  public Integer getLevel() {
    return this.level;
  }

  public void setLevel(Integer level) {
    this.level = level;
  }

}
