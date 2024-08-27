package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class FacultyDTO {
    @NotEmpty
    private String name;
}
