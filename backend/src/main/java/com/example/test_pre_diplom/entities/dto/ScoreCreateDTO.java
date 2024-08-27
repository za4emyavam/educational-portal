package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ScoreCreateDTO {
    private Long studentId;
    private Long teacherId;
    private Integer value;
}
