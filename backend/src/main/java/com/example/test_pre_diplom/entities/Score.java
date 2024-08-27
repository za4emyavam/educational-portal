package com.example.test_pre_diplom.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Generated;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    @EmbeddedId
    private ScoreId scoreId;

    @ManyToOne()
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task taskId;

    @ManyToOne()
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private Student studentId;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacherId;

    private Integer scoreValue;

    @Generated
    private LocalDateTime evaluationDate;
}
