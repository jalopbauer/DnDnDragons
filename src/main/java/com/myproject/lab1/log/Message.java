package com.myproject.lab1.log;

public class Message {

  // @JsonProperty("from")
  private String from;

  // @JsonProperty("text")
  private String text;

  public String getText() {
      return text;
  }

  public String getFrom() {
      return from;
  }
}