package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class FacultyRestController {
    private final FacultyRepository facultyRepository;

    public FacultyRestController(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @GetMapping("/faculties")
    public List<Faculty> allFaculties() {
        return facultyRepository.findAll();
    }

    @GetMapping("/faculty/{id}")
    public ResponseEntity<Faculty> getFaculty(@PathVariable Long id) {
        Optional<Faculty> faculty = facultyRepository.findById(id);
        if (faculty.isPresent()) {
            return new ResponseEntity<>(faculty.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/faculty")
    @ResponseStatus(HttpStatus.CREATED)
    public Faculty saveFaculty(@RequestBody Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    @PutMapping(path = "/faculty/{id}", consumes = "application/json")
    public Faculty updateFaculty(@PathVariable Long id, @RequestBody Faculty faculty) {
        if (!facultyRepository.existsById(id))
            throw new FacultyNotFoundException("Faculty with id: " + id + " not found");
        faculty.setFacultyId(id);

        return facultyRepository.save(faculty);
    }
}
