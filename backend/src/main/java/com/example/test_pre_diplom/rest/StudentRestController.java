package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.StudentCreateDTO;
import com.example.test_pre_diplom.entities.dto.StudentInfoDTO;
import com.example.test_pre_diplom.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class StudentRestController {
    private final StudentService studentService;

    public StudentRestController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public List<StudentInfoDTO> allStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/students/{studentId}")
    public StudentInfoDTO getStudent(@PathVariable Long studentId) {
        return studentService.getStudentById(studentId);
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveStudent(@Valid @RequestBody StudentCreateDTO student,
                               BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Student savedStudent = studentService.save(student);
        return savedStudent != null ? ResponseEntity.ok(savedStudent) : new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/students/{studentId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @Valid @RequestBody StudentCreateDTO studentCreateDTO,
                                        BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        StudentInfoDTO savedStudent = studentService.update(studentId, studentCreateDTO);
        return savedStudent != null ? ResponseEntity.ok(savedStudent) : new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/students/{studentId}")
    public void delete(@PathVariable Long studentId) {
        studentService.delete(studentId);
    }


    /*@PostMapping(path = "/students", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public Student saveStudent(@RequestBody Student student) {
        isStudentDataExist(student);
        return studentRepository.save(student);
    }*/

    /*@PutMapping(path = "/students/{id}", consumes = "application/json")
    public Student putStudent(@PathVariable Long id, @RequestBody Student student) {
        if (!studentRepository.existsById(id))
            throw new StudentNotFoundException("Student with id: " + id + " not found.");

        student.setStudentId(id);
        isStudentDataExist(student);

        return studentRepository.save(student);
    }*/


    //TODO: This is just for test, do not push!

    /*@DeleteMapping("/students/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }*/

    /*private void isStudentDataExist(Student student) {
        Optional<PersonalData> personalData = personalDataRepository.findById(student.getStudentId());
        if (personalData.isEmpty())
            throw new StudentNotFoundException("Student with id: " + student.getStudentId() + " not found.");

        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(student.getGroupId().getGroupId());
        if (studyGroup.isEmpty())
            throw new StudyGroupNotFoundException("Study group with id: " + student.getGroupId().getGroupId() + " not found.");

        Optional<Major> major = majorRepository.findById(student.getMajor().getMajorId());
        if (major.isEmpty())
            throw new MajorNotFoundException("Major with code: " + student.getMajor().getMajorId() + " not found.");
    }*/

}
