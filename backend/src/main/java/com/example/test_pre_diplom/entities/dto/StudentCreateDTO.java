package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentCreateDTO {
    //TODO validation
    @NotEmpty(message = "Потрібна пошта")
    @Email(message = "Пошта має бути валідною")
    private String email;

    @NotEmpty(message = "Потрібен пароль")
    @Size(min = 8, message = "Пароль має бути не менше 8 символів")
    private String password;

    @NotEmpty(message = "Потрібне ім'я")
    private String firstName;

    @NotEmpty(message = "Потрібне прізвище")
    private String lastName;

    private String patronymic;

    @NotNull(message = "Потрібен номер групи")
    @Min(value = 1, message = "Номер групи не може бути менше 1")
    private Long groupId;
}
