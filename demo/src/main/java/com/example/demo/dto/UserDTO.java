// src/main/java/com/example/demo/dto/UserDTO.java
package com.example.demo.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private boolean active;
}