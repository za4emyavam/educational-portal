package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Member getByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new MemberNotFoundException("Member with email " + email + " not found"));
    }

    public UserDetailsService userDetailsService() {
        return this::getByEmail;
    }

    public Member save(String email, String password, Member.RoleType role) {
        Member member = new Member();
        member.setEmail(email);
        member.setRole(role);
        member.setPasswordHash(passwordEncoder.encode(password));

        return memberRepository.save(member);
    }

    public boolean isExistsByEmail(String email) {
        return memberRepository.existsByEmail(email);
    }

    public Member update(Member member) {
        return memberRepository.save(member);
    }
}
