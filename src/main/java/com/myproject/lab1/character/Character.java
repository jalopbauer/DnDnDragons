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

  private Object userId;
  private Object username;
  private Object abilityScores;
  private Object alignment;
  private Object background;
  private Object characterClass;
  private Object equipment;
  private Object hp;
  private Object name;
  private Object race;
  private Object skillProficiencies;
  private Object speed;
  private Object savingThrows;

  public Character() {}

  public Character(Object userId, Object username, Object abilityScores, Object alignment, Object background, Object characterClass, Object equipment, Object hp, Object name, Object race, Object skillProficiencies, Object speed, Object savingThrows) {
    this.userId = userId;
    this.username = username;
    this.abilityScores = abilityScores;
    this.alignment = alignment;
    this.background = background;
    this.characterClass = characterClass;
    this.equipment = equipment;
    this.hp = hp;
    this.name = name;
    this.race = race;
    this.skillProficiencies = skillProficiencies;
    this.speed = speed;
    this.savingThrows = savingThrows;
  }

  public Character(String id, Object userId, Object username, Object abilityScores, Object alignment, Object background, Object characterClass, Object equipment, Object hp, Object name, Object race, Object skillProficiencies, Object speed, Object savingThrows) {
    this.id = id;
    this.userId = userId;
    this.username = username;
    this.abilityScores = abilityScores;
    this.alignment = alignment;
    this.background = background;
    this.characterClass = characterClass;
    this.equipment = equipment;
    this.hp = hp;
    this.name = name;
    this.race = race;
    this.skillProficiencies = skillProficiencies;
    this.speed = speed;
    this.savingThrows = savingThrows;
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Object getUserId() {
    return this.userId;
  }

  public void setUserId(Object userId) {
    this.userId = userId;
  }

  public Object getAbilityScores() {
    return this.abilityScores;
  }

  public void setAbilityScores(Object abilityScores) {
    this.abilityScores = abilityScores;
  }

  public Object getAlignment() {
    return this.alignment;
  }

  public void setAlignment(Object alignment) {
    this.alignment = alignment;
  }

  public Object getBackground() {
    return this.background;
  }

  public void setBackground(Object background) {
    this.background = background;
  }

  public Object getEquipment() {
    return this.equipment;
  }

  public void setEquipment(Object equipment) {
    this.equipment = equipment;
  }

  public Object getHp() {
    return this.hp;
  }

  public void setHp(Object hp) {
    this.hp = hp;
  }

  public Object getName() {
    return this.name;
  }

  public void setName(Object name) {
    this.name = name;
  }

  public Object getRace() {
    return this.race;
  }

  public void setRace(Object race) {
    this.race = race;
  }

  public Object getSkillProficiencies() {
    return this.skillProficiencies;
  }

  public void setSkillProficiencies(Object skillProficiencies) {
    this.skillProficiencies = skillProficiencies;
  }

  public Object getSpeed() {
    return this.speed;
  }

  public void setSpeed(Object speed) {
    this.speed = speed;
  }

  public Object getUsername() {
    return this.username;
  }

  public void setUsername(Object username) {
    this.username = username;
  }

  public Object getCharacterClass() {
    return this.characterClass;
  }

  public void setCharacterClass(Object characterClass) {
    this.characterClass = characterClass;
  }

  public Object getSavingThrows() {
    return this.savingThrows;
  }

  public void setSavingThrows(Object savingThrows) {
    this.savingThrows = savingThrows;
  }

}
