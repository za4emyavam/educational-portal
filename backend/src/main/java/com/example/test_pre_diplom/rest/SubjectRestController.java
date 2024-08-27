package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.Subject;
import com.example.test_pre_diplom.entities.Teacher;
import com.example.test_pre_diplom.entities.dto.RenewInfoDTO;
import com.example.test_pre_diplom.entities.dto.StudentInfoDTO;
import com.example.test_pre_diplom.entities.dto.SubjectCreateDTO;
import com.example.test_pre_diplom.entities.dto.SubjectInfoDTO;
import com.example.test_pre_diplom.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class SubjectRestController {
    private final SubjectService subjectService;

    public SubjectRestController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping("/subjects")
    public List<SubjectInfoDTO> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/subjects/{subjectId}")
    public SubjectInfoDTO getSubject(@PathVariable Long subjectId) {
        return subjectService.getSubjectById(subjectId);
    }

    @PostMapping(path = "/subjects", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveSubject(@Valid @RequestBody SubjectCreateDTO subject, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Subject savedSubject = subjectService.saveSubject(subject);

        return savedSubject == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<>(savedSubject, HttpStatus.CREATED);
    }

    @PutMapping(path = "/subjects/{subjectId}", consumes = "application/json")
    public ResponseEntity<?> putSubject(@PathVariable Long subjectId, @Valid @RequestBody SubjectCreateDTO subject,
                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }


        Subject savedSubject = subjectService.putSubject(subjectId, subject);

        return savedSubject == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<>(savedSubject, HttpStatus.CREATED);
    }

    @GetMapping(path = "/subjects/{id}/study_groups")
    public Set<StudyGroup> getStudyGroupsBySubject(@PathVariable Long id) {
        return subjectService.getStudyGroupsForSubject(id);
    }

    @DeleteMapping("/subjects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }

    @GetMapping("/subjects/student/{studentId}")
    public List<Subject> getSubjectsByStudent(@PathVariable Long studentId) {
        return subjectService.getAllSubjectsByStudent(studentId);
    }

    @GetMapping("/subjects/study_groups/{studyGroupId}")
    public List<SubjectInfoDTO> getSubjectsByStudentGroup(@PathVariable Long studyGroupId) {
        return subjectService.getAllSubjectsByStudentGroup(studyGroupId);
    }

    @GetMapping("/subjects/teacher/{teacherId}")
    public List<SubjectInfoDTO> getSubjectsByTeacher(@PathVariable Long teacherId) {
        return subjectService.getAllSubjectByTeacher(teacherId);
    }

    @GetMapping("/subjects/{subjectId}/renew")
    public List<RenewInfoDTO> getRenewInfoBySubject(@PathVariable Long subjectId) {
        return subjectService.getRenewInfoBySubject(subjectId);
    }

    @GetMapping("/subjects/{subjectId}/student/{studentId}")
    public StudentInfoDTO getStudentInSubject(@PathVariable Long subjectId, @PathVariable Long studentId) {
        return subjectService.getStudentInSubject(subjectId, studentId);
    }
}
