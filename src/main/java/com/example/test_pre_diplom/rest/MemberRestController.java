package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.data.PersonalDataRepository;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.PersonalData;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import com.example.test_pre_diplom.exceptions.PersonalDataNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class MemberRestController {
    private final MemberRepository memberRepository;
    private final PersonalDataRepository personalDataRepository;

    public MemberRestController(MemberRepository memberRepository, PersonalDataRepository personalDataRepository) {
        this.memberRepository = memberRepository;
        this.personalDataRepository = personalDataRepository;
    }

    @GetMapping("/members")
    public List<Member> allMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/member/{id}")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isPresent())
            return new ResponseEntity<>(member.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

    }

    @PostMapping(path = "/member", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Member saveMember(@RequestBody Member member) {
        return memberRepository.save(member);
    }

    @PatchMapping(path = "/member/{id}", consumes = "application/json")
    public Member patchMember(@PathVariable Long id, @RequestBody Member member) {
        Member updatedMember = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id:" + id + " not found."));

        if (member.getPasswordHash() != null) {
            //TODO Spring Security password ->
            updatedMember.setPasswordHash(member.getPasswordHash());
        }

        return memberRepository.save(updatedMember);
    }

    @DeleteMapping("/member/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberRepository.deleteById(id);
    }

    @GetMapping("/member/{id}/p_data")
    public ResponseEntity<PersonalData> getPersonalData(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);

        Optional<PersonalData> personalData = personalDataRepository.findByMember(member.get());
        if (personalData.isPresent())
            return new ResponseEntity<>(personalData.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/member/{id}/p_data", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public PersonalData savePersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);
        personalData.setMember(member.get());

        return personalDataRepository.save(personalData);
    }

    @PatchMapping(path = "/member/{id}/p_data", consumes = "application/json")
    public PersonalData patchPersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
        Member member = memberRepository.findById(id).orElseThrow(
                () -> new MemberNotFoundException("Member with id:" + id + " not found."));
        PersonalData savedPersonalData = personalDataRepository.findByMember(member)
                .orElseThrow(() -> new PersonalDataNotFoundException("Member's personal data with id: " + id + " not found."));
        if (personalData.getFirstName() != null)
            savedPersonalData.setFirstName(personalData.getFirstName());

        if (personalData.getLastName() != null)
            savedPersonalData.setLastName(personalData.getLastName());

        if (personalData.getDateOfBirth() != null)
            savedPersonalData.setDateOfBirth(personalData.getDateOfBirth());

        if (personalData.getPhoneNumber() != null)
            savedPersonalData.setPhoneNumber(personalData.getPhoneNumber());

        return personalDataRepository.save(savedPersonalData);
    }
}
