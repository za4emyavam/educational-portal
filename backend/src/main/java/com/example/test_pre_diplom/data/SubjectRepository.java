package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.Subject;
import com.example.test_pre_diplom.entities.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findAllByStudyGroupsContaining(StudyGroup studyGroup);
    List<Subject> findAllByMainTeacher(Teacher teacher);
}
