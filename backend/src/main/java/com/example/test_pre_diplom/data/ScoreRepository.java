package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, ScoreId> {
    List<Score> findAllByTaskId(Task taskId);
    List<Score> findAllByStudentIdAndTaskIdSubjectId(Student studentId, Subject subjectId);
    List<Score> findAllByStudentId(Student studentId);
    List<Score> findAllByTaskIdSubjectId(Subject subjectId);
    void deleteAllByStudentId(Student studentId);
}
