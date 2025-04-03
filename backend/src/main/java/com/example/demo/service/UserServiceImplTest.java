package com.example.demo.service;

import com.example.demo.dao.UserDAO;
import com.example.demo.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserDAO userDAO;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password");
    }

    @Test
    void findByUsernameOrEmail_WithValidUsername_ReturnsUser() {
        // Arrange
        when(userDAO.findByUsernameOrEmail("testuser")).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findByUsernameOrEmail("testuser");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        verify(userDAO, times(1)).findByUsernameOrEmail("testuser");
    }

    @Test
    void findByUsernameOrEmail_WithValidEmail_ReturnsUser() {
        // Arrange
        when(userDAO.findByUsernameOrEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        Optional<User> result = userService.findByUsernameOrEmail("test@example.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
        verify(userDAO, times(1)).findByUsernameOrEmail("test@example.com");
    }

    @Test
    void findByUsernameOrEmail_WithInvalidIdentifier_ReturnsEmpty() {
        // Arrange
        when(userDAO.findByUsernameOrEmail("nonexistent")).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.findByUsernameOrEmail("nonexistent");

        // Assert
        assertFalse(result.isPresent());
        verify(userDAO, times(1)).findByUsernameOrEmail("nonexistent");
    }

    @Test
    void saveUser_WithValidUser_ReturnsEncodedUser() {
        // Arrange
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userDAO.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.saveUser(testUser);

        // Assert
        assertNotNull(result);
        verify(passwordEncoder, times(1)).encode("password");
        verify(userDAO, times(1)).save(testUser);
    }

    @Test
    void saveUser_WithDuplicateUser_ThrowsException() {
        // Arrange
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userDAO.save(any(User.class))).thenThrow(new DataIntegrityViolationException("Duplicate entry"));

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.saveUser(testUser);
        });
        
        assertEquals("Email or Username already exists.", exception.getMessage());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userDAO, times(1)).save(any(User.class));
    }
}