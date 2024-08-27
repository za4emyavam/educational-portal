package com.example.test_pre_diplom.service;

import com.example.test_pre_diplom.data.MajorRepository;
import com.example.test_pre_diplom.data.StudentRepository;
import com.example.test_pre_diplom.data.StudyGroupRepository;
import com.example.test_pre_diplom.entities.Major;
import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.dto.MajorDTO;
import com.example.test_pre_diplom.entities.dto.StudentInfoDTO;
import com.example.test_pre_diplom.entities.dto.StudyGroupCreateDTO;
import com.example.test_pre_diplom.exceptions.AccessDeniedException;
import com.example.test_pre_diplom.exceptions.MajorNotFoundException;
import com.example.test_pre_diplom.exceptions.StudyGroupNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudyGroupService {
    private final StudyGroupRepository studyGroupRepository;
    private final StudentRepository studentRepository;
    private final MajorRepository majorRepository;

    public StudyGroupService(StudyGroupRepository studyGroupRepository, StudentRepository studentRepository, MajorRepository majorRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.studentRepository = studentRepository;
        this.majorRepository = majorRepository;
    }

    public List<StudyGroup> findAll() {
        return studyGroupRepository.findAll(Sort.by("groupId"));
    }

    public List<StudentInfoDTO> allStudentsByGroup(Long studyGroupId) {
        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id: " + studyGroupId + "not found."));

        List<StudentInfoDTO> result = new ArrayList<>();

        studentRepository.findAllByGroupId(studyGroup).forEach(student -> {
            result.add(new StudentInfoDTO(student));
        });

        return result;
    }

    public StudyGroup getStudyGroup(Long studyGroupId) {
        return studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id: " + studyGroupId + " not found."));
    }


    public void deleteStudyGroup(Long studyGroupId) {
        studyGroupRepository.deleteById(studyGroupId);
    }

    public StudyGroup update(Long studyGroupId, StudyGroupCreateDTO studyGroupDTO) {
        Major major = majorRepository.findById(studyGroupDTO.getMajorId())
                .orElseThrow(() -> new MajorNotFoundException("Major with id: " + studyGroupDTO.getMajorId() + " not found."));

        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new StudyGroupNotFoundException("Study group with id: " + studyGroupId + " not found."));

        studyGroup.setYearOfStudy(studyGroupDTO.getYearOfStudy());
        studyGroup.setName(studyGroupDTO.getGroupName());
        studyGroup.setMajor(major);

        return studyGroupRepository.save(studyGroup);
    }

    public StudyGroup save(StudyGroupCreateDTO studyGroup) {
        Major major = majorRepository.findById(studyGroup.getMajorId())
                .orElseThrow(() -> new MajorNotFoundException("Major with id: " + studyGroup.getMajorId() + " not found."));

        if (studyGroupRepository.findFirstByMajorAndYearOfStudyAndName(major, studyGroup.getYearOfStudy(), studyGroup.getGroupName()).isPresent()) {
            throw new AccessDeniedException("Name for major and yearOfStudy pair must be unique");
        }

        StudyGroup savedStudyGroup = new StudyGroup();
        savedStudyGroup.setName(studyGroup.getGroupName());
        savedStudyGroup.setYearOfStudy(studyGroup.getYearOfStudy());
        savedStudyGroup.setMajor(major);

        return studyGroupRepository.save(savedStudyGroup);
    }
}
