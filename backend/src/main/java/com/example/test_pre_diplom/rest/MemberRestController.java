package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.data.PersonalDataRepository;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.PersonalData;
import com.example.test_pre_diplom.entities.dto.ChangePasswordDTO;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import com.example.test_pre_diplom.exceptions.PersonalDataNotFoundException;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class MemberRestController {
    private final MemberRepository memberRepository;
    private final PersonalDataRepository personalDataRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberRestController(MemberRepository memberRepository, PersonalDataRepository personalDataRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.personalDataRepository = personalDataRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/members")
    public List<Member> allMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/members/{id}")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isPresent())
            return new ResponseEntity<>(member.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/members", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Member saveMember(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @PatchMapping(path = "/members/{id}", consumes = "application/json")
    public Member patchMember(@PathVariable Long id, @RequestBody Member member) {
        Member updatedMember = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id:" + id + " not found."));

        if (member.getPasswordHash() != null) {
            //TODO Spring Security password ->
            updatedMember.setPasswordHash(member.getPasswordHash());
        }

        return memberRepository.save(updatedMember);
    }

    @DeleteMapping("/members/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberRepository.deleteById(id);
    }

    @GetMapping("/members/{id}/p_data")
    public ResponseEntity<PersonalData> getPersonalData(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);

        Optional<PersonalData> personalData = personalDataRepository.findByMember(member.get());
        if (personalData.isPresent())
            return new ResponseEntity<>(personalData.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/members/{id}/p_data", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public PersonalData savePersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);
        personalData.setMember(member.get());

        return personalDataRepository.save(personalData);
    }

    @PatchMapping(path = "/members/{id}/p_data", consumes = "application/json")
    public PersonalData patchPersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
        Member member = memberRepository.findById(id).orElseThrow(
                () -> new MemberNotFoundException("Member with id:" + id + " not found."));
        PersonalData savedPersonalData = personalDataRepository.findByMember(member)
                .orElseThrow(() -> new PersonalDataNotFoundException("Member's personal data with id: " + id + " not found."));
        if (personalData.getFirstName() != null)
            savedPersonalData.setFirstName(personalData.getFirstName());

        if (personalData.getLastName() != null)
            savedPersonalData.setLastName(personalData.getLastName());

        return personalDataRepository.save(savedPersonalData);
    }

    @PostMapping(path = "/members/{memberId}/change_password")
    public ResponseEntity<?> changePassword(@PathVariable Long memberId,
                                            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Member member = memberRepository.findById(memberId).orElseThrow(
                () -> new MemberNotFoundException("Member with id:" + memberId + " not found."));

        if (passwordEncoder.matches(changePasswordDTO.getOldPassword(), member.getPasswordHash())) {
            member.setPasswordHash(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
            memberRepository.save(member);
            return new ResponseEntity<>(member, HttpStatus.OK);
        }
        return new ResponseEntity<>("Invalid current password", HttpStatus.UNAUTHORIZED);
    }
}
