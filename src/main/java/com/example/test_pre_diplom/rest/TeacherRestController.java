package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.data.MemberRepository;
import com.example.test_pre_diplom.data.TeacherRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.Teacher;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import com.example.test_pre_diplom.exceptions.MemberNotFoundException;
import com.example.test_pre_diplom.exceptions.TeacherNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class TeacherRestController {
    private final TeacherRepository teacherRepository;
    private final MemberRepository memberRepository;
    private final FacultyRepository facultyRepository;

    public TeacherRestController(TeacherRepository teacherRepository, MemberRepository memberRepository, FacultyRepository facultyRepository) {
        this.teacherRepository = teacherRepository;
        this.memberRepository = memberRepository;
        this.facultyRepository = facultyRepository;
    }

    @GetMapping("/teachers")
    public List<Teacher> allTeachers() {
        return teacherRepository.findAll();
    }

    @GetMapping("/teacher/{id}")
    public ResponseEntity<Teacher> getTeacher(@PathVariable Long id) {
        Optional<Teacher> teacher = teacherRepository.findById(id);
        if (teacher.isPresent())
            return new ResponseEntity<>(teacher.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    //TODO: maybe should change smth or make view Teacher class only with id of member and faculty idk
    @PostMapping(path = "/teacher", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Teacher saveTeacher(@RequestBody Teacher teacher) {
        isTeacherDataExist(teacher);

        return teacherRepository.save(teacher);
    }

    @DeleteMapping(path = "/teacher/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable Long id) {
        teacherRepository.deleteById(id);
    }

    @PutMapping(path = "/teacher/{id}", consumes = "application/json")
    public Teacher putTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
        if (!teacherRepository.existsById(id)) {
            throw new TeacherNotFoundException("Teacher with id: " + id + " not found");
        }

        isTeacherDataExist(teacher);

        teacher.setTeacherId(id);
        return teacherRepository.save(teacher);
    }

    @PatchMapping(path = "/teacher/{id}", consumes = "application/json")
    public Teacher patchTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> updatedTeacher = teacherRepository.findById(id);
        if (updatedTeacher.isEmpty()) {
            throw new TeacherNotFoundException("Teacher with id: " + id + " not found");
        }

        if (teacher.getMember() != null) {
            Optional<Member> member = memberRepository.findById(teacher.getMember().getMemberId());
            if (member.isEmpty())
                throw new MemberNotFoundException("Member with id: " + teacher.getMember().getMemberId() + " not found.");

            updatedTeacher.get().setMember(member.get());
        }

        if (teacher.getFaculty() != null) {
            Optional<Faculty> faculty = facultyRepository.findById(teacher.getFaculty().getFacultyId());
            if (faculty.isEmpty()) {
                throw new FacultyNotFoundException("Faculty with id: " + teacher.getFaculty().getFacultyId() + " not found.");
            }

            updatedTeacher.get().setFaculty(faculty.get());
        }

        return teacherRepository.save(updatedTeacher.get());
    }

    private void isTeacherDataExist(@RequestBody Teacher teacher) {
        Optional<Member> member = memberRepository.findById(teacher.getMember().getMemberId());
        if (member.isEmpty())
            throw new MemberNotFoundException("Member with id: " + teacher.getMember().getMemberId() + " not found.");

        Optional<Faculty> faculty = facultyRepository.findById(teacher.getFaculty().getFacultyId());
        if (faculty.isEmpty()) {
            throw new FacultyNotFoundException("Faculty with id: " + teacher.getFaculty().getFacultyId() + " not found.");
        }
    }
}