package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeacherCreateDTO {
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
}
