package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping(path = "/v1", produces = "application/json")
public class FacultyRestController {
    private final FacultyRepository facultyRepository;

    public FacultyRestController(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @GetMapping("/faculties")
    public CollectionModel<Faculty> allFaculties() {
        return CollectionModel.of(facultyRepository.findAll());
    }

    @GetMapping("/faculty/{id}")
    public EntityModel<Faculty> getFaculty(@PathVariable Long id) {
        return EntityModel.of(
                        facultyRepository.findById(id)
                                .orElseThrow(() -> new FacultyNotFoundException("Faculty with id: " + id + " not found")))
                .add(WebMvcLinkBuilder.linkTo(
                                WebMvcLinkBuilder.methodOn(this.getClass()).allFaculties())
                        .withRel("all-faculties"));
    }

    @PostMapping("/faculty")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Faculty> saveFaculty(@RequestBody Faculty faculty) {
        Faculty savedFaculty = facultyRepository.save(faculty);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().path("/{id}")
                                .build(savedFaculty.getFacultyId()))
                .build();
    }

    @PutMapping(path = "/faculty/{id}", consumes = "application/json")
    public ResponseEntity<Faculty> updateFaculty(@PathVariable Long id, @RequestBody Faculty faculty) {
        if (!facultyRepository.existsById(id))
            throw new FacultyNotFoundException("Faculty with id: " + id + " not found");
        faculty.setFacultyId(id);
        facultyRepository.save(faculty);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequest().build().toUri())
                .build();
    }
}
