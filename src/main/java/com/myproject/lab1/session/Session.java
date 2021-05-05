package com.myproject.lab1.session;

import java.util.ArrayList;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sessions")
public class Session {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private String id;

  private String name;
  private String inviteId;
  private String creatorId; // id del creador de la session
  private ArrayList<Object> playersData;

  public Session() {}

  public Session(String name, String inviteId, String creatorId, ArrayList<Object> playersData) {
    this.name = name;
    this.inviteId = inviteId;
    this.creatorId = creatorId;
    this.playersData = playersData;  
  }


  public Session(String id, String name, String inviteId, String creatorId, ArrayList<Object> playersData) {
    this.id = id;
    this.name = name;
    this.inviteId = inviteId;
    this.creatorId = creatorId;
    this.playersData = playersData;
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

  public String getInviteId() {
    return this.inviteId;
  }

  public void setInviteId(String inviteId) {
    this.inviteId = inviteId;
  }

  public String getCreatorId() {
    return this.creatorId;
  }

  public void setCreatorId(String creatorId) {
    this.creatorId = creatorId;
  }

  public ArrayList<Object> getPlayersData() {
    return this.playersData;
  }

  public void setPlayersData(ArrayList<Object> playersData) {
    this.playersData = playersData;
  }

}
