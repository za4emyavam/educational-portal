package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MajorCreateDTO {
    @NotNull(message = "Потрібен код спеціальності")
    @Min(value = 1, message = "Код спеціальності потрібен бути більше 0")
    @Max(value = 1000, message = "Код спеціальності потрібен бути менше 1000")
    private Long majorId;

    @NotEmpty(message = "Потрібна назва спеціальності")
    private String name;

    @NotNull(message = "Потрібен код факультета")
    @Min(value = 1, message = "Код факультета потрібен бути більше 0")
    private Long facultyId;
}
