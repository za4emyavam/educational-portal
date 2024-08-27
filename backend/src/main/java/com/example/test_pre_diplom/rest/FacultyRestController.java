package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.dto.FacultyDTO;
import com.example.test_pre_diplom.service.FacultyService;
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
public class FacultyRestController {
    private final FacultyService facultyService;

    public FacultyRestController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }


    @GetMapping("/faculties")
    public List<Faculty> allFaculties() {
        return facultyService.getAllFaculties();
    }

    @GetMapping("/faculties/{facultyId}")
    public Faculty getFaculty(@PathVariable Long facultyId) {
        return facultyService.getFacultyById(facultyId);
    }

    @PostMapping("/faculties")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> saveFaculty(@Valid @RequestBody FacultyDTO facultyDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Faculty faculty = facultyService.save(facultyDTO);

        return faculty != null ? new ResponseEntity<>(faculty, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping(path = "/faculties/{facultyId}", consumes = "application/json")
    public ResponseEntity<?> updateFaculty(@PathVariable Long facultyId, @Valid @RequestBody FacultyDTO facultyDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage));
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        Faculty faculty = facultyService.update(facultyId, facultyDTO);

        return faculty != null ? new ResponseEntity<>(faculty, HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(path = "/faculties/{facultyId}")
    public void deleteFaculty(@PathVariable Long facultyId) {
        facultyService.delete(facultyId);
    }
}
