package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ScoreDTO {
    private Long studentId;
    private Long taskId;
    private Integer value;
    private LocalDateTime evaluationDate;
}
