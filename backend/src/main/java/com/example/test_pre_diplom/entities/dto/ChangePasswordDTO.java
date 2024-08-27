package com.example.test_pre_diplom.entities.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotEmpty(message = "Потрібен поточний пароль")
    private String oldPassword;

    @NotEmpty(message = "Потрібен новий пароль")
    @Size(min = 8, message = "Пароль має бути не менше 8 символів")
    private String newPassword;
}
