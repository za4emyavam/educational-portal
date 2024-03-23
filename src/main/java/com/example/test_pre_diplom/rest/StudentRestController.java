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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public List<Student> allStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable("id") Long id) {
        Optional<Student> student = studentRepository.findById(id);
        if (student.isPresent()) {
            return new ResponseEntity<>(student.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/student", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Student saveStudent(@RequestBody Student student) {
        isStudentDataExist(student);

        return studentRepository.save(student);
    }

    @PutMapping(path = "/student/{id}", consumes = "application/json")
    public Student putStudent(@PathVariable Long id, @RequestBody Student student) {
        if (!studentRepository.existsById(id))
            throw new StudentNotFoundException("Student with id: " + id + " not found.");

        isStudentDataExist(student);

        student.setStudentId(id);
        return studentRepository.save(student);
    }

    @PatchMapping(path = "/student/{id}", consumes = "application/json")
    public Student patchStudent(@PathVariable Long id, @RequestBody Student student) {
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

        return studentRepository.save(updatedStudent.get());
    }

    //TODO: This is just for test, do not push!

    /*@DeleteMapping("/student/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }*/

    private void isStudentDataExist(Student student) {
        Optional<Member> member = memberRepository.findById(student.getMember().getMemberId());
        if (member.isEmpty())
            throw new MemberNotFoundException("Member with id: " + student.getMember().getMemberId() + " not found.");

        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(student.getGroupId().getGroupId());
        if (studyGroup.isEmpty())
            throw new StudyGroupNotFoundException("Study group with id: " + student.getGroupId().getGroupId() + " not found.");
    }

}
