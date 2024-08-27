package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTaskFileRepository extends JpaRepository<StudentTaskFile, StudentTaskFileId> {
    List<StudentTaskFile> findAllByStudentIdAndTaskId(Student student, Task task);
    List<StudentTaskFile> findAllByStudentId(Student student);
    List<StudentTaskFile> findAllByTaskId(Task task);
}
