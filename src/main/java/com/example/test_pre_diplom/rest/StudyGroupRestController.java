package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.StudyGroupRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
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
public class StudyGroupRestController {
    private final StudyGroupRepository studyGroupRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public StudyGroupRestController(StudyGroupRepository studyGroupRepository, StudentRepository studentRepository,
                                    FacultyRepository facultyRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    @GetMapping("/study_groups")
    public CollectionModel<StudyGroup> allStudyGroup() {
        return CollectionModel.of(studyGroupRepository.findAll());
    }

    @GetMapping("/study_groups/{id}/students")
    public CollectionModel<Student> allStudentsByGroup(@PathVariable Long id) {
        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(id);
        if (studyGroup.isEmpty()) {
            throw new StudyGroupNotFoundException("Study group with id: " + id + "not found.");
        }
        return CollectionModel.of(studentRepository.findAllByGroupId(studyGroup.get()));
    }

    @GetMapping("/study_group/{id}")
    public EntityModel<StudyGroup> getStudyGroup(@PathVariable Long id) {
        return EntityModel.of(
                        studyGroupRepository.findById(id)
                                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id: " + id + "not found.")))
                .add(
                        WebMvcLinkBuilder.linkTo(
                                WebMvcLinkBuilder.methodOn(this.getClass()).allStudyGroup()
                        ).withRel("all-study-groups")
                );
    }

    @PostMapping(path = "/study_group", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<StudyGroup> saveStudyGroup(@RequestBody StudyGroup studyGroup) {
        Optional<Faculty> faculty = facultyRepository.findById(studyGroup.getFaculty().getFacultyId());
        if (faculty.isEmpty()) {
            throw new FacultyNotFoundException("Faculty with id: " + studyGroup.getFaculty().getFacultyId() + " not found.");
        }

        studyGroupRepository.save(studyGroup);
        return ResponseEntity.created(
                        ServletUriComponentsBuilder.fromCurrentRequestUri().build().toUri())
                .build();
    }

    @DeleteMapping("/study_group/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudyGroup(@PathVariable Long id) {
        studyGroupRepository.deleteById(id);
    }

    @PutMapping(path = "/study_group/{id}", consumes = "application/json")
    public ResponseEntity<StudyGroup> putStudyGroup(@PathVariable Long id, @RequestBody StudyGroup studyGroup) {
        if (!studyGroupRepository.existsById(id))
            throw new StudyGroupNotFoundException("Study group with id: " + id + "not found.");

        studyGroup.setGroupId(id);
        studyGroupRepository.save(studyGroup);

        return ResponseEntity.created(ServletUriComponentsBuilder.fromCurrentRequest().build().toUri()).build();
    }

    @PatchMapping(path = "/study_group/{id}", consumes = "application/json")
    public ResponseEntity<StudyGroup> patchStudyGroup(@PathVariable Long id, @RequestBody StudyGroup studyGroup) {
        StudyGroup updatedStudyGroup = studyGroupRepository
                .findById(id)
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id: " + id + "not found."));

        if (studyGroup.getName() != null)
            updatedStudyGroup.setName(studyGroup.getName());

        if (studyGroup.getYearOfStudy() != null)
            updatedStudyGroup.setYearOfStudy(studyGroup.getYearOfStudy());

        if (studyGroup.getFaculty() != null) {
            Optional<Faculty> faculty = facultyRepository.findById(studyGroup.getFaculty().getFacultyId());
            if (faculty.isEmpty()) {
                throw new FacultyNotFoundException("Faculty with id: " + studyGroup.getFaculty().getFacultyId() + " not found.");
            }

            updatedStudyGroup.setFaculty(faculty.get());
        }

        studyGroupRepository.save(updatedStudyGroup);

        return ResponseEntity.created(ServletUriComponentsBuilder.fromCurrentRequest().build().toUri()).build();
    }
}
