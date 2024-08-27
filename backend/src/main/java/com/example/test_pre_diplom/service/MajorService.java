package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.FacultyRepository;
import com.example.test_pre_diplom.data.MajorRepository;
import com.example.test_pre_diplom.entities.Faculty;
import com.example.test_pre_diplom.entities.Major;
import com.example.test_pre_diplom.entities.dto.MajorCreateDTO;
import com.example.test_pre_diplom.entities.dto.MajorDTO;
import com.example.test_pre_diplom.exceptions.FacultyNotFoundException;
import com.example.test_pre_diplom.exceptions.MajorNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MajorService {
    private final MajorRepository majorRepository;
    private final FacultyRepository facultyRepository;

    public MajorService(MajorRepository majorRepository, FacultyRepository facultyRepository) {
        this.majorRepository = majorRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<MajorDTO> getAllMajors() {
        List<MajorDTO> result = new ArrayList<>();
        majorRepository.findAll(Sort.by("majorId")).forEach(major -> {
            result.add(new MajorDTO(major));
        });
        return result;
    }

    public MajorDTO getMajorById(Long majorId) {
        Major major = majorRepository.findById(majorId)
                .orElseThrow(() -> new MajorNotFoundException("No major found with id: " + majorId));

        return new MajorDTO(major);
    }

    public MajorDTO save(MajorCreateDTO majorDTO) {
        if (majorRepository.existsById(majorDTO.getMajorId())) {
            throw new MajorNotFoundException("No major found with id: " + majorDTO.getMajorId());
        }
        Faculty faculty = facultyRepository.findById(majorDTO.getFacultyId())
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + majorDTO.getFacultyId()));

        Major major = new Major(majorDTO.getMajorId(), majorDTO.getName(), faculty);

        return new MajorDTO(majorRepository.save(major));
    }

    public MajorDTO update(Long majorId, MajorCreateDTO majorDTO) {
        if (!Objects.equals(majorDTO.getMajorId(), majorId)) {
            throw new MajorNotFoundException("No major found with id: " + majorDTO.getMajorId());
        }
        Major major = majorRepository.findById(majorId)
                .orElseThrow(() -> new MajorNotFoundException("No major found with id: " + majorId));

        Faculty faculty = facultyRepository.findById(majorDTO.getFacultyId())
                .orElseThrow(() -> new FacultyNotFoundException("Faculty not found with id: " + majorDTO.getFacultyId()));

        major.setName(majorDTO.getName());
        major.setFaculty(faculty);
        return new MajorDTO(majorRepository.save(major));
    }

    public void delete(Long majorId) {
        majorRepository.deleteById(majorId);
    }
}
