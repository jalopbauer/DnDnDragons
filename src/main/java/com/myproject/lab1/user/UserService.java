package com.myproject.lab1.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public void save(User user) {
    userRepository.save(user);
  }

  public void delete(User user) {
    userRepository.delete(user);
  }

  public Optional<User> findById(String id) {
    return userRepository.findById(id);
  }

  public List<User> findAll() {
    return userRepository.findAll();
  }
  
}
