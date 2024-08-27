package com.example.test_pre_diplom.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;


@Data
@Entity
public class Member implements UserDetails {
    //TODO: validation
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long memberId;
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "role_type")
    private RoleType role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (this.role) {
            case ADMIN -> Arrays.asList(
                    new SimpleGrantedAuthority("ROLE_STUDENT"),
                    new SimpleGrantedAuthority("ROLE_TEACHER"),
                    new SimpleGrantedAuthority("ROLE_ADMIN"));
            case TEACHER -> List.of(
                    new SimpleGrantedAuthority("ROLE_TEACHER"));
            default -> List.of(
                    new SimpleGrantedAuthority("ROLE_STUDENT"));
        };
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum RoleType {
        STUDENT, TEACHER, ADMIN
    }
}
