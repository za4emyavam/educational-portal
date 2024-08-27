package com.example.test_pre_diplom.security;

import com.example.test_pre_diplom.entities.RefreshToken;
import com.example.test_pre_diplom.entities.dto.JwtAuthenticationResponse;
import com.example.test_pre_diplom.entities.dto.LoginDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class LogInRestController {
    private final AuthenticationService authenticationService;

    public LogInRestController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public JwtAuthenticationResponse signIn(@RequestBody LoginDTO loginDTO) {
        return authenticationService.authenticate(loginDTO);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshTokenStr = request.get("refreshToken");
        Map<String, String> newTokens = authenticationService.refreshToken(refreshTokenStr);
        return newTokens == null ? new ResponseEntity<>(HttpStatus.FORBIDDEN) : new ResponseEntity<>(newTokens, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        authenticationService.logout(username);
        return ResponseEntity.ok("User logged out successfully.");
    }
}
