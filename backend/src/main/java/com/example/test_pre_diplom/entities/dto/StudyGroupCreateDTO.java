package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudyGroupCreateDTO {
    @NotEmpty(message = "Потрібна назва групи")
    private String groupName;

    @NotNull(message = "Потрібен номер курсу")
    @Min(value = 1, message = "Номер курсу повинен бути більше 0")
    @Max(value = 5, message = "Номер курсу повинен бути менше 5")
    private Integer yearOfStudy;

    @NotNull(message = "Потрібен код спецільаності")
    @Min(value = 1, message = "Код спеціальності не може бути менше 1")
    private Long majorId;
}
