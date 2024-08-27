package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByPersonalData(PersonalData personalData);

    List<Student> findAllByGroupId (StudyGroup studyGroup);
    Optional<Student> findFirstByGroupId (StudyGroup studyGroup);
}
