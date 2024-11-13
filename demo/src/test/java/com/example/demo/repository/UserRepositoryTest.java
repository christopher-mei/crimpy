package com.example.demo.repository;  // Make sure package is correct

import com.example.demo.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;

// Remove @SpringBootTest, keep only @DataJpaTest
@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void shouldSaveAndRetrieveUser() {
        // given
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setActive(true);
        
        // when
        User savedUser = userRepository.save(user);
        
        // then
        assertThat(savedUser.getId()).isNotNull();
        assertThat(userRepository.findByUsername("testuser"))
            .isPresent()
            .get()
            .satisfies(found -> {
                assertThat(found.getEmail()).isEqualTo("test@example.com");
                assertThat(found.isActive()).isTrue();
            });
    }
}