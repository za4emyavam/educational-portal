package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Major;
import com.example.test_pre_diplom.entities.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    Optional<StudyGroup> findFirstByMajorAndYearOfStudyAndName(Major major, Integer yearOfStudy, String name);
}
