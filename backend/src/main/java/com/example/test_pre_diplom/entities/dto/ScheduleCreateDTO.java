package com.example.test_pre_diplom.entities.dto;

import lombok.Data;

@Data
public class ScheduleCreateDTO {
    private Long groupId;
    private Long subjectId;
    private Integer day;
    private Integer number;
    private String classType;
}
