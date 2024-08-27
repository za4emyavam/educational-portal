package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.StudyGroup;
import com.example.test_pre_diplom.entities.Subject;
import com.example.test_pre_diplom.entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> getAllBySubjectIdOrderByCreateDateDesc(Subject subjectId);

    @Query("SELECT t FROM Task t JOIN t.subjectId s JOIN s.studyGroups sg WHERE sg = :studyGroup")
    List<Task> findTasksByStudyGroup(StudyGroup studyGroup);

    @Query("SELECT t FROM Task t JOIN t.subjectId s JOIN s.studyGroups sg WHERE sg = :studyGroup " +
            "AND (t.task = 'LAB' OR t.task = 'MODULAR')")
    Page<Task> findTasksByStudyGroup(@Param("studyGroup") StudyGroup studyGroup, Pageable pageable);
}
