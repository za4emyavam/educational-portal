package com.example.test_pre_diplom.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FileDTO {
    private Long fileId;
    private String filename;
    private String filetype;
    private LocalDateTime uploadedDate;
}
