package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.example.demo.service.UserService;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.UserDTO;       // Add this
import com.example.demo.dto.LoginResponse; // Add this
import lombok.Data;  // Add this for ErrorResponse


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for username: " + request.getUsername());
            
            UserDTO user = userService.authenticateUser(
                request.getUsername(), 
                request.getPassword()
            );
            
            System.out.println("Authenticated user: " + user);
            
            if (user != null) {
                LoginResponse response = new LoginResponse(user, "temp-token");
                System.out.println("Sending response: " + response);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401)
                    .body(new ErrorResponse("Invalid credentials"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ErrorResponse("Login failed: " + e.getMessage()));
        }
    }
}

// Add these classes
@Data
class ErrorResponse {
    private String message;
    
    public ErrorResponse(String message) {
        this.message = message;
    }
}