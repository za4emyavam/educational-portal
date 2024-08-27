package com.example.test_pre_diplom.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class GradedTask {
    @Id
    private Long taskId;

    @JsonIgnore
    @OneToOne
    @MapsId("taskId")
    @JoinColumn(name = "task_id")
    private Task task;

    private Integer maxScore;
    private LocalDateTime dateTo;

    public GradedTask(Long taskId, Integer maxScore, LocalDateTime dateTo) {
        this.taskId = taskId;
        this.maxScore = maxScore;
        this.dateTo = dateTo;
    }
}
