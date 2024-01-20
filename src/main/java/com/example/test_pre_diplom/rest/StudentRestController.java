package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.StudyGroupRepository;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import com.example.test_pre_diplom.exceptions.StudentNotFoundException;
import com.example.test_pre_diplom.exceptions.StudyGroupNotFoundException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Optional;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class StudentRestController {
    private final StudentRepository studentRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final MemberRepository memberRepository;

    public StudentRestController(StudentRepository studentRepository, StudyGroupRepository studyGroupRepository, MemberRepository memberRepository) {
        this.studentRepository = studentRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.memberRepository = memberRepository;
    }

    @GetMapping("/students")
    public CollectionModel<Student> allStudents() {
        return CollectionModel.of(studentRepository.findAll());
    }

    @GetMapping("/student/{id}")
    public EntityModel<Student> getStudent(@PathVariable Long id) {
        return EntityModel.of(
                        studentRepository.findById(id)
                                .orElseThrow(() -> new StudentNotFoundException("Student with id: " + id + " not found.")))
                .add(
                        WebMvcLinkBuilder.linkTo(
                                WebMvcLinkBuilder.methodOn(this.getClass()).allStudents()
                        ).withRel("all-students")
                );
    }

    @PostMapping(path = "/student", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Student> saveStudent(@RequestBody Student student) {
        Optional<Member> member = memberRepository.findById(student.getMember().getMemberId());
        if (member.isEmpty())
            throw new MemberNotFoundException("Member with id: " + student.getMember().getMemberId() + " not found.");

        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(student.getGroupId().getGroupId());
        if (studyGroup.isEmpty()) {
            throw new StudyGroupNotFoundException("Study group with id: " + student.getGroupId().getGroupId() + " not found.");
        }

        studentRepository.save(student);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().build().toUri())
                .build();
    }

    @PutMapping(path = "/student/{id}", consumes = "application/json")
    public ResponseEntity<Student> putStudent(@PathVariable Long id, @RequestBody Student student) {
        if (!studentRepository.existsById(id))
            throw new StudentNotFoundException("Student with id: " + id + " not found.");

        Optional<Member> member = memberRepository.findById(student.getMember().getMemberId());
        if (member.isEmpty())
            throw new MemberNotFoundException("Member with id: " + student.getMember().getMemberId() + " not found.");

        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(student.getGroupId().getGroupId());
        if (studyGroup.isEmpty()) {
            throw new StudyGroupNotFoundException("Study group with id: " + student.getGroupId().getGroupId() + " not found.");
        }

        student.setStudentId(id);
        studentRepository.save(student);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().build().toUri())
                .build();
    }

    @PatchMapping(path = "/student/{id}", consumes = "application/json")
    public ResponseEntity<Student> patchStudent(@PathVariable Long id, @RequestBody Student student) {
        Optional<Student> updatedStudent = studentRepository.findById(id);
        if (updatedStudent.isEmpty()) {
            throw new StudentNotFoundException("Student with id: " + id + " not found.");
        }

        if (student.getGroupId() != null) {
            Optional<StudyGroup> studyGroup = studyGroupRepository.findById(student.getGroupId().getGroupId());
            if (studyGroup.isEmpty()) {
                throw new StudyGroupNotFoundException("Study group with id: " + student.getGroupId().getGroupId() + " not found.");
            }

            updatedStudent.get().setGroupId(studyGroup.get());
        }

        if (student.getMember() != null) {
            Optional<Member> member = memberRepository.findById(student.getMember().getMemberId());
            if (member.isEmpty())
                throw new MemberNotFoundException("Member with id: " + student.getMember().getMemberId() + " not found.");

            updatedStudent.get().setMember(member.get());
        }

        if (student.getYearOfEntry() != null) {
            updatedStudent.get().setYearOfEntry(student.getYearOfEntry());
        }

        studentRepository.save(updatedStudent.get());
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().build().toUri())
                .build();
    }
}
