package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TaskLabDTO {
    private String title;
    private String type;
    private String description;
    private Integer maxScore;
    private LocalDate dateTo;
}
