package com.myproject.lab1.session;

public class Icon {
  private String id;
  private Integer x;
  private Integer y;
  private String username;
  private String color;

  public Icon() {
  }

  public Icon(String id, Integer x, Integer y, String username, String color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.username = username;
    this.color = color;
  }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Integer getX() {
    return this.x;
  }

  public void setX(Integer x) {
    this.x = x;
  }

  public Integer getY() {
    return this.y;
  }

  public void setY(Integer y) {
    this.y = y;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getColor() {
    return this.color;
  }

  public void setColor(String color) {
    this.color = color;
  }

}
