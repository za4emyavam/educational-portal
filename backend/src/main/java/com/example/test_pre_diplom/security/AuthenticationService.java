package com.example.test_pre_diplom.security;

import com.example.test_pre_diplom.entities.RefreshToken;
import com.example.test_pre_diplom.entities.dto.JwtAuthenticationResponse;
import com.example.test_pre_diplom.entities.dto.LoginDTO;
import com.example.test_pre_diplom.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final MemberService memberService;
    private final JwtService jwtService;

    public AuthenticationService(AuthenticationManager authenticationManager, MemberService memberService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.memberService = memberService;
        this.jwtService = jwtService;
    }

    public JwtAuthenticationResponse authenticate(LoginDTO loginDTO) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDTO.getUsername(),
                loginDTO.getPassword()));

        UserDetails user = memberService.userDetailsService().loadUserByUsername(loginDTO.getUsername());

        return new JwtAuthenticationResponse(jwtService.generateToken(user), jwtService.getRefreshToken(user.getUsername()).getToken());
    }

    public Map<String, String> refreshToken(String refreshTokenStr) {
        return jwtService.findByToken(refreshTokenStr)
                .map(jwtService::verifyExpiration)
                .map(RefreshToken::getUsername)
                .map(username -> {
                    String newAccessToken = jwtService.generateToken(memberService.userDetailsService().loadUserByUsername(username));
                    Map<String, String> tokens = new HashMap<>();
                    tokens.put("accessToken", newAccessToken);
                    tokens.put("refreshToken", jwtService.getRefreshToken(username).getToken());
                    return tokens;
                })
                .orElseGet(() -> null);
    }

    @Transactional
    public void logout(String username) {
        jwtService.deleteByUsername(username);
    }
}
