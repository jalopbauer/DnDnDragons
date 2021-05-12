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
  private ArrayList<String> chatMessages;
  private ArrayList<String> logMessages;

  public Session() {}

  public Session(String name, 
                 String inviteId, 
                 String creatorId, 
                 ArrayList<Object> playersData, 
                 ArrayList<String> chatMessages, 
                 ArrayList<String> logMessages) {
    this.name = name;
    this.inviteId = inviteId;
    this.creatorId = creatorId;
    this.playersData = playersData;
    this.chatMessages = chatMessages;
    this.logMessages = logMessages;
  }


  public Session(String id, 
                 String name, 
                 String inviteId, 
                 String creatorId, 
                 ArrayList<Object> playersData, 
                 ArrayList<String> chatMessages, 
                 ArrayList<String> logMessages) {
    this.id = id;
    this.name = name;
    this.inviteId = inviteId;
    this.creatorId = creatorId;
    this.playersData = playersData;
    this.chatMessages = chatMessages;
    this.logMessages = logMessages;
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

  public ArrayList<String> getChatMessages() {
    return this.chatMessages;
  }

  public void setChatMessages(ArrayList<String> chatMessages) {
    this.chatMessages = chatMessages;
  }

  public ArrayList<String> getLogMessages() {
    return this.logMessages;
  }

  public void setLogMessages(ArrayList<String> logMessages) {
    this.logMessages = logMessages;
  }

}
