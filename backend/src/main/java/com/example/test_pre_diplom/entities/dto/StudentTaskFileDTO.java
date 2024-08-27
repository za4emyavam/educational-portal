package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class StudentTaskFileDTO {
    private Long studentId;
    private Long taskId;
    private Long fileId;
    private LocalDateTime uploadedDate;
}
