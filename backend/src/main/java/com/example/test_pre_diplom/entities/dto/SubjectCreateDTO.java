package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class SubjectCreateDTO {
    @NotEmpty(message = "Потрібна назва")
    private String name;

    @NotNull(message = "Потрібен вчитель")
    @Min(value = 1, message = "Потрібен валідний вчитель")
    private Long teacherId;

    @Size(min = 1, message = "Потрібні навчальні групи")
    private List<Long> groups;
}
