package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenId;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private LocalDateTime expiryDate;
}
