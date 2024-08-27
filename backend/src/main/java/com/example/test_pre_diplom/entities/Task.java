package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Generated;


import java.time.LocalDateTime;


@Data
@Entity
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subjectId;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "task_type")
    private TaskType task;
    private String title;
    private String description;

    @Generated
    private LocalDateTime createDate;

    @OneToOne(mappedBy = "task", optional = true)
    @JoinColumn(name = "graded_task")
    private GradedTask gradedTask;

    public enum TaskType {
        INFO, LAB, MODULAR
    }

    public Task(Subject subjectId, TaskType task, String title, String description) {
        this.subjectId = subjectId;
        this.task = task;
        this.title = title;
        this.description = description;
    }
}
