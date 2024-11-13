// src/main/java/com/example/demo/dto/LoginResponse.java
package com.example.demo.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LoginResponse {
    private UserDTO user;
    private String token;
}