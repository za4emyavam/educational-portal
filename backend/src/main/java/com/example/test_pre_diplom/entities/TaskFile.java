package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class TaskFile {
    @EmbeddedId
    private TaskFileId taskFileId;

    @ManyToOne()
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task taskId;

    @ManyToOne()
    @MapsId("fileId")
    @JoinColumn(name = "file_id")
    private File fileId;
}
