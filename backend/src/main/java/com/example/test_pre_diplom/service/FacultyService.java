package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.dto.FacultyDTO;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll(Sort.by("facultyId"));
    }

    public Faculty getFacultyById(Long facultyId) {
        return facultyRepository.findById(facultyId)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty with id: " + facultyId + " not found" ));
    }

    public Faculty save(FacultyDTO facultyDTO) {
        Faculty savedFaculty = new Faculty();
        savedFaculty.setName(facultyDTO.getName());
        return facultyRepository.save(savedFaculty);
    }

    public Faculty update(Long facultyId, FacultyDTO facultyDTO) {
        if (!facultyRepository.existsById(facultyId))
            throw new FacultyNotFoundException("Faculty with id: " + facultyId + " not found");

        return facultyRepository.save(new Faculty(facultyId, facultyDTO.getName()));
    }

    public void delete(Long facultyId) {
        facultyRepository.deleteById(facultyId);
    }
}
