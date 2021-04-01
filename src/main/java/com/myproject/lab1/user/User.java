package com.myproject.lab1.user;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private String id;
  
  @NotNull(message = "Username is mandatory")
  @Size(min = 3, max = 20)
  private String username;
  
  @NotNull(message = "Email is mandatory")
  @Size(max = 50)
  @Email
  private String email;
  
  @NotNull(message = "Password is mandatory")
  @Size(max = 50)
  private String password;

  public User() {}

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  // public User(String id, String username, String email, String password) {
  //   this.id = id;
  //   this.username = username;
  //   this.email = email;
  //   this.password = password;
  // }

  public String getId() {
    return this.id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUsername() {
    return this.username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return this.email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return this.password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

}
