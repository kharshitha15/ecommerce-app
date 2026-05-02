package com.example.emostore.repository;

import com.example.emostore.model.RefreshToken;
import com.example.emostore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    java.util.List<RefreshToken> findByUserAndRevoked(User user, boolean revoked);
    
    @Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE RefreshToken t SET t.revoked = true WHERE t.user = :user")
    int revokeAllByUser(@org.springframework.data.repository.query.Param("user") User user);
}
