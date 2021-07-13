package com.myproject.lab1.session;

import java.util.ArrayList;

public class PlayerData {
  private String username;
  private String characterId;
  private Integer characterCurrentHP;
  private ArrayList<String> characterEquipment;
  private Boolean isBlocked;

  public PlayerData(String username, String characterId, Integer characterCurrentHP, ArrayList<String> characterEquipment, Boolean isBlocked) {
    this.username = username;
    this.characterId = characterId;
    this.characterCurrentHP = characterCurrentHP;
    this.characterEquipment = characterEquipment;
    this.isBlocked = isBlocked;
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

  public Boolean getIsBlocked() {
    return this.isBlocked;
  }

  public void setIsBlocked(Boolean isBlocked) {
    this.isBlocked = isBlocked;
  }

}
