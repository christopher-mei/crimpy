package com.example.demo.service;
import com.example.demo.dto.UserDTO;  // Add this import

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor  // Lombok will create constructor for final fields
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // Add this for password encoding

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
    
    @Transactional
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);  // Set default active status
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        
        // Only update password if it's provided
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        user.setActive(userDetails.isActive());
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setActive(false);
        userRepository.save(user);
    }

    // Add authentication method
    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
            .map(user -> passwordEncoder.matches(password, user.getPassword()))
            .orElse(false);
    }

    public UserDTO authenticateUser(String username, String password) {
        System.out.println("Authenticating user: " + username);
        
        return userRepository.findByUsername(username)
            .filter(user -> {
                boolean matches = passwordEncoder.matches(password, user.getPassword());
                System.out.println("Password matches: " + matches);
                return matches;
            })
            .map(user -> {
                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setUsername(user.getUsername());
                dto.setEmail(user.getEmail());
                dto.setActive(user.isActive());
                System.out.println("Created DTO: " + dto);
                return dto;
            })
            .orElse(null);
    }

    // Add this helper method to convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        // Don't include password in DTO
        return dto;
    }

    @PostConstruct
    public void init() {
        try {
            System.out.println("Checking if users exist...");
            if (userRepository.count() == 0) {
                System.out.println("No users found, creating test user...");
                User user = new User();
                user.setUsername("testuser");
                user.setPassword(passwordEncoder.encode("password"));
                user.setEmail("test@example.com");
                user.setActive(true);
                User savedUser = userRepository.save(user);
                System.out.println("Test user created successfully: " + savedUser);
            }
        } catch (Exception e) {
            System.err.println("Error during initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }

}