package com.myproject.lab1.log;

import com.fasterxml.jackson.annotation.JsonProperty;

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