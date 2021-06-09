package com.myproject.lab1.session;

import java.util.ArrayList;

public class PlayerData {
  private String username;
  private String characterId;
  private Integer characterCurrentHP;
  private ArrayList<String> characterEquipment;

  public PlayerData(String username, String characterId, Integer characterCurrentHP, ArrayList<String> characterEquipment) {
    this.username = username;
    this.characterId = characterId;
    this.characterCurrentHP = characterCurrentHP;
    this.characterEquipment = characterEquipment;
  }
  

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getCharacterId() {
    return this.characterId;
  }

  public void setCharacterId(String characterId) {
    this.characterId = characterId;
  }

  public Integer getCharacterCurrentHP() {
    return this.characterCurrentHP;
  }

  public void setCharacterCurrentHP(Integer characterCurrentHP) {
    this.characterCurrentHP = characterCurrentHP;
  }

  public ArrayList<String> getCharacterEquipment() {
    return this.characterEquipment;
  }

  public void setCharacterEquipment(ArrayList<String> characterEquipment) {
    this.characterEquipment = characterEquipment;
  }

}
