package com.example.test_pre_diplom.data;

import com.example.test_pre_diplom.entities.File;
import com.example.test_pre_diplom.entities.Task;
import com.example.test_pre_diplom.entities.TaskFile;
import com.example.test_pre_diplom.entities.TaskFileId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TaskFileRepository extends JpaRepository<TaskFile, TaskFileId> {
    List<TaskFile> getFilesByTaskId(Task taskId);
}
