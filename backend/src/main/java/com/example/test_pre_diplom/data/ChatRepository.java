package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.Chat;
import com.example.test_pre_diplom.entities.Student;
import com.example.test_pre_diplom.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findAllByTaskIdAndStudentId(Task taskId, Student studentId);
    List<Chat> findAllByStudentId(Student studentId);
}
