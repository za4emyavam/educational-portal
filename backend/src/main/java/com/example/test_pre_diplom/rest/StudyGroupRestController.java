package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.dto.StudentInfoDTO;
import com.example.test_pre_diplom.entities.dto.StudyGroupCreateDTO;
import com.example.test_pre_diplom.service.StudyGroupService;
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
public class StudyGroupRestController {
    private final StudyGroupService studyGroupService;

    public StudyGroupRestController(StudyGroupService studyGroupService) {
        this.studyGroupService = studyGroupService;
    }

    @GetMapping("/study_groups")
    public List<StudyGroup> allStudyGroup() {
        return studyGroupService.findAll();
    }

    @GetMapping("/study_groups/{id}/students")
    public List<StudentInfoDTO> allStudentsByGroup(@PathVariable Long id) {
        return studyGroupService.allStudentsByGroup(id);
    }

    @GetMapping("/study_groups/{id}")
    public StudyGroup getStudyGroup(@PathVariable Long id) {
        return studyGroupService.getStudyGroup(id);
    }

    @PostMapping(path = "/study_groups", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveStudyGroup(@Valid @RequestBody StudyGroupCreateDTO studyGroupDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        StudyGroup studyGroup = studyGroupService.save(studyGroupDTO);

        return studyGroup == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<>(studyGroup, HttpStatus.CREATED);
    }

    @PutMapping(path = "/study_groups/{groupId}", consumes = "application/json")
    public ResponseEntity<?> updateStudyGroup(@PathVariable Long groupId,
                                              @Valid @RequestBody StudyGroupCreateDTO studyGroupDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        StudyGroup studyGroup = studyGroupService.update(groupId, studyGroupDTO);

        return studyGroup == null ? new ResponseEntity<>(HttpStatus.BAD_REQUEST) : new ResponseEntity<>(studyGroup, HttpStatus.CREATED);
    }

    @DeleteMapping("/study_groups/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudyGroup(@PathVariable Long id) {
        studyGroupService.deleteStudyGroup(id);
    }
}
