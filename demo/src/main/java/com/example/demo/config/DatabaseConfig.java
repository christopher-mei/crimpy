// 1. Database Connection Test Configuration
// src/main/java/com/example/config/DatabaseConfig.java
package com.example.config.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class DatabaseConfig {
    
    @Bean
    CommandLineRunner testDatabaseConnection(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                log.info("Testing database connection...");
                String result = jdbcTemplate.queryForObject("SELECT version()", String.class);
                log.info("Database connection successful! PostgreSQL version: {}", result);
            } catch (Exception e) {
                log.error("Database connection failed!", e);
                throw e;
            }
        };
    }
}