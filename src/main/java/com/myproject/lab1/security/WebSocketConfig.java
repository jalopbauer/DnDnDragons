package com.myproject.lab1.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry config) {
      config.enableSimpleBroker("/topic");
      config.setApplicationDestinationPrefixes("/api");
    }

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
      // registry.addEndpoint("/logMessage").setAllowedOrigins("*");
      // registry.addEndpoint("/logMessage").setAllowedOrigins("*").withSockJS();
      registry.addEndpoint("/log").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002");
      registry.addEndpoint("/log").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002").withSockJS();
    
      registry.addEndpoint("/chat").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002");
      registry.addEndpoint("/chat").setAllowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002").withSockJS();
    }
}