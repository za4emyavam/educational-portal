package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.*;
import com.example.test_pre_diplom.entities.*;
import com.example.test_pre_diplom.entities.dto.MajorDTO;
import com.example.test_pre_diplom.entities.dto.RenewInfoDTO;
import com.example.test_pre_diplom.entities.dto.TeacherCreateDTO;
import com.example.test_pre_diplom.entities.dto.TeacherInfoDTO;
import com.example.test_pre_diplom.exceptions.*;
import com.example.test_pre_diplom.service.TeacherService;
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
public class TeacherRestController {
    private final TeacherService teacherService;

    public TeacherRestController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/teachers")
    public List<TeacherInfoDTO> allTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/teachers/{teacherId}")
    public TeacherInfoDTO getTeacher(@PathVariable Long teacherId) {
        return teacherService.getTeacherById(teacherId);
    }

    @PostMapping(path = "/teachers")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveTeacher(@Valid @RequestBody TeacherCreateDTO teacher, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Teacher savedTeacher = teacherService.save(teacher);
        return savedTeacher != null ? ResponseEntity.ok(savedTeacher) : new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(path = "/teachers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
    }

    @GetMapping("/teachers/{teacherId}/renews")
    public List<RenewInfoDTO> getAllRenewInfoForTeacher(@PathVariable Long teacherId) {
        return teacherService.getAllRenewInfo(teacherId);
    }

    @PutMapping("/teachers/{teacherId}")
    public ResponseEntity<?> putTeacher(@PathVariable Long teacherId, @Valid @RequestBody TeacherCreateDTO teacherCreateDTO,
                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        TeacherInfoDTO teacherInfoDTO = teacherService.update(teacherId, teacherCreateDTO);

        return teacherInfoDTO != null ? new ResponseEntity<>(teacherInfoDTO, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    /*@PutMapping(path = "/teachers/{id}", consumes = "application/json")
    public Teacher putTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
        if (!teacherRepository.existsById(id)) {
            throw new TeacherNotFoundException("Teacher with id: " + id + " not found");
        }

        isTeacherDataExist(teacher);

        teacher.setTeacherId(id);
        return teacherRepository.save(teacher);
    }*/

    /*@PatchMapping(path = "/teachers/{id}", consumes = "application/json")
    public Teacher patchTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
        Optional<Teacher> updatedTeacher = teacherRepository.findById(id);
        if (updatedTeacher.isEmpty()) {
            throw new TeacherNotFoundException("Teacher with id: " + id + " not found");
        }

        if (teacher.getDepartment() != null) {
            Optional<Department> department = departmentRepository.findById(teacher.getDepartment().getDepartmentId());
            if (department.isEmpty()) {
                throw new DepartmentNotFoundException("Department with id: " + teacher.getDepartment().getDepartmentId() + " not found.");
            }

            updatedTeacher.get().setDepartment(department.get());
        }

        return teacherRepository.save(updatedTeacher.get());
    }*/

    /*private void isTeacherDataExist(@RequestBody Teacher teacher) {
        Optional<PersonalData> personalData = personalDataRepository.findById(teacher.getTeacherId());
        if (personalData.isEmpty())
            throw new PersonalDataNotFoundException("Personal data with id: " + teacher.getTeacherId() + " not found.");

        Optional<Department> faculty = departmentRepository.findById(teacher.getDepartment().getDepartmentId());
        if (faculty.isEmpty()) {
            throw new DepartmentNotFoundException("Department with id: " + teacher.getDepartment().getDepartmentId() + " not found.");
        }
    }*/
}