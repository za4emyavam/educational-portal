package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Member;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByMember (Member member);

    List<Student> findAllByGroupId (StudyGroup studyGroup);
}
