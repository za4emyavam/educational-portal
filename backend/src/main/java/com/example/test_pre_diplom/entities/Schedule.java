package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private StudyGroup groupId;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subjectId;
    private Integer day;
    private Integer number;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "class_type")
    private ClassType classType;

    public enum ClassType {
        LECTURE, PRACTICAL
    }
}
