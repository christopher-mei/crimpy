package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.active = true AND u.email LIKE %:domain%")
    List<User> findActiveUsersByEmailDomain(String domain);
    
    @Query(value = "SELECT * FROM users WHERE created_at >= NOW() - INTERVAL '24 HOURS'", 
           nativeQuery = true)
    List<User> findUsersCreatedInLast24Hours();
}