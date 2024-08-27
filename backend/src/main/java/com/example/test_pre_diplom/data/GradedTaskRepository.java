package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.GradedTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradedTaskRepository extends JpaRepository<GradedTask, Long> {
}
