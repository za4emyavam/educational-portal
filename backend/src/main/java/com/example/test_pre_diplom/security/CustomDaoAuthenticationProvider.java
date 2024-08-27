package com.example.test_pre_diplom.security;

import com.example.test_pre_diplom.service.MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomDaoAuthenticationProvider {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    public CustomDaoAuthenticationProvider(MemberService memberService, PasswordEncoder passwordEncoder) {
        this.memberService = memberService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(memberService.userDetailsService());
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }
}
