package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.data.PersonalDataRepository;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.PersonalData;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import com.example.test_pre_diplom.exceptions.PersonalDataNotFoundException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
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
    public CollectionModel<Member> allMembers() {
        return CollectionModel.of(memberRepository.findAll());
    }

    @GetMapping("/member/{id}")
    public EntityModel<Member> getMember(@PathVariable Long id) {
        return EntityModel.of(
                        memberRepository.findById(id).orElseThrow(
                                () -> new MemberNotFoundException("id:" + id)))
                .add(
                        WebMvcLinkBuilder.linkTo(
                                        WebMvcLinkBuilder.methodOn(this.getClass()).allMembers())
                                .withRel("all-members"))
                .add(
                        WebMvcLinkBuilder.linkTo(
                                        WebMvcLinkBuilder.methodOn(this.getClass()).getPersonalData(id))
                                .withRel("personal-data")
                );
    }

    @PostMapping(path = "/member", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Member> saveMember(@RequestBody Member member) {
        Member savedMember = memberRepository.save(member);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri().path("/{id}")
                .build(savedMember.getMemberId());
        return ResponseEntity.created(uri).build();
    }

    @PatchMapping(path = "/member/{id}", consumes = "application/json")
    public ResponseEntity<Member> patchMember(@PathVariable Long id, @RequestBody Member member) {
        Member updatedMember = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id:" + id + " not found."));

        if (member.getPasswordHash() != null) {
            //TODO Spring Security password ->
            updatedMember.setPasswordHash(member.getPasswordHash());
        }

        memberRepository.save(updatedMember);
        return ResponseEntity.created(ServletUriComponentsBuilder.fromCurrentRequest().build().toUri()).build();
    }

    @DeleteMapping("/member/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberRepository.deleteById(id);
    }

    @GetMapping("/member/{id}/p_data")
    public EntityModel<PersonalData> getPersonalData(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);
        return EntityModel.of(personalDataRepository.findByMember(member.get()).orElseThrow(
                        () -> new PersonalDataNotFoundException("Member's personal data with id: " + id + " not found.")))
                .add(
                        WebMvcLinkBuilder.linkTo(
                                WebMvcLinkBuilder.methodOn(this.getClass()).getMember(id)
                        ).withRel("member")
                );

    }

    @PostMapping(path = "/member/{id}/p_data", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<PersonalData> savePersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty())
            throw new MemberNotFoundException("id:" + id);
        personalData.setMember(member.get());
        personalDataRepository.save(personalData);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().build().toUri())
                .build();
    }

    @PatchMapping(path = "/member/{id}/p_data", consumes = "application/json")
    public ResponseEntity<PersonalData> patchPersonalData(@PathVariable Long id, @RequestBody PersonalData personalData) {
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

        personalDataRepository.save(savedPersonalData);

        return ResponseEntity.created(ServletUriComponentsBuilder.fromCurrentRequest().build().toUri()).build();
    }
}
