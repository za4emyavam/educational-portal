package com.example.test_pre_diplom.rest;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.StudyGroupRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import com.example.test_pre_diplom.exceptions.StudyGroupNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public List<StudyGroup> allStudyGroup() {
        return studyGroupRepository.findAll();
    }

    @GetMapping("/study_groups/{id}/students")
    public List<Student> allStudentsByGroup(@PathVariable Long id) {
        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(id);
        if (studyGroup.isEmpty()) {
            throw new StudyGroupNotFoundException("Study group with id: " + id + "not found.");
        }
        return studentRepository.findAllByGroupId(studyGroup.get());
    }

    @GetMapping("/study_group/{id}")
    public ResponseEntity<StudyGroup> getStudyGroup(@PathVariable Long id) {
        Optional<StudyGroup> studyGroup = studyGroupRepository.findById(id);
        if (studyGroup.isPresent())
            return new ResponseEntity<>(studyGroup.get(), HttpStatus.OK);

        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping(path = "/study_group", consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public StudyGroup saveStudyGroup(@RequestBody StudyGroup studyGroup) {
        Optional<Faculty> faculty = facultyRepository.findById(studyGroup.getFaculty().getFacultyId());
        if (faculty.isEmpty()) {
            throw new FacultyNotFoundException("Faculty with id: " + studyGroup.getFaculty().getFacultyId() + " not found.");
        }

        return studyGroupRepository.save(studyGroup);
    }

    @DeleteMapping("/study_group/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudyGroup(@PathVariable Long id) {
        studyGroupRepository.deleteById(id);
    }

    @PutMapping(path = "/study_group/{id}", consumes = "application/json")
    public StudyGroup putStudyGroup(@PathVariable Long id, @RequestBody StudyGroup studyGroup) {
        if (!studyGroupRepository.existsById(id))
            throw new StudyGroupNotFoundException("Study group with id: " + id + "not found.");

        studyGroup.setGroupId(id);

        return studyGroupRepository.save(studyGroup);
    }

    @PatchMapping(path = "/study_group/{id}", consumes = "application/json")
    public StudyGroup patchStudyGroup(@PathVariable Long id, @RequestBody StudyGroup studyGroup) {
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

        return studyGroupRepository.save(updatedStudyGroup);
    }
}
